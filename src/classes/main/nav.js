import { PardusOptionsUtility } from 'pardus-options-library';
import { Sectors } from 'pardus-library';
import { Msgframe } from '../pages/index.js';
import NavigationCalculatorPopup from './navigation-calculator-popup.js';

/* global userloc */

export default class Nav {
    #recordingListeners = new Map();

    constructor(navArea, optionsPrefix, isSquad) {
        this.navArea = navArea;
        this.optionsPrefix = optionsPrefix;
        this.isSquad = isSquad;

        this.tileString = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}tiles_to_highlight`, '');
        this.defaultColour = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}default_colour`, 'g');
        this.tileMap = new Map();

        // Initialise the tile set
        for (const tileStr of this.tileString.split(',')) {
            const tileIdAndColour = tileStr.split('|');

            if (tileIdAndColour.length === 1) {
                this.tileMap.set(tileIdAndColour[0], this.defaultColour);
            } else {
                this.tileMap.set(tileIdAndColour[0], tileIdAndColour[1]);
            }
        }

        this.#addAutopilot();
        this.#addNavigationCalculatorPopup(optionsPrefix);

        document.addPardusKeyDownListener('toggle_recording_keypress', { code: 82 }, this.#addRecordingToggleHander);

        this.#partialRefresh();
        this.navArea.addAfterRefreshHook(() => { this.#partialRefresh(); });
        // this.navArea.refresh();
    }

    #partialRefresh() {
        // console.log('Partial refresh called');
        // console.trace();
        this.navArea.addTilesHighlight(this.tileMap);
        if (!this.isSquad) {
            this.#addRecording();
            this.#highlightRecordedTiles();
        }
        this.#addPathFinding();
    }

    #highlightRecordedTiles() {
        if (this.isSquad) {
            return;
        }

        const highlightTiles = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}highlight_tiles`, true);

        if (!highlightTiles) {
            return;
        }

        const recordedTileColour = PardusOptionsUtility.getVariableValue('recorded_tile_colour', 'c');
        const badRecordedTileColour = PardusOptionsUtility.getVariableValue('bad_recorded_tile_colour', 'r');
        const recordedTiles = new Map(PardusOptionsUtility.getVariableValue('recorded_tiles', []).map((x) => [x, recordedTileColour]));
        const badRecordedTiles = new Map(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []).map((x) => [x, badRecordedTileColour]));

        this.navArea.addTilesHighlight(recordedTiles);
        this.navArea.addTilesHighlight(badRecordedTiles);
    }

    #addPathFinding() {
        for (const tile of this.navArea.navigatableTiles()) {
            const path = this.navArea.getPathTo(tile);

            tile.addEventListener('mouseenter', () => {
                for (const pathTile of path) {
                    if (!pathTile.path_highlighted) {
                        pathTile.path_highlighted = true;
                        if (pathTile.isHighlighted()) {
                            pathTile.emphasiseHighlight();
                        } else {
                            pathTile.addHighlight(PardusOptionsUtility.getVariableValue('default_path_colour', 'y'));
                        }
                    }
                }
            }, {
                nonce: `path_finding_mouseenter_${tile.id}`
            });

            tile.addEventListener('mouseleave', () => {
                for (const pathTile of path) {
                    if (pathTile.isEmphasised()) {
                        pathTile.removeEmphasis();
                    } else {
                        pathTile.removeHighlight(PardusOptionsUtility.getVariableValue('default_path_colour', 'y'));
                    }
                    pathTile.path_highlighted = false;
                }
            }, {
                nonce: `path_finding_mouseleave_${tile.id}`
            });

            if (tile.element.querySelector(':hover')) {
                for (const pathTile of path) {
                    if (!pathTile.path_highlighted) {
                        pathTile.path_highlighted = true;
                        if (pathTile.isHighlighted()) {
                            pathTile.emphasiseHighlight();
                        } else {
                            pathTile.addHighlight(PardusOptionsUtility.getVariableValue('default_path_colour', 'y'));
                        }
                    }
                }
            }
        }
    }

    #addRecordingToggleHander() {
        const recording = PardusOptionsUtility.getVariableValue('recording', false);

        if (recording) {
            Msgframe.sendMessage('Recording stopped', 'info');
        } else {
            Msgframe.sendMessage('Recording started', 'info');
        }

        PardusOptionsUtility.setVariableValue('recording', !recording);
    }

    #addRecording() {
        const currentPosition = userloc.toString();
        const expectedRoute = PardusOptionsUtility.getVariableValue('expected_route', []);

        const recordingMode = PardusOptionsUtility.getVariableValue('recording_mode', 'all');
        const recording = PardusOptionsUtility.getVariableValue('recording', false);
        const modifyRouteRecording = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false);

        if (recording || modifyRouteRecording) {
            const recordedTiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));
            const badRecordedTiles = new Set(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []));
            const modifiedRoute = PardusOptionsUtility.getVariableValue('modified_route', []);

            if (expectedRoute.includes(currentPosition)) {
                for (const flownTile of expectedRoute) {
                    if (recording && (recordingMode === 'all' || recordingMode === 'good')) {
                        recordedTiles.add(flownTile);
                    }

                    if (modifyRouteRecording) {
                        if (modifiedRoute.indexOf(flownTile) < 0) {
                            modifiedRoute.push(flownTile);
                        }
                    }

                    badRecordedTiles.delete(flownTile);

                    if (flownTile === currentPosition) {
                        break;
                    }
                }
            }

            PardusOptionsUtility.setVariableValue('recorded_tiles', Array.from(recordedTiles));
            PardusOptionsUtility.setVariableValue('bad_recorded_tiles', Array.from(badRecordedTiles));
            PardusOptionsUtility.setVariableValue('modified_route', modifiedRoute);
            PardusOptionsUtility.setVariableValue('expected_route', []);

            for (const tile of this.navArea.navigatableTiles()) {
                const path = this.navArea.getPathTo(tile);
                const pathTileIds = path.map((x) => x.id);

                const listener = () => {
                    console.log(`pathTileIds: ${pathTileIds}`);
                    PardusOptionsUtility.setVariableValue('expected_route', pathTileIds);
                    console.log(`expected_route: ${PardusOptionsUtility.getVariableValue('expected_route', [])}`);
                }

                tile.addEventListener('click', listener, {
                    nonce: `recording_${tile.id}`
                });
            }
        }

        if (currentPosition) {
            PardusOptionsUtility.setVariableValue('last_tile_id', currentPosition);
        }
    }

    // #setExpectedRoute(clickEvent) {
    //     console.log(pathTileIds);
    //     PardusOptionsUtility.setVariableValue('expected_route', pathTileIds);
    // }

    fly() {
        if (PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false)) {
            Msgframe.sendMessage('Modifying route, cannot use autopilot', 'error');
            return false;
        }

        const tileString = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}tiles_to_highlight`, '');
        const path = [];

        const checkForNpcs = PardusOptionsUtility.getVariableValue('autopilot_check_for_npcs', true);

        // Initialise the tile set
        for (const tileStr of tileString.split(',')) {
            path.push(tileStr.split('|')[0]);
        }

        if (path.length === 0) {
            Msgframe.sendMessage('No autopilot path programmed', 'error');
            return false;
        }

        const forwardDirection = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_forward`, true);
        const maxSteps = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_max_steps`, 10);

        const pathToFly = path;

        if (!forwardDirection) {
            pathToFly.reverse();
        }

        const currentLocation = this.navArea.centreTile.id;
        const currentIndexOnPath = pathToFly.indexOf(currentLocation);

        // Do not fly if we are not currently on the path
        if (currentIndexOnPath < 0) {
            Msgframe.sendMessage('You are not on the autopilot path', 'error');
            return false;
        }

        // Are we at the end of the path?
        if (currentIndexOnPath === pathToFly.length - 1) {
            Msgframe.sendMessage('Autopilot has reached the end of the path', 'info');
            return false;
        }

        // By default, do not move
        let indexToFlyTo = 0;

        // Now try to see if we can move further along the path in a single click
        for (let step = 1; step <= maxSteps; step += 1) {
            if (currentIndexOnPath + step > pathToFly.length - 1) {
                break;
            }

            const targetTile = this.navArea.getTileOnNav(pathToFly[currentIndexOnPath + step]);

            // If the tile is not on the nav screen
            if (!targetTile) {
                break;
            }

            // If the tile has an NPC, we want to stop on the tile before it
            if (checkForNpcs && targetTile.hasNpc()) {
                break;
            }

            const directRoute = this.navArea.getPathTo(targetTile);

            // Can we even get to the target tile?
            if (directRoute.length <= 1) {
                break;
            }

            const desiredDirectRoute = pathToFly.slice(currentIndexOnPath, currentIndexOnPath + 1 + step);

            if (JSON.stringify(directRoute.map((i) => i.id)) === JSON.stringify(desiredDirectRoute)) {
                indexToFlyTo = step;
            } else {
                break;
            }
        }

        if (indexToFlyTo > 0) {
            PardusOptionsUtility.setVariableValue('expected_route', pathToFly.slice(currentIndexOnPath, currentIndexOnPath + indexToFlyTo + 1));
            return this.navArea.nav(pathToFly[currentIndexOnPath + indexToFlyTo]);
        } if (checkForNpcs && currentIndexOnPath + indexToFlyTo < pathToFly.length - 1 && this.navArea.getTileOnNav(pathToFly[currentIndexOnPath + indexToFlyTo + 1])?.hasNpc()) {
            Msgframe.sendMessage('NPC is in the way, please fly around', 'error');
            return false;
        } if (this.navArea.centreTile.isWormhole()) {
            return this.navArea.warp(pathToFly[currentIndexOnPath]);
        } if (this.navArea.centreTile.isXHole() || this.navArea.centreTile.isYHole()) {
            return this.navArea.xhole(pathToFly[currentIndexOnPath + 1]);
        }

        Msgframe.sendMessage(`Unable to fly to ${Sectors.getSectorAndCoordsForTile(pathToFly[currentIndexOnPath + 1])}, please make sure the route is continuous.`, 'error');
        return false;
    }

    #addAutopilot() {
        if (!PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}enable_autopilot`, true)) {
            return;
        }

        document.addPardusKeyDownListener('move_along_path_key', { code: 70 }, () => {
            this.fly();
        });

        document.addPardusKeyDownListener('modify_autopilot_route', { code: 77 }, () => {
            const modifyRoute = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false);
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}modify_route`, !modifyRoute);

            if (!modifyRoute) {
                Msgframe.sendMessage('Modifying route', 'info');
                PardusOptionsUtility.setVariableValue('modified_route', []);
            } else {
                const modifiedRoute = PardusOptionsUtility.getVariableValue('modified_route', []);

                if (modifiedRoute.length < 2) {
                    Msgframe.sendMessage('Cancelling route modification', 'info');
                    return;
                }

                const forward = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_forward`, true);
                const tileString = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}tiles_to_highlight`, '');
                const routeArray = [];

                for (const tileStr of tileString.split(',')) {
                    routeArray.push(tileStr.split('|')[0]);
                }

                if (!forward) {
                    routeArray.reverse();
                }

                const startIndex = routeArray.indexOf(modifiedRoute[0]);
                const endIndex = routeArray.indexOf(modifiedRoute[modifiedRoute.length - 1]);

                if (startIndex < 0 || endIndex < 0) {
                    Msgframe.sendMessage('Route modification must start and end on the existing route', 'error');
                    return;
                }

                if (startIndex > endIndex) {
                    routeArray.splice(endIndex, startIndex + 1 - endIndex, ...modifiedRoute.reverse());
                } else {
                    routeArray.splice(startIndex, endIndex + 1 - startIndex, ...modifiedRoute);
                }

                if (!forward) {
                    routeArray.reverse();
                }

                PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}tiles_to_highlight`, routeArray.join(','));
                this.tileMap = new Map();

                // Initialise the tile set
                for (const tileStr of routeArray) {
                    this.tileMap.set(tileStr.toString(), this.defaultColour);
                }

                this.navArea.refreshTilesToHighlight(this.tileMap);

                Msgframe.sendMessage('Saving route', 'info');
            }
        });

        document.addPardusKeyDownListener('toggle_autopilot_direction', { code: 67 }, () => {
            if (PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false)) {
                Msgframe.sendMessage('Cannot change autopilot direction whilst modifying path', 'error');
                return;
            }

            const forward = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_forward`, false);

            if (forward) {
                Msgframe.sendMessage('Autopilot heading backwards', 'info');
            } else {
                Msgframe.sendMessage('Autopilot heading forward', 'info');
            }

            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}autopilot_forward`, !forward);
        });
    }

    #plotPath(event) {
        if (!this.navigationCalculatorPopup.isVisible()) {
            return;
        }

        event.preventDefault();

        this.navigationCalculatorPopup.getCalculateButtonElement().setAttribute('disabled', 'true');
        this.navigationCalculatorPopup.getCalculateButtonElement().value = 'Plotting...';
        this.navigationCalculatorPopup.getCalculateButtonElement().setAttribute('style', 'text-align: center; color: green; background-color: silver');
        this.navigationCalculatorPopup.getRouteFrom(this.navArea.centreTile.id).then((route) => {
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}tiles_to_highlight`, route.join(','));
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}autopilot_forward`, true);
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}modify_route`, false);
            this.navigationCalculatorPopup.hide();
            Msgframe.sendMessage('Plotted route to destination', 'info');

            this.tileMap = new Map();

            // Initialise the tile set
            for (const tileStr of route) {
                this.tileMap.set(tileStr.toString(), this.defaultColour);
            }

            this.navArea.addTilesHighlight(this.tileMap);
        }).catch(() => {
            Msgframe.sendMessage('Unable to get route to destination', 'error');
        }).finally(() => {
            this.navigationCalculatorPopup.getCalculateButtonElement().removeAttribute('disabled');
            this.navigationCalculatorPopup.getCalculateButtonElement().value = 'Plot route';
            this.navigationCalculatorPopup.getCalculateButtonElement().setAttribute('style', 'text-align: center;');
        });
    }

    #addNavigationCalculatorPopup() {
        this.navigationCalculatorPopup = new NavigationCalculatorPopup({ squad: this.isSquad });

        document.addPardusKeyDownListener('open_navigation_key', { code: 68 }, (keyEvent) => {
            if (!this.navigationCalculatorPopup.isVisible()) {
                this.navigationCalculatorPopup.show();
                keyEvent.preventDefault();
            }
        });

        document.addPardusKeyDownListener('close_navigation_key', { code: 27 }, (keyEvent) => {
            if (this.navigationCalculatorPopup.isVisible()) {
                this.navigationCalculatorPopup.hide();
                keyEvent.preventDefault();
            }
        });

        this.navigationCalculatorPopup.element.addPardusKeyDownListener('close_navigation_key', { code: 27 }, (keyEvent) => {
            if (this.navigationCalculatorPopup.isVisible()) {
                this.navigationCalculatorPopup.hide();
                keyEvent.preventDefault();
            }
        });

        this.navigationCalculatorPopup.element.addPardusKeyDownListener('plot_key', { code: 13 }, (keyEvent) => { this.#plotPath(keyEvent); });
        this.navigationCalculatorPopup.getCalculateButtonElement().addEventListener('click', (keyEvent) => { this.#plotPath(keyEvent); });
    }
}
