import { Sectors } from 'pardus-library';

export function mapperUrlsFromRoute(route = []) {
    const sectorRoutes = new Map();

    for (let index = 0; index < route.length; index += 1) {
        const tileObj = Sectors.getSectorForTile(route[index]).getTile(route[index]);

        if (!tileObj) {
            console.log(`No tile object for ${route[index]}`);
        } else {
            const tilesInSector = [];

            if (sectorRoutes.has(tileObj.sector)) {
                tilesInSector.push(...sectorRoutes.get(tileObj.sector));
            }

            tilesInSector.push(`${tileObj.x},${tileObj.y}`);

            sectorRoutes.set(tileObj.sector, tilesInSector);
        }
    }

    const mapperUrls = new Map();

    for (const sectorRouteIndex of sectorRoutes) {
        mapperUrls.set(sectorRouteIndex[0], mapperUrlFromValues(sectorRouteIndex[0], sectorRouteIndex[1]));
    }

    return mapperUrls;
}

export function mapperUrlFromValues(sector, coords) {
    return `http://map.xcom-alliance.info/${encodeURI(sector)}.html?hilite=${coords.join('|')}`;
}

export function estimateXYHoleAPCost(maneuver) {
    if (maneuver <= 10) {
        return 2500;
    }

    if (maneuver >= 85.9) {
        return 1000;
    }

    const adjManeuver = maneuver - 10;

    // This is not the true formula, but is within 20aps of the jump cost for all maneuver
    return 1000 + (10 * Math.floor(150 * (10 ** (-0.019 * adjManeuver)) - adjManeuver ** (1 / 3)));
}
