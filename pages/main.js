/* global PardusOptionsUtility, MsgFramePage, colours, userloc, get_sector_coords, get_sector_coords_obj, nav, navAjax, warp, warpAjax, warpX, getTileIdFromSectorAndCoords, getSectors, estimateXYHoleAPCost */

class Tile {
    constructor(element, x, y, tile_id = null, virtual_tile = false) {
        this.x = x;
        this.y = y;
        this.highlight_string = '';
        this.highlights = [];
        this.emphasised = false;
        this.path_highlighted = false;
        this.virtual_tile = virtual_tile;
        this.type = 'regular';
        this.objectType = '';

        if (this.isVirtualTile()) {
            this.tile_id = tile_id.toString();
        } else {
            this.element = element;
            this.background_image = this.element.style.backgroundImage;
            const unhighlight_regex = /^\s*linear-gradient.*?, (url\(.*)$/;

            if (unhighlight_regex.test(this.background_image)) {
                this.background_image = this.background_image.match(unhighlight_regex)[1];
            }

            if (this.element.classList.contains('navNpc')) {
                this.objectType = 'npc';
            }

            if (this.element.classList.contains('navBuilding')) {
                this.objectType = 'building';
            }

            // Get the tile id
            if (this.element.classList.contains('navShip') && this.element.querySelector('#thisShip')) {
                this.tile_id = this.getUserloc();
            } else if (this.element.children.length > 0 && this.element.children[0].tagName === 'A') {

                const child_element = this.element.children[0];

                // Can we navigate to the tile?
                if ((!child_element.hasAttribute('onclick') || child_element.getAttribute('onclick').startsWith('warp')) && (!child_element.hasAttribute('_onclick') || child_element.getAttribute('_onclick').startsWith('warp'))) {
                    this.tile_id = this.getUserloc();

                    if ((child_element.hasAttribute('onclick') && child_element.getAttribute('onclick').startsWith('warp')) || (child_element.hasAttribute('_onclick') && child_element.getAttribute('_onclick').startsWith('warp'))) {
                        this.type = 'wormhole';
                    }
                } else if (child_element.hasAttribute('onclick') && child_element.getAttribute('onclick').startsWith('nav')) {
                    this.tile_id = child_element.getAttribute('onclick').match(/^[^\d]*(\d*)[^\d]*$/)[1];

                    if (this.element.classList.contains('navYhole')) {
                        this.type = 'y-hole';
                    }

                    if (this.element.classList.contains('navXhole')) {
                        this.type = 'x-hole';
                    }
                } else if (child_element.hasAttribute('_onclick') && child_element.getAttribute('_onclick').startsWith('nav')) {
                    // Freeze Frame compatibility
                    this.tile_id = child_element.getAttribute('_onclick').match(/^[^\d]*(\d*)[^\d]*$/)[1];
                } else if (child_element.hasAttribute('_onclick') && child_element.getAttribute('_onclick') === "null") {
                    this.tile_id = this.getUserloc();
                }
            } else if (this.element.classList.contains('navShip')) {
                // This only happens on retreating
                this.tile_id = this.getUserloc();
            }
        }
    }

    isWormhole() {
        return this.type === 'wormhole';
    }

    isXHole() {
        return this.type === 'x-hole';
    }

    isYHole() {
        return this.type === 'y-hole';
    }

    hasNpc() {
        return this.objectType === 'npc';
    }

    setId(id) {
        this.tile_id = id;
    }

    getUserloc() {
        if (typeof userloc !== 'undefined') {
            return userloc.toString();
        } else {
            return '-1';
        }
    }

    toString() {
        return `Tile ${this.tile_id} [${this.x}, ${this.y}]`;
    }

    getHumanString() {
        return get_sector_coords(this.id);
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
    constructor(tiles_to_highlight = new Map(), options = {
        squad: false
    }) {
        this.tiles_to_highlight = tiles_to_highlight;
        this.isSquad = options.squad;

        this.optionsPrefix = this.isSquad ? 'squads_' : '';

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

    refreshTilesToHighlight(tiles_to_highlight) {
        this.tiles_to_highlight = tiles_to_highlight;
        this.reload(true);
    }

    reload(clear = false) {
        this.nav_element = document.getElementById('navareatransition');

        if (!this.nav_element || this.nav_element.style.display === "none") {
            this.nav_element = document.getElementById('navarea');
        }

        this.height = this.nav_element.rows.length;
        this.width = this.nav_element.rows[0].childElementCount;

        this.grid = [];
        this.tiles_map = new Map();

        let scanned_x = 0;
        let scanned_y = 0;

        for (const row of this.nav_element.rows) {
            const row_arr = [];

            for (const tile_td of row.children) {

                let tile_number;

                /* There's probably no reason not to use the squad logic for normal ships, too */
                if (this.isSquad) {
                    tile_number = (scanned_y * this.width) + scanned_x;
                } else {
                    tile_number = parseInt(tile_td.id.match(/[^\d]*(\d*)/)[1]);
                }

                const tile_x = tile_number % this.width;
                const tile_y = Math.floor(tile_number / this.width);

                const tile = new Tile(tile_td, tile_x, tile_y);

                row_arr.push(tile);
                this.tiles_map.set(tile.tile_id, tile);

                scanned_x++;
            }

            this.grid.push(row_arr);
            scanned_y++;
            scanned_x = 0;
        }

        const centre_x = Math.floor(this.width / 2);
        const centre_y = Math.floor(this.height / 2);

        this.centre_tile = this.grid[centre_y][centre_x];
        this.centre_tile.is_centre_tile = true;

        /* For squads or other situations where no userloc is available */
        if (!this.centre_tile.tile_id || this.centre_tile.tile_id === '-1') {
            if (this.grid[centre_y - 1][centre_x].tile_id !== '-1') {
                let newId = parseInt(this.grid[centre_y - 1][centre_x].tile_id) + 1;

                if (isNaN(newId)) {
                    newId = parseInt(this.grid[centre_y + 1][centre_x].tile_id) - 1;
                }

                this.centre_tile.setId(newId.toString());
            }
        }

        this._highlightTiles(clear);

        if (!this.isSquad) {
            this._addRecording();
        }

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

    getTileOnNav(tile_id) {
        for (const tile of this.tiles()) {
            if (tile.tile_id === tile_id) {
                return tile;
            }
        }

        return null;
    }

    _addRecordingToggleHander(event) {
        const recording = PardusOptionsUtility.getVariableValue('recording', false);

        if (recording) {
            MsgFramePage.sendMessage('Recording stopped', 'info');
        } else {
            MsgFramePage.sendMessage('Recording started', 'info');
        }

        PardusOptionsUtility.setVariableValue('recording', !recording);
    }

    _addRecording() {
        const previous_tile_id = PardusOptionsUtility.getVariableValue('last_tile_id', -1);
        const current_position = userloc.toString();
        const expected_route = PardusOptionsUtility.getVariableValue('expected_route', []);

        const recording_mode = PardusOptionsUtility.getVariableValue('recording_mode', 'all');

        const recording = PardusOptionsUtility.getVariableValue('recording', false);
        const modifyRouteRecording = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false);

        document.addPardusKeyDownListener('toggle_recording_keypress', {code: 82}, this._addRecordingToggleHander);

        if (recording || modifyRouteRecording) {

            const recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));
            const bad_recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []));
            const modified_route = PardusOptionsUtility.getVariableValue('modified_route', []);

            if (expected_route.includes(current_position)) {
                for (const flown_tile of expected_route) {

                    if (recording && (recording_mode === 'all' || recording_mode === 'good')) {
                        recorded_tiles.add(flown_tile);
                    }

                    if (modifyRouteRecording) {
                        if (modified_route.indexOf(flown_tile) < 0) {
                            modified_route.push(flown_tile);
                        }
                    }

                    bad_recorded_tiles.delete(flown_tile);

                    if (flown_tile === current_position) {
                        break;
                    }
                }
            }

            PardusOptionsUtility.setVariableValue('recorded_tiles', Array.from(recorded_tiles));
            PardusOptionsUtility.setVariableValue('bad_recorded_tiles', Array.from(bad_recorded_tiles));
            PardusOptionsUtility.setVariableValue('modified_route', modified_route);

            for (const tile of this.navigatableTiles()) {
                const path = this.getPathTo(tile);
                const path_tile_ids = path.map(x => x.tile_id);

                tile.addEventListener('click', () => {
                    PardusOptionsUtility.setVariableValue('expected_route', path_tile_ids);
                });
            }
        }

