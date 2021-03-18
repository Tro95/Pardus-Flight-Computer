/* global PardusOptionsUtility, colours, userloc */

class Tile {
    constructor(element, x, y) {
        this.element = element;
        this.x = x;
        this.y = y;
        this.background_image = this.element.style.backgroundImage;
        this.highlight_string = '';
        this.highlights = [];
        this.emphasised = false;

        const unhighlight_regex = /^\s*linear-gradient.*?, (url\(.*)$/;

        if (unhighlight_regex.test(this.background_image)) {
            this.background_image = this.background_image.match(unhighlight_regex)[1]
        }

        // Get the tile id
        if (this.element.classList.contains('navShip')) {
            this.tile_id = userloc.toString();
        } else if (this.element.children.length > 0 && this.element.children[0].tagName === 'A') {

            const child_element = this.element.children[0];

            // Can we navigate to the tile?
            if (child_element.getAttribute('onclick') === null || child_element.getAttribute('onclick').startsWith('warp')) {
                this.tile_id = userloc.toString();
            } else if (child_element.getAttribute('onclick').startsWith('nav')) {
                this.tile_id = child_element.getAttribute('onclick').match(/^[^\d]*(\d*)[^\d]*$/)[1]; 
            }
        }
    }

    isClickable() {
        if (this.tile_id && parseInt(this.tile_id) > 0) {
            return true;
        }

        return false;
    }

    isNavigatable() {
        if (this.isClickable() && this.element.children[0].getAttribute('onclick') && this.element.children[0].getAttribute('onclick').startsWith('nav')) {
            return true;
        }

        return false;
    }

    isHighlighted() {
        if (this.highlights.length > 0) {
            return true;
        }

        return false;
    }

    addRecordHandler() {
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
        if (this.background_image) {
            this.element.style.backgroundImage = this.background_image;
        } else {
            this.element.style.backgroundColor = ''
            this.element.firstElementChild.style.opacity = 1;
        }

        return true;  
    }

    _getHighlightedColourString() {

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

    getPath(tile) {

        const path_routing = [this.centre_tile];

        for (let step = 0; step < Math.max(Math.abs(this.centre_tile.x - tile.x), Math.abs(this.centre_tile.y - tile.y)); step++) {

            const current_tile = path_routing[step];

            let direction_x = 0;
            let direction_y = 0;

            // Which way do we want to move?
            if (current_tile.x > tile.x) {
                direction_x = -1;
            } else if (current_tile.x < tile.x) {
                direction_x = 1;
            }

            if (current_tile.y > tile.y) {
                direction_y = -1;
            } else if (current_tile.y < tile.y) {
                direction_y = 1;
            }

            path_routing.push(this.grid[current_tile.y + direction_y][current_tile.x + direction_x]);
        }

        return path_routing;
    }

    reload() {
        this.nav_element = document.getElementById('navareatransition');

        if (!this.nav_element || this.nav_element.style.display === "none") {
            this.nav_element = document.getElementById('navarea');
        }

        this.height = this.nav_element.rows.length;
        this.width = this.nav_element.rows[0].childElementCount;

        this.grid = [];

        for (const row of this.nav_element.rows) {
            const row_arr = [];

            for (const tile_td of row.children) {
                const tile_number = parseInt(tile_td.id.match(/[^\d]*(\d*)/)[1]);
                const tile_x = tile_number % this.width;
                const tile_y = Math.floor(tile_number / this.width);

                const tile = new Tile(tile_td, tile_x, tile_y);

                row_arr.push(tile);
            }

            this.grid.push(row_arr);
        }

        const centre_x = Math.floor(this.width / 2);
        const centre_y = Math.floor(this.height / 2);

        this.centre_tile = this.grid[centre_y][centre_x];
        this._highlightTiles();
        this._addRecording();

        if (PardusOptionsUtility.getVariableValue('show_pathing', true)) {
            this._addPathFinding();
        }
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

    _addRecording() {
        for (const tile of this.clickableTiles()) {

            const path = this.getPath(tile);

            tile.addEventListener('click', () => {
                if (PardusOptionsUtility.getVariableValue('recording', false)) {
                    const recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));

                    for (const flown_tile of path) {
                        recorded_tiles.add(flown_tile.tile_id);
                    }

                    PardusOptionsUtility.setVariableValue('recorded_tiles', Array.from(recorded_tiles));
                }
            });
        }
    }

    _highlightTiles() {

        const recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));
        const colour_recorded_tiles = PardusOptionsUtility.getVariableValue('colour_recorded_tiles', true);
        const recorded_tile_colour = PardusOptionsUtility.getVariableValue('recorded_tile_colour', 'c');

        for (const tile of this.clickableTiles()) {
            if (this.tiles_to_highlight.has(tile.tile_id)) {
                tile.highlight(this.tiles_to_highlight.get(tile.tile_id));
            } else if (colour_recorded_tiles && recorded_tiles.has(tile.tile_id)) {
                tile.highlight(recorded_tile_colour);
            }
        }
    }

    _addPathFinding() {
        for (const tile of this.clickableTiles()) {
            const path = this.getPath(tile);

            tile.addEventListener('mouseenter', () => {
                for (const path_tile of path) {
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
                }
            });
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