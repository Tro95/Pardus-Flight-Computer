import { Sectors } from 'pardus-library';
import NavigationFavourites from './navigation-favourites.js';
import NavigationOptions from './navigation-options.js';

export default class NavigationCalculatorPopup {
    constructor(options = {
        squad: false,
    }) {
        this.isSquad = options.squad;
        this.id = 'pardus-flight-computer-navigation-calculator-popup';
        this.navigationOptions = new NavigationOptions(options);
        this.navigationFavourites = new NavigationFavourites();

        if (document.getElementById(this.id)) {
            this.element = document.getElementById(this.id);
        } else {
            this.#create();
        }
    }

    isVisible() {
        return !this.element.style.display;
    }

    show() {
        this.element.style.display = '';
        document.getElementById('select-sector').focus();
    }

    hide() {
        this.element.style.display = 'none';
        document.getElementById('select-sector').blur();
    }

    #getSectorSelectHtml(id) {
        let html = `<select id='select-${id}'><option value='' disabled selected>-- Target Sector --</option>`;

        for (const sector of Sectors) {
            html += `<option value="${sector[0]}">${sector[0]}</option>`;
        }

        html += '</select>';

        return html;
    }

    /**
     * Prevents keypresses from interacting with other parts of this script or other scripts
     */
    #addKeyDownListener() {
        this.element.addEventListener('keydown', (event) => {
            event.stopPropagation();
        });
    }

    getRouteFrom(startTileId) {
        const targetSector = document.getElementById('select-sector').value;
        const targetX = Number(document.getElementById('target-x').value);
        const targetY = Number(document.getElementById('target-y').value);

        const targetTileId = Sectors.getTileIdFromSectorAndCoords(targetSector, targetX, targetY);

        return this.#getRouteTo([startTileId, targetTileId]);
    }

    #getRouteTo(waypoints = []) {
        const url = 'https://pardusapcalculator.uk';
        const options = this.navigationOptions.getOptions();

        return fetch(`${url}/route?${new URLSearchParams({
            waypoints: waypoints.join(','),
            options: encodeURIComponent(JSON.stringify(options)),
        })}`).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }

            return response.json();
        }).then((json) => json.path);
    }

    // Credit to Victoria Axworthy (Orion), and Math (Orion)
    #create() {
        this.element = document.createElement('div');
        this.element.id = this.id;
        const width = 520;

        Object.assign(this.element.style, {
            backgroundColor: '#00002C',
            border: '2px outset #335',
            left: '50%',
            top: '35%',
            width: `${width}px`,
            marginLeft: `${-width / 2}px`,
            marginTop: `${-175 / 2}px`,
            position: 'fixed',
            zIndex: 9,
            display: 'none',
        });

        this.element.innerHTML = `<table style='width: inherit;'><tbody><tr><th colspan='2'>Navigate to destination</th></tr><tr style='height: 50px;'><td style='text-align: center;'><label for='select-sector'>Sector: </label>${this.#getSectorSelectHtml('sector')}</td><td style='text-align: center;'><label for='target-x'>x: <input id='target-x' type='number' min=0 max=100 maxlength=3 size=3/> <label for='target-y'>y: <input id='target-y' type='number' min=0 max=100 maxlength=3 size=3/></td></tr><tr><td id='destination-favourites' style='width: 50%;padding: 5px;border-style: dotted;border-color: gray;border-width: thin;'>${this.navigationFavourites}</td><td id='navigation-ship-equipment' style='width: 50%;padding: 5px;border-style: dotted;border-color: gray;border-width: thin;'>${this.navigationOptions.getHtml()}</td></tr><tr><td colspan='2' style='text-align: center;padding-top:20px;'><input type='submit' id='navigate-to-destination' value='Plot route'/></td></tr><tr><td colspan='2' style='text-align: right;'><input type='submit' id='close-navigation-calculator-popup' value='Cancel'/></td></tr></tbody></table>`;

        document.body.appendChild(this.element);
        document.getElementById('close-navigation-calculator-popup').addEventListener('click', () => {
            this.hide();
        });

        this.#addKeyDownListener();
        this.navigationOptions.addRefreshListener();
        this.navigationFavourites.addEventListeners();
    }

    getCalculateButtonElement() {
        return document.getElementById('navigate-to-destination');
    }
}
