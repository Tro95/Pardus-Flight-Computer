class Ship2opponent_combatPage {
    constructor() {

        const location = document.querySelector('b').innerText;

        const extract_regex = /([\w\-\d\s]*)\s\[(\d{1,3}),(\d{1,3})\]/;

        const match = location.match(extract_regex);

        console.log(match);

        matched_tile_id = getTileIdFromSectorAndCoords(match[0], match[1], match[2]);

        console.log(matched_tile_id);
    }
}