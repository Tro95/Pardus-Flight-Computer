import { PardusOptionsUtility } from 'pardus-options-library';
import { Msgframe, Sectors } from 'pardus-library';
import NavigationCalculatorPopup from './navigation-calculator-popup.js';
import Tilestring from './tilestring.js';

const STOP_BORDER_COLOUR = '#f0f';
const STOP_GLYPH = '\u23F9';

export default class Nav {
    #recordingListeners = new Map();
    #decoratedStopIds = new Set();

    constructor(navArea, optionsPrefix, isSquad) {
        this.navArea = navArea;
        this.optionsPrefix = optionsPrefix;
        this.isSquad = isSquad;
        this.apCalculatorBaseUrl = PardusOptionsUtility.getVariableValue('ap_calculator_base_url', 'https://pardusapcalculator.uk');

        this.defaultColour = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}default_colour`, 'g');
        this.tilestring = new Tilestring(
            PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}tiles_to_highlight`, ''),
            this.defaultColour,
        );

        this.#addAutopilot();
        this.#addNavigationCalculatorPopup();

        document.addPardusKeyDownListener('toggle_recording_keypress', { code: 82 }, this.#addRecordingToggleHander);

        this.#partialRefresh();
        this.navArea.addAfterRefreshHook(() => {
            this.#partialRefresh();
        });
    }

    #partialRefresh() {
        this.navArea.addTilesHighlight(this.tilestring.colourMap);
        this.#refreshStopDecorations();
        if (!this.isSquad) {
            this.#addRecording();
            this.#highlightRecordedTiles();
        }
        this.#addPathFinding();
    }

    #refreshStopDecorations() {
        const wantStops = this.tilestring.stopIds;

        const removed = [];
        for (const id of this.#decoratedStopIds) {
            if (!wantStops.has(id)) {
                removed.push(id);
            }
        }
        if (removed.length > 0) {
            this.navArea.removeTilesBorder(removed, STOP_BORDER_COLOUR);
            this.navArea.removeTilesGlyph(removed, STOP_GLYPH);
        }

        if (wantStops.size > 0) {
            const ids = [...wantStops];
            this.navArea.addTilesBorder(new Map(ids.map((id) => [id, STOP_BORDER_COLOUR])));
            this.navArea.addTilesGlyph(new Map(ids.map((id) => [id, STOP_GLYPH])));
        }

        this.#decoratedStopIds = wantStops;
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
                    if (!pathTile.pathHighlighted) {
                        pathTile.pathHighlighted = true;
                        if (pathTile.isHighlighted()) {
                            pathTile.emphasiseHighlight();
                        } else {
                            pathTile.addHighlight(PardusOptionsUtility.getVariableValue('default_path_colour', 'y'));
                        }
                    }
                }
            }, {
                nonce: `path_finding_mouseenter_${tile.id}`,
            });

            tile.addEventListener('mouseleave', () => {
                for (const pathTile of path) {
                    if (pathTile.isEmphasised()) {
                        pathTile.removeEmphasis();
                    } else {
                        pathTile.removeHighlight(PardusOptionsUtility.getVariableValue('default_path_colour', 'y'));
                    }
                    pathTile.pathHighlighted = false;
                }
            }, {
                nonce: `path_finding_mouseleave_${tile.id}`,
            });

            if (tile.element.querySelector(':hover')) {
                for (const pathTile of path) {
                    if (!pathTile.pathHighlighted) {
                        pathTile.pathHighlighted = true;
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
            PardusOptionsUtility.setVariableValue('expected_route', []);
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
        }

        // Always clear expected_route after reading it, to prevent
        // stale routes from being re-processed by delayed gcFunc triggers
        PardusOptionsUtility.setVariableValue('expected_route', []);

        this.#addRecordingListener();
    }

    #addRecordingListener() {
        for (const tile of this.navArea.navigatableTiles()) {
            const path = this.navArea.getPathTo(tile);
            const pathTileIds = path.map((x) => x.id);

            const listener = () => {
                const currentPosition = userloc.toString();
                const recording = PardusOptionsUtility.getVariableValue('recording', false);
                const modifyRouteRecording = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false);

                if (recording || modifyRouteRecording) {
                    // console.log(`pathTileIds: ${pathTileIds}`);
                    PardusOptionsUtility.setVariableValue('expected_route', pathTileIds);

                    if (currentPosition) {
                        PardusOptionsUtility.setVariableValue('last_tile_id', currentPosition);
                    }

                    // console.log(`expectedRoute: ${PardusOptionsUtility.getVariableValue('expected_route', [])}`);
                }
            };

            tile.addEventListener('click', listener, {
                nonce: `recording_${tile.id}`,
            });
        }
    }

    fly() {
        if (PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false)) {
            Msgframe.sendMessage('Modifying route, cannot use autopilot', 'error');
            return false;
        }

        const checkForNpcs = PardusOptionsUtility.getVariableValue('autopilot_check_for_npcs', true);
        const forwardDirection = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_forward`, true);
        const maxSteps = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_max_steps`, 10);

        const stored = new Tilestring(
            PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}tiles_to_highlight`, ''),
            this.defaultColour,
        );

        if (stored.length === 0) {
            Msgframe.sendMessage('No autopilot path programmed', 'error');
            return false;
        }

        const flight = forwardDirection ? stored : stored.reverse();
        const pathToFly = flight.ids;

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

            const targetId = pathToFly[currentIndexOnPath + step];
            const targetTile = this.navArea.getTileOnNav(targetId);

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

            if (JSON.stringify(directRoute.map((i) => i.id)) !== JSON.stringify(desiredDirectRoute)) {
                break;
            }

            indexToFlyTo = step;

            // A stop flag terminates the click ON this tile, not past it.
            if (flight.isStop(targetId)) {
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
                PardusOptionsUtility.setVariableValue('modified_route', [this.navArea.centreTile.id]);
                // Clear any pending expected_route from the prior flight to prevent
                // a delayed #addRecording() call from corrupting modified_route
                PardusOptionsUtility.setVariableValue('expected_route', []);
            } else {
                const modifiedRoute = PardusOptionsUtility.getVariableValue('modified_route', []);

                if (modifiedRoute.length < 2) {
                    Msgframe.sendMessage('Cancelling route modification', 'info');
                    return;
                }

                const stored = new Tilestring(
                    PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}tiles_to_highlight`, ''),
                    this.defaultColour,
                );
                const updated = stored.spliceSegment(
                    modifiedRoute[0],
                    modifiedRoute[modifiedRoute.length - 1],
                    modifiedRoute,
                );

                if (!updated) {
                    Msgframe.sendMessage('Route modification must start and end on the existing route', 'error');
                    return;
                }

                PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}tiles_to_highlight`, updated.toString());
                this.tilestring = updated;

                this.navArea.clearTilesHighlights();
                this.navArea.addTilesHighlight(this.tilestring.colourMap);
                this.#refreshStopDecorations();
                this.#highlightRecordedTiles();

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
            const tileString = route.path.join(',');
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}tiles_to_highlight`, tileString);
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}autopilot_forward`, true);
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}modify_route`, false);
            this.navigationCalculatorPopup.clearPreview();
            this.navigationCalculatorPopup.hide();
            Msgframe.sendMessage('Plotted route to destination', 'info');

            this.tilestring = new Tilestring(tileString, this.defaultColour);

            this.navArea.clearTilesHighlights();
            this.navArea.addTilesHighlight(this.tilestring.colourMap);
            this.#refreshStopDecorations();
            this.#highlightRecordedTiles();
        }).catch(() => {
            Msgframe.sendMessage('Unable to get route to destination', 'error');
        }).finally(() => {
            this.navigationCalculatorPopup.getCalculateButtonElement().removeAttribute('disabled');
            this.navigationCalculatorPopup.getCalculateButtonElement().value = 'Plot route';
            this.navigationCalculatorPopup.getCalculateButtonElement().setAttribute('style', 'text-align: center;');
        });
    }

    #previewPath(event) {
        if (!this.navigationCalculatorPopup.isVisible()) {
            return;
        }

        event.preventDefault();

        const button = this.navigationCalculatorPopup.getPreviewButtonElement();

        button.setAttribute('disabled', 'true');
        button.value = 'Estimating...';
        button.setAttribute('style', 'text-align: center; color: green; background-color: silver');

        this.navigationCalculatorPopup.getRouteFrom(this.navArea.centreTile.id).then((route) => {
            this.navigationCalculatorPopup.renderPreview(route);
        }).catch(() => {
            Msgframe.sendMessage('Unable to estimate the cost of that route', 'error');
        }).finally(() => {
            button.removeAttribute('disabled');
            button.value = 'Preview cost';
            button.setAttribute('style', 'text-align: center;');
        });
    }

    #addNavigationCalculatorPopup() {
        this.navigationCalculatorPopup = new NavigationCalculatorPopup({
            squad: this.isSquad,
            apCalculatorBaseUrl: this.apCalculatorBaseUrl,
        });

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

        this.navigationCalculatorPopup.element.addPardusKeyDownListener('plot_key', { code: 13 }, (keyEvent) => {
            this.#plotPath(keyEvent);
        });
        this.navigationCalculatorPopup.getCalculateButtonElement().addEventListener('click', (keyEvent) => {
            this.#plotPath(keyEvent);
        });
        this.navigationCalculatorPopup.getPreviewButtonElement().addEventListener('click', (keyEvent) => {
            this.#previewPath(keyEvent);
        });
    }
}
