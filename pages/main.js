/* global PardusOptionsUtility, colours, userloc, get_sector_coords_obj */

class Tile {
    constructor(element, x, y, tile_id = null, virtual_tile = false) {
        this.x = x;
        this.y = y;
        this.highlight_string = '';
        this.highlights = [];
        this.emphasised = false;
        this.path_highlighted = false;
        this.virtual_tile = virtual_tile;

        if (this.isVirtualTile()) {
            this.tile_id = tile_id.toString();
        } else {
            this.element = element;
            this.background_image = this.element.style.backgroundImage;
            const unhighlight_regex = /^\s*linear-gradient.*?, (url\(.*)$/;

            if (unhighlight_regex.test(this.background_image)) {
                this.background_image = this.background_image.match(unhighlight_regex)[1];
            }

            // Get the tile id
            if (this.element.classList.contains('navShip') && this.element.querySelector('#thisShip')) {
                this.tile_id = userloc.toString();
            } else if (this.element.children.length > 0 && this.element.children[0].tagName === 'A') {

                const child_element = this.element.children[0];

                // Can we navigate to the tile?
                if ((!child_element.hasAttribute('onclick') || child_element.getAttribute('onclick').startsWith('warp')) && (!child_element.hasAttribute('_onclick') || child_element.getAttribute('_onclick').startsWith('warp'))) {
                    this.tile_id = userloc.toString();
                } else if (child_element.hasAttribute('onclick') && child_element.getAttribute('onclick').startsWith('nav')) {
                    this.tile_id = child_element.getAttribute('onclick').match(/^[^\d]*(\d*)[^\d]*$/)[1];
                } else if (child_element.hasAttribute('_onclick') && child_element.getAttribute('_onclick').startsWith('nav')) {
                    // Freeze Frame compatibility
                    this.tile_id = child_element.getAttribute('_onclick').match(/^[^\d]*(\d*)[^\d]*$/)[1];
                } else if (child_element.hasAttribute('_onclick') && child_element.getAttribute('_onclick') === "null") {
                    this.tile_id = userloc.toString();
                }
            } else if (this.element.classList.contains('navShip')) {
                // This only happens on retreating
                this.tile_id = userloc.toString();
            }
        }
    }

    toString() {
        return `Tile ${this.tile_id} [${this.x}, ${this.y}]`;
    }

    valueOf() {
        return Number(this.tile_id);
    }

    isVirtualTile() {
        return this.virtual_tile;
    }

    isClickable() {
        if (!this.isVirtualTile() && this.tile_id && parseInt(this.tile_id) > 0) {
            return true;
        }

        return false;
    }

    isNavigatable() {
        if (!this.isVirtualTile() && this.element && this.element.children.length > 0 && this.element.children[0].getAttribute('onclick') && this.element.children[0].getAttribute('onclick').startsWith('nav') && this.isClickable()) {
            return true;
        }

        if (!this.isVirtualTile() && this.element && this.element.children.length > 0 && this.element.children[0].getAttribute('_onclick') && this.element.children[0].getAttribute('_onclick').startsWith('nav') && this.isClickable()) {
            return true;
        }

        return false;
    }

    isCentreTile() {
        return this.is_centre_tile;
    }

    isHighlighted() {
        if (this.highlights.length > 0) {
            return true;
        }

        return false;
    }

    addRecordHandler() {

        if (this.isVirtualTile()) {
            return false;
        }

        const tile_id_to_add = this.tile_id;

        this.addEventListener('click', () => {
            if (PardusOptionsUtility.getVariableValue('recording', false)) {
                const recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));
                recorded_tiles.add(tile_id_to_add);
                PardusOptionsUtility.setVariableValue('recorded_tiles', Array.from(recorded_tiles));
            }
        });
    }

    addEventListener(event, func) {
        if (this.isNavigatable()) {
            this.element.children[0].addEventListener(event, func);
        }
    }

    highlight(highlight_colour = 'g') {
        if (this.isVirtualTile()) {
            return false;
        }

        for (const colour in colours) {
            if (colours[colour].short_code === highlight_colour) {
                this.highlights.push({
                    red: colours[colour].red,
                    green: colours[colour].green,
                    blue: colours[colour].blue
                });
                break;
            }
        }

        this._refreshHighlightStatus();
    }

    isEmphasised() {
        return this.emphasised;
    }

    emphasiseHighlight() {
        this.emphasised = true;
        this._refreshHighlightStatus();
    }

    removeEmphasis() {
        this.emphasised = false;
        this._refreshHighlightStatus();
    }

    removeHighlight(highlight_colour = 'g') {
        if (this.isVirtualTile()) {
            return false;
        }

        const colour_to_remove = {
            red: 0,
            green: 0,
            blue: 0
        }

        for (const colour in colours) {
            if (colours[colour].short_code === highlight_colour) {
                colour_to_remove.red = colours[colour].red;
                colour_to_remove.green = colours[colour].green;
                colour_to_remove.blue = colours[colour].blue;
                break;
            }
        }

        for (const index in this.highlights) {
            if (this.highlights[index].red === colour_to_remove.red && this.highlights[index].green === colour_to_remove.green && this.highlights[index].blue === colour_to_remove.blue) {
                this.highlights.splice(index, 1);
            }
        }

        this._refreshHighlightStatus();
    }

    _refreshHighlightStatus() {
        if (this.isVirtualTile()) {
            return false;
        }


        if (this.highlights.length === 0) {
            return this._clearAllHighlighting();
        }

        const highlighted_colour_string = this._getHighlightedColourString();
        const emphasis = this.emphasised ? 0.8 : 0.5;

        // Does this tile have a background image?
        if (this.background_image) {
            this.element.style.backgroundImage = `linear-gradient(to bottom, rgba(${highlighted_colour_string},${emphasis}), rgba(${highlighted_colour_string},${emphasis})), ` + this.background_image;
        } else {
            this.element.style.backgroundColor = `rgba(${highlighted_colour_string},1)`;
            this.element.firstElementChild.style.opacity = 1 - emphasis;
        }
    }

    _clearAllHighlighting() {
        if (this.isVirtualTile()) {
            return false;
        }

        if (this.background_image) {
            this.element.style.backgroundImage = this.background_image;
        } else {
            this.element.style.backgroundColor = ''
            this.element.firstElementChild.style.opacity = 1;
        }

        return true;  
    }

    _getHighlightedColourString() {
        if (this.isVirtualTile()) {
            return false;
        }

        // This is probably the world's worst colour-mixing algorithm
        let total_red = 0;
        let total_green = 0;
        let total_blue = 0;

        let number_red = 0;
        let number_green = 0;
        let number_blue = 0;

        for (const colour of this.highlights) {
            total_red += colour.red;
            total_green += colour.green;
            total_blue += colour.blue;

            if (colour.red > 0) {
                number_red += 1;
            }

            if (colour.green > 0) {
                number_green += 1;
            }

            if (colour.blue > 0) {
                number_blue += 1;
            }
        }

        if (number_red === 0) {
            number_red = 1;
        }

        if (number_green === 0) {
            number_green = 1;
        }

        if (number_blue === 0) {
            number_blue = 1;
        }

        return `${Math.floor(total_red / number_red)},${Math.floor(total_green / number_green)},${Math.floor(total_blue / number_blue)}`;
    }
}

