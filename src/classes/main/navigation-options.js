import { PardusOptionsUtility } from 'pardus-options-library';
import { estimateXYHoleAPCost } from '../../static/helpers.js';

export default class NavigationOptions {
    constructor(options = {
        squad: false,
    }) {
        this.isSquad = options.squad;
        this.id = 'pardus-flight-computer-navigation-calculator-configuration';
        this.configuration = PardusOptionsUtility.getVariableValue('navigation-configuration', {});
        this.#initDriveMap();
    }

    saveConfiguration() {
        PardusOptionsUtility.setVariableValue('navigation-configuration', this.configuration);
    }

    getOptions() {
        const options = {
            drive_speed: 1,
            navigation_level: 0,
            amber_stim: false,
            pathfinder: null,
            wormhole_cost: 10,
            x_hole_cost: 1000,
            exocrab: false,
            boost_active: false,
            gas_flux_capacitor: null,
            energy_flux_capacitor: null,
            wormhole_seals: {
                enif: true,
                nhandu: true,
                procyon: true,
                quaack: true,
            },
        };

        /**
         *  Credit to Asdwolf for the logic from his script
         */
        const epoch = 1449120361000; //December 3, 2015 05:26:01 GMT
        const days = (Date.now() - epoch) / 1000 / 60 / 60 / 24;
        const wormholeCycle = ['procyon', 'nhandu', 'enif', 'quaack'];

        switch (PardusOptionsUtility.getUniverse()) {
            case 'artemis':
            case 'orion':
                options.wormhole_seals[wormholeCycle[Math.floor(days / 2) % 4]] = false;
                break;
            case 'pegasus':
                options.wormhole_seals[wormholeCycle[Math.floor((days + 3) / 2) % 4]] = false;
                break;
            default:
                throw new Error('Unable to determine universe');
        }

        if (this.isSquad) {
            options.drive_speed = 2;
            options.x_hole_cost = Infinity;
            return options;
        }

        if ('drive' in this.configuration) {
            options.drive_speed = this.configuration.drive.speed;
        }

        if ('navigation_level' in this.configuration) {
            options.navigation_level = this.configuration.navigation_level;
        }

        if ('gyro' in this.configuration) {
            options.wormhole_cost = this.configuration.gyro.wormhole_cost;
        }

        if ('gas_flux_capacitor' in this.configuration) {
            options.gas_flux_capacitor = this.configuration.gas_flux_capacitor.strength;
        }

        if ('energy_flux_capacitor' in this.configuration) {
            options.energy_flux_capacitor = this.configuration.energy_flux_capacitor.strength;
        }

        if ('effective_maneuver' in this.configuration) {
            options.x_hole_cost = estimateXYHoleAPCost(this.configuration.effective_maneuver);
        }

        if ('pathfinder' in this.configuration) {
            options.pathfinder = this.configuration.pathfinder;
        }

        return options;
    }

    refreshOptions() {
        return Promise.all([
            this.#refreshShipEquipment(),
            this.#refreshAdvancedSkills(),
            this.#refreshSkills(),
            this.#refreshCrew(),
        ]).then(() => {
            this.saveConfiguration();
        }).then(() => {
            this.reloadHtml();
        });
    }

