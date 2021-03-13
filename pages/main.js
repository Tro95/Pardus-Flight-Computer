/* global PardusOptionsUtility, colours */

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

        this.flattened_colours = {};

        for (const colour in colours) {
            this.flattened_colours[colours[colour].short_code] = colours[colour].rgb;
        }

        this.handle_partial_refresh();
        this.highlightTiles();
        this.add_record_handler();
    }

    handle_partial_refresh() {
        const nav_element = document.getElementById('tdSpaceChart').getElementsByTagName('table')[0];

        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            this.highlightTiles();
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(nav_element, config);        
    }

    add_record_handler() {
        const clickable_tiles = document.querySelectorAll('a[onclick^="nav"]');

        for (const clickable_tile of clickable_tiles) {
            const tile_id = clickable_tile.getAttribute('onclick').match(/^[^\d]*(\d*)[^\d]*$/)[1];

            clickable_tile.addEventListener('click', () => {
                if (PardusOptionsUtility.getVariableValue('recording', false)) {
                    const recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));

                    recorded_tiles.add(tile_id);

                    PardusOptionsUtility.setVariableValue('recorded_tiles', Array.from(recorded_tiles));
                }
               
            });
        }
    }

    highlightTiles() {
        const nav_tiles = document.querySelectorAll('a[onclick^="nav"]');

        for (const nav_tile of nav_tiles) {
            const tile_id = nav_tile.getAttribute('onclick').match(/^[^\d]*(\d*)[^\d]*$/)[1];
            if (this.tile_set.has(tile_id)) {
                highlightTileInPath(nav_tile.parentNode, this.tile_set.get(tile_id));
            }
        }

        /* global userloc */
        if (this.tile_set.has(userloc.toString())) {
            // most tiles
            let nav_tile = document.querySelector('#navtransition a:not([onclick])');

            // Try the #navtransition element first, in case we're using partial refresh
            if (!nav_tile) {
                nav_tile = document.querySelector('#navtransition a:not([onclick])');
            }

            // wormholes
            if (!nav_tile) {
                nav_tile = document.querySelector('#navtransition a[onclick^="warp"]');
            }

            // ship on an empty tile
            if (!nav_tile) {
                nav_tile = document.querySelector('#navtransition td.navShip a');
            }

            // If we get here, it's likely we're not using partial refresh
            if (!nav_tile) {
                nav_tile = document.querySelector('#navarea a:not([onclick])');
            }

            // wormholes
            if (!nav_tile) {
                nav_tile = document.querySelector('#navarea a[onclick^="warp"]');
            }

            // ship on an empty tile
            if (!nav_tile) {
                nav_tile = document.querySelector('#navarea td.navShip > img');
            }

            this.highlightTileInPath(nav_tile.parentNode, this.tile_set.get(userloc.toString()));
        }
        
        this.add_record_handler();
    }

    highlightTileInPath( td, colour = 'g' ) {

        // With credit to Pardus Sweetener
        const highlight_regex = /^\s*linear-gradient/;
        const unhighlight_regex = /^\s*linear-gradient.*?, (url\(.*)$/;

        var background_image = td.style.backgroundImage;
        if( background_image ) {
            // don't do this twice
            if( !highlight_regex.test(background_image) ) {
                td.style.backgroundImage = `linear-gradient(to bottom, rgba(${flattened_colours[colour]},0.5), rgba(${flattened_colours[colour]},0.5)), ` + background_image;
                td.addEventListener('mouseenter', () => {
                    td.style.backgroundImage = `linear-gradient(to bottom, rgba(${flattened_colours[colour]},0.8), rgba(${flattened_colours[colour]},0.8)), ` + background_image;
                });
                td.addEventListener('mouseleave', () => {
                    td.style.backgroundImage = `linear-gradient(to bottom, rgba(${flattened_colours[colour]},0.5), rgba(${flattened_colours[colour]},0.5)), ` + background_image;
                });
            }
        } else {
            td.style.backgroundColor = `rgba(${flattened_colours[colour]},1)`;
            var img = td.firstElementChild;
            img.style.opacity = 0.5;
            img.addEventListener('mouseenter', () => {
                img.style.opacity = 0.2;
            });
            img.addEventListener('mouseleave', () => {
                img.style.opacity = 0.5;
            });
        }
    }
}