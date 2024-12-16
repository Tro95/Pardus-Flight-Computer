import { PardusOptionsUtility } from 'pardus-options-library';
import { Sectors } from 'pardus-library';

/* global userloc */

export default class Ship2OpponentCombat {
    #extractRegex = /([\w\-\d\s]*)\s\[(\d{1,3}),(\d{1,3})\]/;

    constructor() {
        const currentLocation = document.querySelector('b').innerText;

        const match = currentLocation.match(this.#extractRegex);
        const matchedTileId = Sectors.getTileIdFromSectorAndCoords(match[1], match[2], match[3]);

        this.tileId = matchedTileId;
        this.#addRecording();
    }

    #addRecording() {
        const previousTileId = PardusOptionsUtility.getVariableValue('last_tile_id', -1);
        const expectedRoute = PardusOptionsUtility.getVariableValue('expected_route', []);
        const currentPosition = userloc.toString();

        const recordingMode = PardusOptionsUtility.getVariableValue('recording_mode', 'all');

        // console.log(`previousTileId: ${previousTileId}`);
        // console.log(`expectedRoute: ${expectedRoute}`);
        // console.log(`currentPosition: ${currentPosition}`);
        // console.log(`this.tileId: ${this.tileId}`);

        if (previousTileId !== -1) {
            if (PardusOptionsUtility.getVariableValue('recording', false)) {
                const recordedTiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));
                const badRecordedTiles = new Set(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []));

                // console.log(`recordedTiles: ${recordedTiles}`);
                // console.log(`badRecordedTiles: ${badRecordedTiles}`);

                if (expectedRoute.includes(currentPosition)) {
                    for (const flownTile of expectedRoute) {
                        if (flownTile === currentPosition) {
                            break;
                        }

                        if (recordingMode === 'all' || recordingMode === 'good') {
                            // console.log(`Adding ${flownTile} to recordedTiles`)
                            recordedTiles.add(flownTile);
                        }
                    }

                    if (recordingMode === 'all' || recordingMode === 'bad') {
                        // console.log(`Adding ${currentPosition} to badRecordedTiles`)
                        badRecordedTiles.add(currentPosition);

                        // Make sure it isn't recorded as a good tile at the same time
                        recordedTiles.delete(currentPosition);
                    }
                }
                // console.log(`Setting bad_recorded_tiles to '${Array.from(badRecordedTiles)}'`);
                PardusOptionsUtility.setVariableValue('bad_recorded_tiles', Array.from(badRecordedTiles));
                PardusOptionsUtility.setVariableValue('recorded_tiles', Array.from(recordedTiles));
            }
        }

        PardusOptionsUtility.setVariableValue('expected_route', []);
        PardusOptionsUtility.setVariableValue('last_tile_id', this.tileId);
    }
}