    #refreshSkills() {
        return this.#fetchPardusPage('overview_stats.php').then((dom) => {
            const maneuver = Number(dom.getElementById('maneuver_actual').childNodes[0].textContent);
            this.configuration.effective_maneuver = maneuver;
        });
    }

    #refreshCrew() {
        return this.#fetchPardusPage('inspect_crew.php').then((dom) => {
            const tables = dom.querySelectorAll('.messagestyle');

            let foundPathfinder = false;

            for (const table of tables) {
                // Primary pathfinder
                if (table.innerText.search(/Primary ability:\s*Pathfinder/) !== -1) {
                    this.configuration.pathfinder = 'primary';
                    foundPathfinder = true;
                    break;
                }

                // Secondary pathfinder
                if (table.innerText.search(/Secondary ability:\s*Pathfinder/) !== -1) {
                    this.configuration.pathfinder = 'secondary';
                    foundPathfinder = true;
                    break;
                }
            }

            if (!foundPathfinder) {
                this.configuration.pathfinder = null;
            }
        });
    }

    #refreshAdvancedSkills() {
        return this.#fetchPardusPage('overview_advanced_skills.php').then((dom) => {
            const tables = dom.querySelectorAll('.messagestyle');
            const lastTable = tables[tables.length - 1];
            const lastRow = lastTable.rows[lastTable.rows.length - 1];
            const navigationLevel = Number(lastRow.cells[2].innerText.split(' ')[1].split('/')[0]);
            this.configuration.navigation_level = navigationLevel;
        });
    }

    #refreshShipEquipment() {
        return this.#fetchPardusPage('overview_ship.php').then((dom) => {
            const tables = dom.querySelectorAll('.messagestyle');
            const shipTable = tables[0];

            let driveRow;

            for (const shipRow of shipTable.rows) {
                if (shipRow.cells[0].innerText == 'Drive:') {
                    driveRow = shipRow;
                }
            }

            if (!driveRow) {
                throw new Error('Failed to identify the row of the ship\'s drive.');
            }

            const driveTd = driveRow.querySelector('td:nth-of-type(2)');
            const driveImage = driveTd.children[0].src.split('/')[driveTd.children[0].src.split('/').length - 1];
            this.configuration.drive = this.driveMap.get(driveImage);

            const specialEquipmentImages = tables[1].querySelectorAll('img');

            delete this.configuration.gyro;
            delete this.configuration.gas_flux_capacitor;
            delete this.configuration.energy_flux_capacitor;

            for (const equipmentImage of specialEquipmentImages) {
                const imageName = equipmentImage.src.split('/')[equipmentImage.src.split('/').length - 1];

                switch (imageName) {
                    case 'gyro_stabilizer_1.png':
                        this.configuration.gyro = {
                            name: 'I',
                            image: 'gyro_stabilizer_1.png',
                            wormhole_cost: 6,
                        };
                        break;
                    case 'gyro_stabilizer_2.png':
                        this.configuration.gyro = {
                            name: 'II',
                            image: 'gyro_stabilizer_2.png',
                            wormhole_cost: 1,
                        };
                        break;
                    case 'flux_capacitor_gas.png':
                        this.configuration.gas_flux_capacitor = {
                            name: 'Weak',
                            image: 'flux_capacitor_gas.png',
                            strength: 'weak',
                        };
                        break;
                    case 'flux_capacitor_gas_strong.png':
                        this.configuration.gas_flux_capacitor = {
                            name: 'Strong',
                            image: 'flux_capacitor_gas_strong.png',
                            strength: 'strong',
                        };
                        break;
                    case 'flux_capacitor_energy.png':
                        this.configuration.energy_flux_capacitor = {
                            name: 'Weak',
                            image: 'flux_capacitor_energy.png',
                            strength: 'weak',
                        };
                        break;
                    case 'flux_capacitor_energy_strong.png':
                        this.configuration.energy_flux_capacitor = {
                            name: 'Strong',
                            image: 'flux_capacitor_energy_strong.png',
                            strength: 'strong',
                        };
                        break;
                    default:
                        // This will trigger for literally all other equipment
                        // throw new Error(`Unexpected equipment '${imageName}'!`);
                }
            }
        });
    }

    #initDriveMap() {
        this.driveMap = new Map();

        this.driveMap.set('drive_nuclear.png', {
            name: 'Nuclear',
            image: 'drive_nuclear.png',
            speed: 1,
        });

        this.driveMap.set('drive_fusion.png', {
            name: 'Fusion',
            image: 'drive_fusion.png',
            speed: 2,
        });

        this.driveMap.set('drive_fusion_enhanced.png', {
            name: 'Enhanced Fusion',
            image: 'drive_fusion_enhanced.png',
            speed: 2,
        });

        this.driveMap.set('drive_ion.png', {
            name: 'Ion',
            image: 'drive_ion.png',
            speed: 3,
        });

        this.driveMap.set('drive_ion_z.png', {
            name: 'Z Series Ion',
            image: 'drive_ion_z.png',
            speed: 3,
        });

        this.driveMap.set('drive_antimatter.png', {
            name: 'Anti-Matter',
            image: 'drive_antimatter.png',
            speed: 4,
        });

        this.driveMap.set('drive_antimatter_enhanced.png', {
            name: 'Enhanced Anti-Matter',
            image: 'drive_antimatter_enhanced.png',
            speed: 4,
        });

        this.driveMap.set('drive_hyper.png', {
            name: 'Hyper',
            image: 'drive_hyper.png',
            speed: 5,
        });

        this.driveMap.set('drive_hyper_z.png', {
            name: 'Z Series Hyper',
            image: 'drive_hyper_z.png',
            speed: 5,
        });

        this.driveMap.set('drive_interphased.png', {
            name: 'Interphased',
            image: 'drive_interphased.png',
            speed: 6,
        });

        this.driveMap.set('drive_interphased_enhanced.png', {
            name: 'Enhanced Interphased',
            image: 'drive_interphased_enhanced.png',
            speed: 6,
        });

        this.driveMap.set('fer_drive_1.png', {
            name: 'Feral Spin Apparatus',
            image: 'fer_drive_1.png',
            speed: 6,
        });
    }

    reloadHtml() {
        if (this.isSquad) {
            document.getElementById(this.id).innerHTML = this.getSquadInnerHtml();
            return;
        }

        document.getElementById(this.id).innerHTML = this.getInnerHtml();
        this.addRefreshListener();
    }

    #fetchPardusPage(page) {
        return fetch(page).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }

            return response.text();
        }).then((html) => {
            const parser = new DOMParser();
            return parser.parseFromString(html, 'text/html');
        });
    }

    getSquadInnerHtml() {
        const driveHtml = `<img src='${PardusOptionsUtility.getImagePackUrl()}squadrons/bomber_squad_3.png' width='32' height='10'/> Bomber squad`;

        return `<tbody><tr><td>Drive:</td><td id='navigation-options-drive'>${driveHtml}</td></tr></tbody>`;
    }

    getInnerHtml() {
        const driveHtml = 'drive' in this.configuration ? `<img src='${PardusOptionsUtility.getImagePackUrl()}equipment/${this.configuration.drive.image}' width='32' height='10'/> ${this.configuration.drive.name}` : 'None';
        const navigationHtml = 'navigation_level' in this.configuration ? `Level ${this.configuration.navigation_level}/3` : 'Level 0/3';
        const gyroHtml = 'gyro' in this.configuration ? `<img src='${PardusOptionsUtility.getImagePackUrl()}equipment/${this.configuration.gyro.image}' width='32' height='10'/> ${this.configuration.gyro.name}` : 'None';
        const gasFluxCapacitorHtml = 'gas_flux_capacitor' in this.configuration ? `<img src='${PardusOptionsUtility.getImagePackUrl()}equipment/${this.configuration.gas_flux_capacitor.image}' width='32' height='10'/> ${this.configuration.gas_flux_capacitor.name}` : 'None';
        const energyFluxCapacitorHtml = 'energy_flux_capacitor' in this.configuration ? `<img src='${PardusOptionsUtility.getImagePackUrl()}equipment/${this.configuration.energy_flux_capacitor.image}' width='32' height='10'/> ${this.configuration.energy_flux_capacitor.name}` : 'None';
        const xYHoleAPCost = 'effective_maneuver' in this.configuration ? `${estimateXYHoleAPCost(this.configuration.effective_maneuver)} <img src='${PardusOptionsUtility.getImagePackUrl()}turns.png' width='9.5'/>` : `2,500 <img src='${PardusOptionsUtility.getImagePackUrl()}turns.png' width='9.5'/>`;
        const pathfinderHtml = 'pathfinder' in this.configuration && this.configuration.pathfinder ? `${this.configuration.pathfinder}` : 'None';

        return `<tbody><tr><td>Drive: </td><td id='navigation-options-drive'>${driveHtml}</td></tr><tr><td>Navigation skill: </td><td id='navigation-options-skill'>${navigationHtml}</td></tr><tr><td>Gyro Stabilizer: </td><td id='navigation-options-gyro'>${gyroHtml}</td></tr><tr><td>Gas Flux Capacitor: </td><td id='navigation-options-gas'>${gasFluxCapacitorHtml}</td></tr><tr><td>Energy Flux Capacitor: </td><td id='navigation-options-energy'>${energyFluxCapacitorHtml}</td></tr><tr><td>X/Y-hole jump cost: </td><td id='navigation-options-xyhole'>${xYHoleAPCost}</td></tr><tr><td>Pathfinder: </td><td id='navigation-options-pathfinder'>${pathfinderHtml}</td></tr><tr><td colspan='2' align='center'><input id='refresh-navigation-options' type='submit' tabindex='-1' value='Refresh'/></td></tr></tbody>`;
    }

    addRefreshListener() {
        const button = document.getElementById('refresh-navigation-options');

        if (!button) {
            return;
        }

        button.addEventListener('click', () => {
            button.setAttribute('disabled', 'true');
            button.value = 'Refreshing...';
            button.setAttribute('style', 'text-align: center; color: green; background-color: silver');
            this.refreshOptions().finally(() => {
                button.removeAttribute('disabled');
                button.value = 'Plot route';
                button.setAttribute('style', 'text-align: center;');
            });
        });
    }

    toString() {
        return this.getHtml();
    }

    getHtml() {
        if (this.isSquad) {
            return `<table id='${this.id}' style='width: 100%;'>${this.getSquadInnerHtml()}</table>`;
        }

        return `<table id='${this.id}' style='width: 100%;'>${this.getInnerHtml()}</table>`;
    }
}
