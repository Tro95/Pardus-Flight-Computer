/* global PardusOptionsUtility, userloc, getTileIdFromSectorAndCoords */

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
        const expected_route = PardusOptionsUtility.getVariableValue('expected_route', []);
        const current_position = userloc.toString();

        const recording_mode = PardusOptionsUtility.getVariableValue('recording_mode', 'all');

        if (previous_tile_id !== -1 && previous_tile_id !== this.tile_id) {
            if (PardusOptionsUtility.getVariableValue('recording', false)) {
                const recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));
                const bad_recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []));

                if (expected_route.includes(current_position)) {
                    for (const flown_tile of expected_route) {
                        if (flown_tile === current_position) {
                            break;
                        }

                        if (recording_mode === 'all' || recording_mode === 'good') {
                            recorded_tiles.add(flown_tile);
                        }
                    }

                    if (recording_mode === 'all' || recording_mode === 'bad') {
                        bad_recorded_tiles.add(current_position);
                    }
                }

                PardusOptionsUtility.setVariableValue('bad_recorded_tiles', Array.from(bad_recorded_tiles));
                PardusOptionsUtility.setVariableValue('recorded_tiles', Array.from(recorded_tiles));
            }
        }

        PardusOptionsUtility.setVariableValue('expected_route', [current_position]);
        PardusOptionsUtility.setVariableValue('last_tile_id', this.tile_id);
    }
}