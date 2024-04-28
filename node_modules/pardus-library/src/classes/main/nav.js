import Tile from './tile.js';
import { Sectors } from '../static/sectors.js';

export default class NavArea {

    #squad = false;
    #navElement;
    #height;
    #width;
    #grid = [];
    #centreTile;

    #afterRefreshHooks = [];
    #beforeRefreshHooks = [];

    constructor(options = {
        squad: false
    }) {
        this.#squad = options.squad;
        this.refresh();
    }

    /**
     * Add a hook to run after the element is refreshed
     * @function HtmlElement#addAfterRefreshElement
     * @param {function} func Function to call after the element is refreshed
     */
    addAfterRefreshHook(func) {
        this.#afterRefreshHooks.push(func);
    }

    /**
     * Add a hook to run after the element is refreshed
     * @function HtmlElement#addAfterRefreshElement
     * @param {function} func Function to call after the element is refreshed
     */
    addBeforeRefreshHook(func) {
        this.#beforeRefreshHooks.push(func);
    }

    /**
     * Run all hooks that should be called prior to refreshing the element
     * @function Nav#beforeRefresh
     */
    #beforeRefresh() {
        for (const func of this.#beforeRefreshHooks) {
            func();
        }
    }

    /**
     * Run all hooks that should be called after refreshing the element
     * @function Nav#afterRefresh
     * @param {object} opts Optional arguments to be passed to the hooks
     */
    #afterRefresh(opts = {}) {
        for (const func of this.#afterRefreshHooks) {
            func(opts);
        }
    }

    get height() {
        return this.#height;
    }

    get width() {
        return this.#width;
    }

    get grid() {
        return this.#grid;
    }

    get centreTile() {
        return this.#centreTile;
    }

    addTilesHighlights(tiles_to_highlight) {
        for (const tile of this.clickableTiles()) {
            if (tiles_to_highlight.has(tile.id)) {
                tile.addHighlights(tiles_to_highlight.get(tile.id));
            }
        }
    }

    addTilesHighlight(tiles_to_highlight) {
        for (const tile of this.clickableTiles()) {
            if (tiles_to_highlight.has(tile.id)) {
                tile.addHighlight(tiles_to_highlight.get(tile.id));
            }
        }
    }

    clearTilesHighlights() {
        for (const tile of this.clickableTiles()) {
            tile.clearHighlight();
        }
    }

    refresh() {
        this.#beforeRefresh();
        this.#reload();
        this.#afterRefresh();
    }

    #reload() {
        this.#navElement = document.getElementById('navareatransition');

        if (!this.#navElement || this.#navElement.style.display === "none") {
            this.#navElement = document.getElementById('navarea');
        }

        this.#height = this.#navElement.rows.length;
        this.#width = this.#navElement.rows[0].childElementCount;
        this.#grid = [];

        this.tiles_map = new Map();

        let scanned_x = 0;
        let scanned_y = 0;

        for (const row of this.#navElement.rows) {
            const row_arr = [];

            for (const tile_td of row.children) {

                let tile_number;

                /* There's probably no reason not to use the squad logic for normal ships, too */
                if (this.#squad) {
                    tile_number = (scanned_y * this.#width) + scanned_x;
                } else {
                    tile_number = parseInt(tile_td.id.match(/[^\d]*(\d*)/)[1]);
                }

                const tile_x = tile_number % this.#width;
                const tile_y = Math.floor(tile_number / this.#width);

                const tile = new Tile(tile_td, tile_x, tile_y);

                row_arr.push(tile);
                this.tiles_map.set(tile.id, tile);

                scanned_x++;
            }

            this.#grid.push(row_arr);
            scanned_y++;
            scanned_x = 0;
        }

        const centre_x = Math.floor(this.#width / 2);
        const centre_y = Math.floor(this.#height / 2);

        this.#centreTile = this.#grid[centre_y][centre_x];
        this.#centreTile.is_centre_tile = true;

        /* For squads or other situations where no userloc is available */
        if (!this.#centreTile.id || this.#centreTile.id === '-1') {
            if (this.#grid[centre_y - 1][centre_x].id !== '-1') {
                const newId = parseInt(this.#grid[centre_y - 1][centre_x].id) + 1;
                this.#centreTile.id = newId;
            }
        }
    }

    getTileOrVirtual(x, y, reference) {
        if (x >= this.#grid[0].length || x < 0 || y < 0 || y >= this.#grid.length) {
            return Sectors.getSectorForTile(reference.id).getVirtualTile(x, y, reference);
        }

        return this.#grid[y][x];
    }

    * yieldPathBetween(from, to, ignore_navigatable = false) {
        let current_tile = from;
        yield current_tile;

        while (current_tile.x != to.x || current_tile.y != to.y) {

            let direction_x = 0;
            let direction_y = 0;

            // Which way do we want to move?
            if (current_tile.x > to.x) {
                direction_x = -1;
            } else if (current_tile.x < to.x) {
                direction_x = 1;
            }

            if (current_tile.y > to.y) {
                direction_y = -1;
            } else if (current_tile.y < to.y) {
                direction_y = 1;
            }

            if (direction_x == 0 && direction_y == 0) {
                // We should never end up here, as it implies the two co-ords have the same x and y
                break;
            }

            let candidate_tile = this.#grid[current_tile.y + direction_y][current_tile.x + direction_x];

            // Check to see if it's an unpassable tile, in which case the auto-pilot kicks in
            if (!candidate_tile.isNavigatable()) {

                if (candidate_tile.isVirtualTile()) {
                    break;
                }

                // If we're still going diagonally, the auto-pilot cannot do anything smart, so try to go in just one direction
                if (direction_x != 0 && direction_y != 0) {

                    candidate_tile = this.getTileOrVirtual(current_tile.x, current_tile.y + direction_y, current_tile);

                    if (!candidate_tile.isNavigatable()) {

                        candidate_tile = this.getTileOrVirtual(current_tile.x + direction_x, current_tile.y, current_tile);

                        if (!candidate_tile.isNavigatable()) {
                            break;
                        }
                    }
                } else if (direction_x == 0) {
                    // Vertical auto-pilot will attempt to navigate right, then left

                    candidate_tile = this.getTileOrVirtual(current_tile.x + 1, current_tile.y + direction_y, current_tile);

                    if (!candidate_tile.isNavigatable() && !candidate_tile.isVirtualTile()) {

                        candidate_tile = this.getTileOrVirtual(current_tile.x - 1, current_tile.y + direction_y, current_tile);

                        if (!candidate_tile.isNavigatable() && !candidate_tile.isVirtualTile()) {
                            break;
                        }
                    }
                } else if (direction_y == 0) {
                    // Horizontal auto-pilot will attempt to navigate down, then up

                    candidate_tile = this.getTileOrVirtual(current_tile.x + direction_x, current_tile.y + 1, current_tile);

                    if (!candidate_tile.isNavigatable() && !candidate_tile.isVirtualTile()) {

                        candidate_tile = this.getTileOrVirtual(current_tile.x + direction_x, current_tile.y - 1, current_tile);

                        if (!candidate_tile.isNavigatable() && !candidate_tile.isVirtualTile()) {
                            break;
                        }
                    }
                }
            }

            current_tile = candidate_tile;
            yield current_tile;
        }

    }

    getPathBetween(from, to) {
        return Array.from(this.yieldPathBetween(from, to));
    }

    getPathTo(tile) {
        return this.getPathBetween(this.#centreTile, tile);
    }

    getPathFrom(tile) {
        return this.getPathBetween(tile, this.#centreTile);
    }

    * yieldPathTo(tile) {
        yield* this.yieldPathBetween(this.#centreTile, tile);
    }

    * yieldPathFrom(id, ignore_navigatable = false) {
        const from_tile = this.getTile(id);
        yield* this.yieldPathBetween(from_tile, this.#centreTile, ignore_navigatable);
    }

    getTile(id) {
        if (this.tiles_map.has(id)) {
            return this.tiles_map.get(id);
        }

        return null;
    }

    * tiles() {
        for (const row of this.#grid) {
            for (const tile of row) {
                yield tile;
            }
        }
    }

    * clickableTiles() {
        for (const tile of this.tiles()) {
            if (tile.isClickable()) {
                yield tile;
            }
        }
    }

    * navigatableTiles() {
        for (const tile of this.tiles()) {
            if (tile.isNavigatable()) {
                yield tile;
            }
        }
    }

    getTileOnNav(id) {
        for (const tile of this.tiles()) {
            if (tile.id === id) {
                return tile;
            }
        }

        return null;
    }

    nav(id) {
        if (typeof navAjax === 'function') {
            return navAjax(id);
        }

        if (typeof nav === 'function') {
            return nav(id);
        }

        throw new Error('No function for nav or navAjax found!');
    }

    warp(id) {
        if (typeof warpAjax === 'function') {
            return warpAjax(id);
        }

        if (typeof warp === 'function') {
            return warp(id);
        }

        throw new Error('No function for warp or warpAjax found!');
    }

    xhole(id) {
        const validXHoles = [
            '44580', // Nex-0002
            '47811', // Nex-Kataam
            '55343', // Nex-0003
            '83339', // Nex-0001
            '97698', // Nex-0004
            '324730', // Nex-0005
            '379305', // Nex-0006
        ];

        if (!validXHoles.includes(id)) {
            throw new Error(`Destination ${id} is not a valid X-hole!`);
        }

        document.getElementById('xholebox').elements.warpx.value = id;

        if (typeof warpX === 'function') {
            return warpX();
        }

        return document.getElementById("xholebox").submit();
    }
}
