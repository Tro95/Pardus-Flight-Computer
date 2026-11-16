import { Sectors } from 'pardus-library';
import { PardusOptionsUtility } from 'pardus-options-library';
import NavigationFavourites from './navigation-favourites.js';
import NavigationOptions from './navigation-options.js';

export default class NavigationCalculatorPopup {
    #cachedRoute = null;

    constructor(options = {
        squad: false,
        apCalculatorBaseUrl: 'https://pardusapcalculator.uk',
    }) {
        this.isSquad = options.squad;
        this.id = 'pardus-flight-computer-navigation-calculator-popup';
        this.navigationOptions = new NavigationOptions(options);
        this.navigationFavourites = new NavigationFavourites();
        this.apCalculatorBaseUrl = options.apCalculatorBaseUrl || 'https://pardusapcalculator.uk';

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

    /**
     * Resolves to { path, cost, tiles } for the currently entered destination.
     *
     * The result is cached against the start tile, the target tile and the ship
     * configuration, so previewing a route and then plotting it does not pay for
     * the request twice. Any change to those inputs produces a different key and
     * refetches, which is what stops a stale cost being plotted.
     */
    getRouteFrom(startTileId) {
        let targetTileId;

        try {
            targetTileId = Sectors.getTileIdFromSectorAndCoords(
                document.getElementById('select-sector').value,
                Number(document.getElementById('target-x').value),
                Number(document.getElementById('target-y').value),
            );
        } catch (error) {
            return Promise.reject(error);
        }

        if (!targetTileId || targetTileId === -1) {
            return Promise.reject(new Error('Invalid destination co-ordinates'));
        }

        const options = this.navigationOptions.getOptions();
        const key = `${startTileId}|${targetTileId}|${JSON.stringify(options)}`;

        if (this.#cachedRoute && this.#cachedRoute.key === key) {
            return Promise.resolve(this.#cachedRoute.route);
        }

        return this.#getRouteTo([startTileId, targetTileId], options).then((route) => {
            this.#cachedRoute = { key, route };
            return route;
        });
    }

    #getRouteTo(waypoints = [], options = this.navigationOptions.getOptions()) {
        return fetch(`${this.apCalculatorBaseUrl}/route?${new URLSearchParams({
            waypoints: waypoints.join(','),
            options: encodeURIComponent(JSON.stringify(options)),
        })}`).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }

            return response.json();
        }).then((json) => ({
            path: json.path ?? [],
            cost: json.cost,
            tiles: (json.path ?? []).length,
        }));
    }

    getPreviewButtonElement() {
        return document.getElementById('preview-route-cost');
    }

    #getPreviewElement() {
        return document.getElementById('navigation-route-preview');
    }

    renderPreview(route) {
        const element = this.#getPreviewElement();

        if (!element) {
            return;
        }

        if (!route.path.length) {
            element.innerHTML = '<span style=\'color: #f88;\'>No route found to that destination</span>';
            return;
        }

        const cost = typeof route.cost === 'number'
            ? `${route.cost.toLocaleString()} <img src='${PardusOptionsUtility.getImagePackUrl()}turns.png' width='9.5'/>`
            : 'unknown';

        element.innerHTML = `Estimated cost: <b>${cost}</b> over ${route.tiles} tiles`;
    }

    /**
     * Drops both the displayed estimate and the cached route. Called whenever the
     * destination or the ship configuration may have changed, so that a figure can
     * never be left sitting next to inputs it was not calculated from.
     */
    clearPreview() {
        this.#cachedRoute = null;

        const element = this.#getPreviewElement();

        if (element) {
            element.innerHTML = '';
        }
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

        this.element.innerHTML = `<table style='width: inherit;'><tbody><tr><th colspan='2'>Navigate to destination</th></tr><tr style='height: 50px;'><td style='text-align: center;'><label for='select-sector'>Sector: </label>${this.#getSectorSelectHtml('sector')}</td><td style='text-align: center;'><label for='target-x'>x: <input id='target-x' type='number' min=0 max=100 maxlength=3 size=3/> <label for='target-y'>y: <input id='target-y' type='number' min=0 max=100 maxlength=3 size=3/></td></tr><tr><td id='destination-favourites' style='width: 50%;padding: 5px;border-style: dotted;border-color: gray;border-width: thin;'>${this.navigationFavourites}</td><td id='navigation-ship-equipment' style='width: 50%;padding: 5px;border-style: dotted;border-color: gray;border-width: thin;'>${this.navigationOptions.getHtml()}</td></tr><tr><td colspan='2' id='navigation-route-preview' style='text-align: center;padding-top:15px;height:16px;'></td></tr><tr><td colspan='2' style='text-align: center;padding-top:10px;'><input type='submit' id='preview-route-cost' value='Preview cost'/> <input type='submit' id='navigate-to-destination' value='Plot route'/></td></tr><tr><td colspan='2' style='text-align: right;'><input type='submit' id='close-navigation-calculator-popup' value='Cancel'/></td></tr></tbody></table>`;

        document.body.appendChild(this.element);
        document.getElementById('close-navigation-calculator-popup').addEventListener('click', () => {
            this.hide();
        });

        this.#addKeyDownListener();
        this.#addPreviewInvalidationListeners();
        this.navigationOptions.addRefreshListener();
        this.navigationFavourites.addEventListeners();
    }

    getCalculateButtonElement() {
        return document.getElementById('navigate-to-destination');
    }

    /**
     * Delegated from the popup root because the ship configuration table replaces
     * its own innerHTML on refresh, which would discard listeners bound directly to
     * the refresh button. Favourite 'Load' buttons are covered too: they assign to
     * the inputs programmatically, which fires no input or change event.
     */
    #addPreviewInvalidationListeners() {
        for (const eventName of ['input', 'change']) {
            this.element.addEventListener(eventName, (event) => {
                if (['select-sector', 'target-x', 'target-y'].includes(event.target.id)) {
                    this.clearPreview();
                }
            });
        }

        this.element.addEventListener('click', (event) => {
            if (event.target.id === 'refresh-navigation-options' || event.target.id.endsWith('-load')) {
                this.clearPreview();
            }
        });
    }
}
