class Ship2opponent_combatPage {
    constructor() {

        const location = document.querySelector('b').innerText;
        const extract_regex = /([\w\-\d\s]*)\s\[(\d{1,3}),(\d{1,3})\]/;

        const match = location.match(extract_regex);
        const matched_tile_id = getTileIdFromSectorAndCoords(match[1], match[2], match[3]);

        this.tile_id = matched_tile_id;
        this._addRecording();
    }

    _addRecording() {
        const previous_tile_id = PardusOptionsUtility.getVariableValue('last_tile_id', -1);

        if (previous_tile_id !== -1 && previous_tile_id !== this.tile_id) {
            if (PardusOptionsUtility.getVariableValue('recording', false)) {
                const recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));
                const bad_recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []));

                for (const flown_tile of path_from_tile_to_tile(previous_tile_id, this.tile_id)) {
                    recorded_tiles.add(flown_tile.toString());
                }

                bad_recorded_tiles.add(this.tile_id.toString());

                PardusOptionsUtility.setVariableValue('bad_recorded_tiles', Array.from(bad_recorded_tiles));
                PardusOptionsUtility.setVariableValue('recorded_tiles', Array.from(recorded_tiles));
            }
        }

        PardusOptionsUtility.setVariableValue('last_tile_id', this.tile_id);
    }
}