class NavArea {
    constructor(tiles_to_highlight = new Map()) {
        this.tiles_to_highlight = tiles_to_highlight;
        this.reload();
    }

    getTileOrVirtual(x, y, reference) {
        if (x >= this.grid[0].length || x < 0 || y < 0 || y >= this.grid.length) {
            const sector_obj = get_sector_coords_obj(reference.tile_id);
            return new Tile(null, x, y, Number(reference.tile_id) + (x - reference.x) + ((y - reference.y) * sector_obj.cols), true);
        }

        return this.grid[y][x];
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
                break;
            }

            let candidate_tile = this.grid[current_tile.y + direction_y][current_tile.x + direction_x];

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
        return this.getPathBetween(this.centre_tile, tile);
    }

    getPathFrom(tile) {
        return this.getPathBetween(tile, this.centre_tile);
    }

    * yieldPathTo(tile) {
        yield* this.yieldPathBetween(this.centre_tile, tile);
    }

    * yieldPathFrom(tile_id, ignore_navigatable = false) {

        const from_tile = this.getTile(tile_id);

        yield* this.yieldPathBetween(from_tile, this.centre_tile, ignore_navigatable);
    }

    reload() {
        this.nav_element = document.getElementById('navareatransition');

        if (!this.nav_element || this.nav_element.style.display === "none") {
            this.nav_element = document.getElementById('navarea');
        }

        this.height = this.nav_element.rows.length;
        this.width = this.nav_element.rows[0].childElementCount;

        this.grid = [];
        this.tiles_map = new Map();

        let hovered_tile = null;

        for (const row of this.nav_element.rows) {
            const row_arr = [];

            for (const tile_td of row.children) {
                const tile_number = parseInt(tile_td.id.match(/[^\d]*(\d*)/)[1]);
                const tile_x = tile_number % this.width;
                const tile_y = Math.floor(tile_number / this.width);

                const tile = new Tile(tile_td, tile_x, tile_y);

                row_arr.push(tile);
                this.tiles_map.set(tile.tile_id, tile);
            }

            this.grid.push(row_arr);
        }

        const centre_x = Math.floor(this.width / 2);
        const centre_y = Math.floor(this.height / 2);

        this.centre_tile = this.grid[centre_y][centre_x];
        this.centre_tile.is_centre_tile = true;

        this._highlightTiles();
        this._addRecording();

        if (PardusOptionsUtility.getVariableValue('show_pathing', true)) {
            this._addPathFinding();
        }
    }

    getTile(tile_id) {
        if (this.tiles_map.has(tile_id)) {
            return this.tiles_map.get(tile_id);
        }

        return null;
    }

    * tiles() {
        for (const row of this.grid) {
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

    _addRecording() {
        const previous_tile_id = PardusOptionsUtility.getVariableValue('last_tile_id', -1);
        const current_position = userloc.toString();
        const expected_route = PardusOptionsUtility.getVariableValue('expected_route', []);

        const recording_mode = PardusOptionsUtility.getVariableValue('recording_mode', 'all');

        if (PardusOptionsUtility.getVariableValue('recording', false)) {

            const recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));
            const bad_recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []));

            if (expected_route.includes(current_position)) {
                for (const flown_tile of expected_route) {

                    if (recording_mode === 'all' || recording_mode === 'good') {
                        recorded_tiles.add(flown_tile);
                    }

                    bad_recorded_tiles.delete(flown_tile);

                    if (flown_tile === current_position) {
                        break;
                    }
                }
            }

            PardusOptionsUtility.setVariableValue('recorded_tiles', Array.from(recorded_tiles));
            PardusOptionsUtility.setVariableValue('bad_recorded_tiles', Array.from(bad_recorded_tiles));

            for (const tile of this.navigatableTiles()) {
                const path = this.getPathTo(tile);
                const path_tile_ids = path.map(x => x.tile_id);

                tile.addEventListener('click', () => {
                    PardusOptionsUtility.setVariableValue('expected_route', path_tile_ids);
                });
            }
        } else {
            PardusOptionsUtility.setVariableValue('expected_route', []);
        }

        if (current_position) {
            PardusOptionsUtility.setVariableValue('last_tile_id', current_position); 
        }
    }

    _highlightTiles() {

        const highlight_tiles = PardusOptionsUtility.getVariableValue('highlight_tiles', true);

        if (!highlight_tiles) {
            return;
        }

        const recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));
        const bad_recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []));
        const colour_recorded_tiles = PardusOptionsUtility.getVariableValue('colour_recorded_tiles', true);
        const recorded_tile_colour = PardusOptionsUtility.getVariableValue('recorded_tile_colour', 'c');
        const bad_recorded_tile_colour = PardusOptionsUtility.getVariableValue('bad_recorded_tile_colour', 'r');

        for (const tile of this.clickableTiles()) {
            if (colour_recorded_tiles && bad_recorded_tiles.has(tile.tile_id)) {
                tile.highlight(bad_recorded_tile_colour);
            } else if (this.tiles_to_highlight.has(tile.tile_id)) {
                tile.highlight(this.tiles_to_highlight.get(tile.tile_id));
            } else if (colour_recorded_tiles && recorded_tiles.has(tile.tile_id)) {
                tile.highlight(recorded_tile_colour);
            }
        }
    }

    _addPathFinding() {

        for (const tile of this.navigatableTiles()) {

            const path = this.getPathTo(tile);

            tile.addEventListener('mouseenter', () => {
                for (const path_tile of path) {
                    if (path_tile.path_highlighted) {
                        continue;
                    }
                    path_tile.path_highlighted = true;
                    if (path_tile.isHighlighted()) {
                        path_tile.emphasiseHighlight();
                    } else {
                        path_tile.highlight(PardusOptionsUtility.getVariableValue('default_path_colour', 'y'));
                    }
                }
            });

            tile.addEventListener('mouseleave', () => {
                for (const path_tile of path) {
                    if (path_tile.isEmphasised()) {
                        path_tile.removeEmphasis();
                    } else {
                        path_tile.removeHighlight(PardusOptionsUtility.getVariableValue('default_path_colour', 'y'));
                    }
                    path_tile.path_highlighted = false;
                }
            });

            if (tile.element.querySelector(':hover')) {
                for (const path_tile of path) {
                    if (path_tile.path_highlighted) {
                        continue;
                    }
                    path_tile.path_highlighted = true;
                    if (path_tile.isHighlighted()) {
                        path_tile.emphasiseHighlight();
                    } else {
                        path_tile.highlight(PardusOptionsUtility.getVariableValue('default_path_colour', 'y'));
                    }
                }
            }
        }
    }
}

class MainPage {

    constructor() {
        this.tile_string = PardusOptionsUtility.getVariableValue('tiles_to_highlight', '');
        this.default_colour = PardusOptionsUtility.getVariableValue('default_colour', 'g');
        this.tile_set = new Map();

        // Initialise the tile set
        for (const tile_str of this.tile_string.split(',')) {
            const tile_id_and_colour = tile_str.split('|');

            if (tile_id_and_colour.length == 1) {
                this.tile_set.set(tile_id_and_colour[0], this.default_colour);
            } else {
                this.tile_set.set(tile_id_and_colour[0], tile_id_and_colour[1]);
            }
        }

        this.nav_area = new NavArea(this.tile_set);

        this.handle_partial_refresh(() => {
            this.nav_area.reload();
        });
    }

    handle_partial_refresh(func) {
        const nav_element = document.getElementById('tdSpaceChart').getElementsByTagName('table')[0];

        // This would be more specific, but it doesn't trigger enough refreshes
        //const nav_element = document.getElementById('nav').parentNode;

        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            func();
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(nav_element, config);
    }
}