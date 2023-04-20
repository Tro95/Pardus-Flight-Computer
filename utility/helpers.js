/* global get_sector_coords_obj */

function mapper_urls_from_route(route = []) {
    const sector_routes = {};

    for (const index in route) {
        const tile_obj = get_sector_coords_obj(route[index]);

        if (!tile_obj) {
            console.log(`No tile object for ${route[index]}`);
            continue;
        }

        if (!sector_routes[tile_obj.sector]) {
            sector_routes[tile_obj.sector] = [];
        }

        sector_routes[tile_obj.sector].push(`${tile_obj.x},${tile_obj.y}`);
    }

    const mapper_urls = {};

    for (const sector_route_index in sector_routes) {
        mapper_urls[sector_route_index] = mapper_url_from_values(sector_route_index, sector_routes[sector_route_index]);
    }

    return mapper_urls;
}

function mapper_url_from_values(sector, coords) {
    return `http://map.xcom-alliance.info/${encodeURI(sector)}.html?hilite=${coords.join('|')}`;
}

function estimateXYHoleAPCost(maneuver) {
    if (maneuver <= 10) {
        return 2500;
    }

    if (maneuver >= 85.9) {
        return 1000;
    }

    const adj_maneuver = maneuver - 10;

    // This is not the true formula, but is within 20aps of the jump cost for all maneuver
    return 1000 + (10 * Math.floor(150 * (Math.pow(10, -0.019 * adj_maneuver)) - Math.pow(adj_maneuver, 1/3)));
}