        PardusOptionsUtility.setVariableValue('expected_route', []);

        if (current_position) {
            PardusOptionsUtility.setVariableValue('last_tile_id', current_position); 
        }
    }

    _highlightTiles(clear = false) {

        const highlight_tiles = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}highlight_tiles`, true);

        if (!highlight_tiles) {
            return;
        }

        const recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));
        const bad_recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []));
        const colour_recorded_tiles = PardusOptionsUtility.getVariableValue('colour_recorded_tiles', true);
        const recorded_tile_colour = PardusOptionsUtility.getVariableValue('recorded_tile_colour', 'c');
        const bad_recorded_tile_colour = PardusOptionsUtility.getVariableValue('bad_recorded_tile_colour', 'r');

        for (const tile of this.clickableTiles()) {
            if (!this.isSquad && colour_recorded_tiles && bad_recorded_tiles.has(tile.tile_id)) {
                tile.highlight(bad_recorded_tile_colour);
            } else if (this.tiles_to_highlight.has(tile.tile_id)) {
                tile.highlight(this.tiles_to_highlight.get(tile.tile_id));
            } else if (!this.isSquad && colour_recorded_tiles && recorded_tiles.has(tile.tile_id)) {
                tile.highlight(recorded_tile_colour);
            } else {
                tile._clearAllHighlighting();
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

    fly() {
        if (PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false)) {
            MsgFramePage.sendMessage('Modifying route, cannot use autopilot', 'error');
            return;
        }

        const tile_string = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}tiles_to_highlight`, '');
        const path = [];

        const check_for_npcs = PardusOptionsUtility.getVariableValue('autopilot_check_for_npcs', true);

        // Initialise the tile set
        for (const tile_str of tile_string.split(',')) {
            path.push(tile_str.split('|')[0]);
        }

        if (path.length === 0) {
            MsgFramePage.sendMessage('No autopilot path programmed', 'error');
            return;
        }

        const forward_direction = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_forward`, true);
        const max_steps = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_max_steps`, 10);

        let path_to_fly = path;

        if (!forward_direction) {
            path_to_fly.reverse()
        }

        const current_location = this.centre_tile.tile_id;
        const current_index_on_path = path_to_fly.indexOf(current_location);

        // Do not fly if we are not currently on the path
        if (current_index_on_path < 0) {
            MsgFramePage.sendMessage('You are not on the autopilot path', 'error');
            return;
        }

        // Are we at the end of the path?
        if (current_index_on_path === path_to_fly.length - 1) {
            MsgFramePage.sendMessage('Autopilot has reached the end of the path', 'info');
            return;
        }

        // By default, do not move
        let index_to_fly_to = 0;

        // Now try to see if we can move further along the path in a single click
        for (let step = 1; step <= max_steps; step++) {
            if (current_index_on_path + step > path_to_fly.length - 1) {
                break;
            }

            const target_tile = this.getTileOnNav(path_to_fly[current_index_on_path + step]);

            // If the tile is not on the nav screen
            if (!target_tile) {
                break;
            }

            // If the tile has an NPC, we want to stop on the tile before it
            if (check_for_npcs && target_tile.hasNpc()) {
                break;
            }

            const direct_route = this.getPathTo(target_tile);

            // Can we even get to the target tile?
            if (direct_route.length <= 1) {
                break;
            }

            const desired_direct_route = path_to_fly.slice(current_index_on_path, current_index_on_path + 1 + step);

            if (JSON.stringify(direct_route.map(i => i.tile_id)) === JSON.stringify(desired_direct_route)) {
                index_to_fly_to = step;
            } else {
                break;
            }
        }

        if (index_to_fly_to > 0) {
            PardusOptionsUtility.setVariableValue('expected_route', path_to_fly.slice(current_index_on_path, current_index_on_path + index_to_fly_to + 1));
            return this._nav(path_to_fly[current_index_on_path + index_to_fly_to]);
        } else if (check_for_npcs && current_index_on_path + index_to_fly_to < path_to_fly.length - 1 && this.getTileOnNav(path_to_fly[current_index_on_path + index_to_fly_to + 1])?.hasNpc()) {
            MsgFramePage.sendMessage('NPC is in the way, please fly around', 'error');
            return;
        } else if (this.centre_tile.isWormhole()) {
            return this._warp(path_to_fly[current_index_on_path]);
        } else if (this.centre_tile.isXHole() || this.centre_tile.isYHole()) {
            return this._xhole(path_to_fly[current_index_on_path + 1]);
        }

        MsgFramePage.sendMessage(`Unable to fly to ${get_sector_coords(path_to_fly[current_index_on_path + 1])}, please make sure the route is continuous.`, 'error');
    }

    _nav(tile_id) {
        if (typeof navAjax === 'function') {
            return navAjax(tile_id);
        }

        if (typeof nav === 'function') {
            return nav(tile_id);
        }

        throw new Error('No function for nav or navAjax found!');
    }

    _warp(tile_id) {
        if (typeof warpAjax === 'function') {
            return warpAjax(tile_id);
        }

        if (typeof warp === 'function') {
            return warp(tile_id);
        }

        throw new Error('No function for warp or warpAjax found!');
    }

    _xhole(tile_id) {
        const validXHoles = [
            '44580', // Nex-0002
            '47811', // Nex-Kataam
            '55343', // Nex-0003
            '83339', // Nex-0001
            '97698', // Nex-0004
            '324730', // Nex-0005
            '379305', // Nex-0006
        ];

        if (!validXHoles.includes(tile_id)) {
            throw new Error(`Destination ${tile_id} is not a valid X-hole!`);
        }

        document.getElementById('xholebox').elements.warpx.value = tile_id;

        if (typeof warpX === 'function') {
            return warpX();
        }

        return document.getElementById("xholebox").submit()
    }
}

