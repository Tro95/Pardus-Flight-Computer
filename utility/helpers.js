function mapper_urls_from_route(route = []) {
    const sector_routes = {};

    for (const index in route) {
        const tile_obj = get_sector_coords_obj(route[index]);

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