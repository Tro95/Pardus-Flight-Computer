import Sector from '../pardus/sector.js';
import { sectorMapDataObj } from '../../data/sectors.js';

export const Sectors = new Map();

for (const sector of Object.keys(sectorMapDataObj)) {
    Sectors.set(sector, new Sector(sector, sectorMapDataObj[sector].start, sectorMapDataObj[sector].cols, sectorMapDataObj[sector].rows));
}

Sectors.getSectorForTile = function(tile_id) { 
    for (const sector of this.getSectors()) {
        if (sector.contains(tile_id)) {
            return sector;
        }
    }

    throw new Error(`No sector found for tile id ${tile_id}`);
}

Sectors.getSectorAndCoordsForTile = function(tile_id) {
    return this.getSectorForTile(tile_id).getTileHumanString(tile_id);
}

Sectors.getTileIdFromSectorAndCoords = function(sector, x, y) {
    if (sector.endsWith('NE')) {
        sector = sector.substring(0, sector.length - 3);
    }

    if (sector.endsWith('East') || sector.endsWith('West')) {
        sector = sector.substring(0, sector.length - 5);
    }

    if (sector.endsWith('North') || sector.endsWith('South') || sector.endsWith('Inner')) {
        sector = sector.substring(0, sector.length - 6);
    }

    if (!this.has(sector)) {
        throw `No data for sector '${sector}'!`;
    }

    return this.get(sector).getTileByCoords(x, y);
}

Sectors.getSectors = function * () {
    for (const sector of this) {
        yield sector[1];
    }
}