class NavigationOptions {
    constructor(options = {
        squad: false
    }) {
        this.isSquad = options.squad;
        this.id = 'pardus-flight-computer-navigation-calculator-configuration';
        this.configuration = PardusOptionsUtility.getVariableValue('navigation-configuration', {});
        this._initDriveMap();
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
            }
        };

        /**
         *  Credit to Asdwolf for the logic from his script 
         */
        const epoch = 1449120361000 //December 3, 2015 05:26:01 GMT
        const days = (Date.now() - epoch)/1000/60/60/24;
        const wormhole_cycle = ['procyon', 'nhandu', 'enif', 'quaack'];

        switch (PardusOptionsUtility.getUniverse()) {
            case 'artemis':
            case 'orion':
                options.wormhole_seals[wormhole_cycle[Math.floor(days / 2) % 4]] = false;
                break;
            case 'pegasus':
                options.wormhole_seals[wormhole_cycle[Math.floor((days + 3) / 2) % 4]] = false;
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
            this._refreshShipEquipment(),
            this._refreshAdvancedSkills(),
            this._refreshSkills(),
            this._refreshCrew(),
        ]).then(() => {
            this.saveConfiguration();
        }).then(() => {
            this.reloadHtml();
        });
    }

    _refreshSkills() {
        return this._fetchPardusPage('overview_stats.php').then((dom) => {
            const maneuver = Number(dom.getElementById('maneuver_actual').childNodes[0].textContent);
            this.configuration.effective_maneuver = maneuver;
        });
    }

    _refreshCrew() {
        return this._fetchPardusPage('inspect_crew.php').then((dom) => {
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

    _refreshAdvancedSkills() {
        return this._fetchPardusPage('overview_advanced_skills.php').then((dom) => {
            const tables = dom.querySelectorAll('.messagestyle');
            const lastTable = tables[tables.length - 1];
            const lastRow = lastTable.rows[lastTable.rows.length - 1];
            const navigationLevel = Number(lastRow.cells[2].innerText.split(' ')[1].split('/')[0]);
            this.configuration.navigation_level = navigationLevel;
        });
    }

    _refreshShipEquipment() {
        return this._fetchPardusPage('overview_ship.php').then((dom) => {
            const tables = dom.querySelectorAll('.messagestyle');
            const driveTd = tables[0].querySelector(' tr:nth-of-type(21) td:nth-of-type(2)');
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
                        }
                        break;
                    case 'flux_capacitor_gas_strong.png':
                        this.configuration.gas_flux_capacitor = {
                            name: 'Strong',
                            image: 'flux_capacitor_gas_strong.png',
                            strength: 'strong',                            
                        }
                        break;
                    case 'flux_capacitor_energy.png':
                        this.configuration.energy_flux_capacitor = {
                            name: 'Weak',
                            image: 'flux_capacitor_energy.png',
                            strength: 'weak',                            
                        }
                        break;
                    case 'flux_capacitor_energy_strong.png':
                        this.configuration.energy_flux_capacitor = {
                            name: 'Strong',
                            image: 'flux_capacitor_energy_strong.png',
                            strength: 'strong',                            
                        }
                        break;
                }
            }
        });
    }

    _initDriveMap() {
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

    _fetchPardusPage(page) {
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

class NavigationFavourite {
    constructor(favouriteNumber) {
        const prefix = 'navigation-favourite-';

        this.number = favouriteNumber;
        this.id = `${prefix}${favouriteNumber}`;

        const existingValue = PardusOptionsUtility.getVariableValue(this.id);

        if (existingValue) {
            this.name = existingValue.name;
            this.value = existingValue.value;
        }
    }

    save() {
        this.name = document.getElementById(`${this.id}-name`).value;
        this.value = {
            sector: document.getElementById('select-sector').value,
            x: document.getElementById('target-x').value,
            y: document.getElementById('target-y').value
        };

        PardusOptionsUtility.setVariableValue(this.id, {
            name: this.name,
            value: this.value
        });
    }

    load() {
        document.getElementById('select-sector').value = this.value.sector;
        document.getElementById('target-x').value = this.value.x;
        document.getElementById('target-y').value = this.value.y;
    }

    addEventListeners() {
        document.getElementById(`${this.id}-save`).addEventListener('click', () => {
            this.save();
            document.getElementById(`${this.id}-save`).setAttribute('disabled', 'true');
            document.getElementById(`${this.id}-save`).value = 'Saved';
            document.getElementById(`${this.id}-save`).setAttribute('style', 'color:green;background-color:silver');
            setTimeout(() => {
                document.getElementById(`${this.id}-save`).removeAttribute('disabled');
                document.getElementById(`${this.id}-save`).value = 'Save';
                document.getElementById(`${this.id}-save`).setAttribute('style', 'color:#D0D1D9;background-color:#00001C;');
            }, 2000);
        });

        document.getElementById(`${this.id}-load`).addEventListener('click', () => {
            this.load();
            document.getElementById(`${this.id}-load`).setAttribute('disabled', 'true');
            document.getElementById(`${this.id}-load`).value = 'Loaded';
            document.getElementById(`${this.id}-load`).setAttribute('style', 'color:green;background-color:silver');
            setTimeout(() => {
                document.getElementById(`${this.id}-load`).removeAttribute('disabled');
                document.getElementById(`${this.id}-load`).value = 'Load';
                document.getElementById(`${this.id}-load`).setAttribute('style', 'color:#D0D1D9;background-color:#00001C;');
            }, 2000);
        });
    }

    _saveButton() {
        return `<input value="Save" id="${this.id}-save" tabindex='-1' type="button" style="color:#D0D1D9;background-color:#00001C;"/>`;
    }

    _loadButton() {
        return `<input value="Load" id="${this.id}-load" tabindex='-1' type="button" style="color:#D0D1D9;background-color:#00001C;"/>`;
    };

    _input() {
        let valueOrPlaceholder = `placeholder='Favourite ${this.number}'`;

        if ('value' in this) {
            valueOrPlaceholder = `value='${this.name}'`;
        }

        return `<input id='${this.id}-name' type='text' tabindex='-1' ${valueOrPlaceholder} style='color:#D0D1D9; background-color:#00001C;width:120px;'></input>`;
    }

    toString() {
        return `<tr><td align='left'>${this._input()}</td><td align='right'>${this._loadButton()} ${this._saveButton()}</td></tr>`
    }
}

class NavigationFavourites {
    constructor() {
        this.id = 'pardus-flight-computer-navigation-calculator-favourites';
        this.numberOfFavourites = PardusOptionsUtility.getVariableValue('navigation_number_of_favourites', 4);
        this.favourites = [];
        this.setupFavourites();
    }

    setupFavourites() {
        for (let i = 1; i <= this.numberOfFavourites; i++) {
            this.favourites.push(new NavigationFavourite(i));
        }
    }

    addEventListeners() {
        for (const favourite of this.favourites) {
            favourite.addEventListeners();
        }
    }

    toString() {
        return this.getHtml();
    }

    getInnerHtml() {
        let html = '';

        for (const favourite of this.favourites) {
            html += favourite;
        }

        return html;
    }

    getHtml() {
        return `<table id='${this.id}' style='width: 100%;'><tbody>${this.getInnerHtml()}</tbody></table>`;
    }
}

class NavigationCalculatorPopup {
    constructor(options = {
        squad: false
    }) {
        this.isSquad = options.squad;
        this.id = 'pardus-flight-computer-navigation-calculator-popup';
        this.navigationOptions = new NavigationOptions(options);
        this.navigationFavourites = new NavigationFavourites();

        if (document.getElementById(this.id)) {
            this.element = document.getElementById(this.id);
        } else {
            this._create();
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

    _getSectorSelectHtml(id) {
        let html = `<select id='select-${id}'><option value='' disabled selected>-- Target Sector --</option>`;

        for (const sector of getSectors()) {
            html += `<option value="${sector}">${sector}</option>`;
        }

        html += '</select>';

        return html;
    }

    /**
     * Prevents keypresses from interacting with other parts of this script or other scripts 
     */
    _addKeyDownListener() {
        this.element.addEventListener('keydown', (event) => {
            event.stopPropagation();
        });
    }

    getRouteFrom(startTileId) {
        const targetSector = document.getElementById('select-sector').value;
        const targetX = Number(document.getElementById('target-x').value);
        const targetY = Number(document.getElementById('target-y').value);

        const targetTileId = getTileIdFromSectorAndCoords(targetSector, targetX, targetY);

        return this._getRouteTo([startTileId, targetTileId]);
    }

    _getRouteTo(waypoints = []) {
        const url = 'https://pardusapcalculator.uk';
        const options = this.navigationOptions.getOptions();

        return fetch(`${url}/route?`+ new URLSearchParams({
            waypoints: waypoints.join(','),
            options: encodeURIComponent(JSON.stringify(options))
        })).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }

            return response.json();
        }).then((json) => {
            return json.path;
        });
    }

    // Credit to Victoria Axworthy (Orion), and Math (Orion)
    _create() {
        this.element = document.createElement('div');
        this.element.id = this.id;
        const width = 520;

        Object.assign(this.element.style, {
            backgroundColor: '#00002C',
            border: '2px outset #335',
            left: '50%',
            top: '35%',
            width: width + 'px',
            marginLeft: -width / 2 + 'px',
            marginTop: -175 / 2 + 'px',
            position: 'fixed',
            zIndex: 9,
            display: 'none',
        });

        this.element.innerHTML = `<table style='width: inherit;'><tbody><tr><th colspan='2'>Navigate to destination</th></tr><tr style='height: 50px;'><td style='text-align: center;'><label for='sector'>Sector: </label>${this._getSectorSelectHtml('sector')}</td><td style='text-align: center;'><label for='target-x'>x: <input id='target-x' type='number' min=0 max=100 maxlength=3 size=3/> <label for='target-y'>y: <input id='target-y' type='number' min=0 max=100 maxlength=3 size=3/></td></tr><tr><td id='destination-favourites' style='width: 50%;padding: 5px;border-style: dotted;border-color: gray;border-width: thin;'>${this.navigationFavourites}</td><td id='navigation-ship-equipment' style='width: 50%;padding: 5px;border-style: dotted;border-color: gray;border-width: thin;'>${this.navigationOptions.getHtml()}</td></tr><tr><td colspan='2' style='text-align: center;padding-top:20px;'><input type='submit' id='navigate-to-destination' value='Plot route'/></td></tr><tr><td colspan='2' style='text-align: right;'><input type='submit' id='close-navigation-calculator-popup' value='Cancel'/></td></tr></tbody></table>`;

        document.body.appendChild(this.element);
        document.getElementById('close-navigation-calculator-popup').addEventListener('click', () => {
            this.hide();
        });

        this._addKeyDownListener();
        this.navigationOptions.addRefreshListener();
        this.navigationFavourites.addEventListeners();
    }

    getCalculateButtonElement() {
        return document.getElementById('navigate-to-destination');
    }
}

class MainPage {

    constructor(options = {
        squad: false
    }) {
        this.optionsPrefix = options.squad ? 'squads_' : '';
        this.tile_string = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}tiles_to_highlight`, '');
        this.default_colour = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}default_colour`, 'g');
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

        this.navArea = new NavArea(this.tile_set, options);
        this._addAutopilot();
        this._addNavigationCalculatorPopup(options);

        this._handlePartialRefresh(() => {
            this.navArea.reload();
        });
    }

    _addAutopilot() {
        if (!PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}enable_autopilot`, true)) {
            return;
        }

        document.addPardusKeyDownListener('move_along_path_key', {code: 70}, () => {
            this.navArea.fly();
        });

        document.addPardusKeyDownListener('modify_autopilot_route', {code: 77}, () => {
            const modifyRoute = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false);
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}modify_route`, !modifyRoute);

            if (!modifyRoute) {
                MsgFramePage.sendMessage('Modifying route', 'info');
                PardusOptionsUtility.setVariableValue(`modified_route`, []);
            } else {
                const modified_route = PardusOptionsUtility.getVariableValue('modified_route', []);

                if (modified_route.length < 2) {
                    MsgFramePage.sendMessage('Cancelling route modification', 'info');
                    return;
                }

                const forward = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_forward`, true);
                const tile_string = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}tiles_to_highlight`, '');
                const route_array = [];

                for (const tile_str of tile_string.split(',')) {
                    route_array.push(tile_str.split('|')[0]);
                }

                if (!forward) {
                    route_array.reverse();
                }

                let start_index = route_array.indexOf(modified_route[0]);
                let end_index = route_array.indexOf(modified_route[modified_route.length - 1]);

                if (start_index < 0 || end_index < 0) {
                    MsgFramePage.sendMessage('Route modification must start and end on the existing route', 'error');
                    return;
                }

                if (start_index > end_index) {
                    route_array.splice(end_index, start_index + 1 - end_index, ...modified_route.reverse());
                } else {
                    route_array.splice(start_index, end_index + 1 - start_index, ...modified_route);
                }

                if (!forward) {
                    route_array.reverse();
                }

                PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}tiles_to_highlight`, route_array.join(','));
                this.tile_set = new Map();

                // Initialise the tile set
                for (const tile_str of route_array) {
                    this.tile_set.set(tile_str.toString(), this.default_colour);
                }

                this.navArea.refreshTilesToHighlight(this.tile_set);

                MsgFramePage.sendMessage('Saving route', 'info');
            }

        });

        document.addPardusKeyDownListener('toggle_autopilot_direction', {code: 67}, () => {
            if (PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false)) {
                MsgFramePage.sendMessage('Cannot change autopilot direction whilst modifying path', 'error');
                return;
            }

            const forward = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_forward`, false);

            if (forward) {
                MsgFramePage.sendMessage('Autopilot heading backwards', 'info');
            } else {
                MsgFramePage.sendMessage('Autopilot heading forward', 'info');
            }

            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}autopilot_forward`, !forward);
        });
    }

    _plotPath(event) {
        if (!this.navigationCalculatorPopup.isVisible()) {
            return
        }

        event.preventDefault();

        this.navigationCalculatorPopup.getCalculateButtonElement().setAttribute('disabled', 'true');
        this.navigationCalculatorPopup.getCalculateButtonElement().value = 'Plotting...';
        this.navigationCalculatorPopup.getCalculateButtonElement().setAttribute('style', 'text-align: center; color: green; background-color: silver');
        this.navigationCalculatorPopup.getRouteFrom(this.navArea.centre_tile.tile_id).then((route) => {
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}tiles_to_highlight`, route.join(','));
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}autopilot_forward`, true);
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}modify_route`, false);
            this.navigationCalculatorPopup.hide();
            MsgFramePage.sendMessage('Plotted route to destination', 'info');

            this.tile_set = new Map();

            // Initialise the tile set
            for (const tile_str of route) {
                this.tile_set.set(tile_str.toString(), this.default_colour);
            }

            this.navArea.refreshTilesToHighlight(this.tile_set);
        }).catch((error) => {
            MsgFramePage.sendMessage('Unable to get route to destination', 'error');
        }).finally(() => {
            this.navigationCalculatorPopup.getCalculateButtonElement().removeAttribute('disabled');
            this.navigationCalculatorPopup.getCalculateButtonElement().value = 'Plot route';
            this.navigationCalculatorPopup.getCalculateButtonElement().setAttribute('style', 'text-align: center;');
        });
    }

    _addNavigationCalculatorPopup(options = {
        squad: false
    }) {
        this.navigationCalculatorPopup = new NavigationCalculatorPopup(options);

        document.addPardusKeyDownListener('open_navigation_key', {code: 68}, (event) => {
            if (!this.navigationCalculatorPopup.isVisible()) {
                this.navigationCalculatorPopup.show();
                console.log(this.navArea);
                event.preventDefault();
            }
        });

        document.addPardusKeyDownListener('close_navigation_key', {code: 27}, () => {
            if (this.navigationCalculatorPopup.isVisible()) {
                this.navigationCalculatorPopup.hide();
                event.preventDefault();
            }
        });

        this.navigationCalculatorPopup.element.addPardusKeyDownListener('close_navigation_key', {code: 27}, () => {
            if (this.navigationCalculatorPopup.isVisible()) {
                this.navigationCalculatorPopup.hide();
                event.preventDefault();
            }
        });

        this.navigationCalculatorPopup.element.addPardusKeyDownListener('plot_key', {code: 13}, (event) => {this._plotPath(event)});
        this.navigationCalculatorPopup.getCalculateButtonElement().addEventListener('click', (event) => {this._plotPath(event)});
    }

    _handlePartialRefresh(func) {
        const mainElement = document.getElementById('tdSpaceChart');
        const navElement = mainElement ? document.getElementById('tdSpaceChart').getElementsByTagName('table')[0] : document.querySelectorAll('table td[valign="top"]')[1];

        // This would be more specific, but it doesn't trigger enough refreshes
        //const navElement = document.getElementById('nav').parentNode;

        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            func();
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(navElement, config);
    }
}