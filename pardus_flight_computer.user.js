// ==UserScript==
// @name            Pardus Flight Computer
// @version         0.1
// @description     Flight Computer to assist pathfinding in Pardus
// @author          Tro (Artemis)
// @include         http*://*.pardus.at/main.php
// @include         http*://*.pardus.at/options.php
// @grant           GM_setValue
// @grant           GM_getValue
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Options-Library/v2.4/pardus_options_library.js
// @downloadURL     https://github.com/Tro95/Pardus-Flight-Computer/raw/main/pardus_flight_computer.user.js
// @updateURL       https://github.com/Tro95/Pardus-Flight-Computer/raw/main/pardus_flight_computer.user.js
// ==/UserScript==

/* global PardusOptions, PardusOptionsUtility */

const colours = {
    'Green': {
        'rgb': '0,128,0',
        'short_code': 'g'
    },
    'Blue': {
        'rgb': '0,0,128',
        'short_code': 'b',
    },
    'Red': {
        'rgb': '128,0,0',
        'short_code': 'r'
    },
    'Yellow': {
        'rgb': '128,128,0',
        'short_code': 'y'
    }
}

const flattened_colours = {};
for (const colour in colours) {
    flattened_colours[colours[colour].short_code] = colours[colour].rgb;
}

function recordClick(tile_id) {
    const recorded_tiles = new Set(PardusOptionsUtility.getVariableValue('recording_output', []));

    recorded_tiles.add(tile_id);

    PardusOptionsUtility.setVariableValue('recording_output', Array.from(recorded_tiles));
}

function navPage() {

    const nav_element = document.getElementById('tdSpaceChart').getElementsByTagName('table')[0];

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        highlightTiles();
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(nav_element, config);

    const tile_string = PardusOptionsUtility.getVariableValue('tiles_to_highlight', '');
    const default_colour = PardusOptionsUtility.getVariableValue('default_colour', 'g');

    const tile_set = new Map();

    for (const tile_str of tile_string.split(',')) {
        const tile_id_and_colour = tile_str.split('|');

        if (tile_id_and_colour.length == 1) {
            tile_set.set(tile_id_and_colour[0], default_colour);
        } else {
            tile_set.set(tile_id_and_colour[0], tile_id_and_colour[1]);
        }
    }

    highlightTiles();
    add_record_handler();

    function add_record_handler() {
        const clickable_tiles = document.querySelectorAll('a[onclick^="navAjax"]');

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

    function highlightTiles() {
        const nav_tiles = document.querySelectorAll('a[onclick^="nav"]');

        for (const nav_tile of nav_tiles) {
            const tile_id = nav_tile.getAttribute('onclick').match(/^[^\d]*(\d*)[^\d]*$/)[1];
            if (tile_set.has(tile_id)) {
                highlightTileInPath(nav_tile.parentNode, tile_set.get(tile_id));
            }
        }

        /* global userloc */
        if (tile_set.has(userloc.toString())) {
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

            highlightTileInPath(nav_tile.parentNode, tile_set.get(userloc.toString()));
        }
        
        add_record_handler();

        function highlightTileInPath( td, colour = 'g' ) {
            const HIGHLIGHTED_RX = /^\s*linear-gradient/;
            const UNHIGHLIGHT_RX = /^\s*linear-gradient.*?, (url\(.*)$/;

            var bimg = td.style.backgroundImage;
            if( bimg ) {
                // don't do this twice
                if( !HIGHLIGHTED_RX.test(bimg) ) {
                    td.style.backgroundImage = `linear-gradient(to bottom, rgba(${flattened_colours[colour]},0.5), rgba(${flattened_colours[colour]},0.5)), ` + bimg;
                    td.addEventListener('mouseenter', () => {
                        td.style.backgroundImage = `linear-gradient(to bottom, rgba(${flattened_colours[colour]},0.8), rgba(${flattened_colours[colour]},0.8)), ` + bimg;
                    });
                    td.addEventListener('mouseleave', () => {
                        td.style.backgroundImage = `linear-gradient(to bottom, rgba(${flattened_colours[colour]},0.5), rgba(${flattened_colours[colour]},0.5)), ` + bimg;
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
}

function optionsPage() {
    const pardus_flight_computer_tab = PardusOptions.addTab({
        heading: 'Flight Computer',
        id: 'flight-computer'
    });

    const tile_highlight_box = pardus_flight_computer_tab.addBox({
        heading: 'Tile Highlights',
        description: 'Specific tiles to highlight',
        resetButton: true
    });

    tile_highlight_box.addTextAreaOption({
        variable: 'tiles_to_highlight',
        description: 'Tiles to highlight',
        defaultValue: '',
        cols: 65,
        rows: 3
    });

    const colours_box = pardus_flight_computer_tab.addBox({
        heading: 'Colours',
        description: 'These settings control the colour of the tiles highlighted'
    });

    const colours_selection = [];
    for (const colour in colours) {
        colours_selection.push({
            value: colours[colour].short_code,
            text: colour
        });
    }

    colours_box.addSelectOption({
        variable: 'default_colour',
        description: 'The default colour to highlight',
        options: colours_selection,
        defaultValue: 'g'
    });

    const recording_box = pardus_flight_computer_tab.addBox({
        heading: 'Recording',
        description: 'These settings let you record the path you fly'
    });

    function get_recording_box_html() {
        const offset = '-2px';
        const off_blob = `<img src="data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0B%00%00%00%0D%08%03%00%00%00H%2Bd%09%00%00%00lPLTE%FF%FF%FF%D3%D3%D3%BB%BB%BB%9B%9B%9B%91%91%91%90%90%90%82%82%82%80%80%80~~~%7D%7D%7DuuullljjjgggbbbaaaUUUSSSMMMGGGDDD%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%2F%E3%EE%3C%00%00%00%16tRNS%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%00%01%D2%C0%E4%00%00%00_IDATx%DAT%8DI%0E%C0%20%0C%03%034%10%F6%00%E1%FF_-%B4%87R%9F%AC%915%86%F9%05%FE%5Dz%E3%D6e%F7%C1%25%C5TxL%10%CE%81%9C%0F%99%05z%0D%16%0D%DAP%3A%B4D%A8%95FJ%0D8%3A%A3%40%19%17yq%BF%F9%B5%F9%B9%7F%3D%F4x%96%BF.%7F%DD%FE%E3%F7%16%60%00%8E%9C%07%C8%8B%B1%7B%ED%00%00%00%00IEND%AEB%60%82" style="vertical-align:${offset};" alt="Off bloc created by Takius Stargazer" border="0">`;
        const on_blob = `<img src="data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0B%00%00%00%0D%08%03%00%00%00H%2Bd%09%00%00%00%7BPLTE%EF%00%01%DD%00%01%C5%00%01%B4%00%01%9A%00%01%95%00%01%88%00%01%7D%00%01%F9%00%00%F4%00%00%F4%01%00%EF%01%00%EE%00%00%DD%00%00%DD%01%00%CB%00%00%CB%01%00%C5%00%00%C5%01%00%BF%00%00%B4%00%00%B4%01%00%B3%00%00%9A%00%00%9A%01%00%99%00%00%95%00%00%88%00%00%88%01%00%7D%00%00%7D%01%00w%00%00v%00%00%FF%17%17%FF%18%18%FF--%FFpp%FFqq%FF%A3%A3%FF%FF%FF%FF%FF%FF%D1%8Fv%E3%00%00%00)tRNS%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%00R%F4%20%87%00%00%00wIDATx%DAT%8D%D1%0E%C2%20%14C%AB%E2%1C2D%C0%E1%B8%E8%04%99%C8%FF%7F%A1%98%18%8D%7D%3Ai%9A%1E%D4_%F0%CF1%D0%99.%F1%CDW%B6Y%2B%7D%F2%BB%8A%C8%AC%04%1F%A4%9Dn%08N%F6)%A7%FE0v%20%23%D2R%96%24%0C%C1%1Fy.%CF%92%F7j%02%E9%A1%F5%8F%BB%D0%F4%DD%CB1%20z%BB%12%1C%ED\'%A2%CE%DE%19%A5%9D%9F%3F%5E%B6%ED%9A%F7%25%C0%00%C0~%0Ek%A4Y%8A%96%00%00%00%00IEND%AEB%60%82" style="vertical-align:${offset};" alt="On blob created by Takius Stargazer" border="0">`;
        const record_button_id = 'pardus-flight-computer-record-button';

        let recording = PardusOptionsUtility.getVariableValue('recording', false);

        let recording_status = `${off_blob}&nbsp;Not recording`;
        let button_text = 'Start recording';
        let recording_output = PardusOptionsUtility.getVariableValue('recorded_tiles', []).join(',');

        if (recording_output === '') {
            recording_output = 'No tiles recorded';
        }

        if (recording) {
            recording_status = `${on_blob}&nbsp;<font color='red'>Recording</font>`;
            button_text = 'Stop recording';
        }

        let html = `<tr><td><div><table width="100%"><tbody><tr><td width="1%" style="white-space: nowrap;">Recording status:</td><td><div id="pardus-flight-computer-recording-status">${recording_status}</div></td><td align="right"><input type="button" value="${button_text}" id="${record_button_id}"></td></tr><tr><td colspan="3"><pre id="pardus-flight-computer-recording-output" style="padding: 5px; border-style: dashed; border-color: yellow; border-width: thin;">${recording_output}</pre></td></tr><tr><td align="right" colspan="3"><input value="Clear" id="pardus-flight-computer-clear-recording-output" type="button"></td></tr></tbody></table></div></td></tr>`; 
        return html;
    }

    function recordingAfterRefresh() {
        const record_button = document.getElementById('pardus-flight-computer-record-button');
        const clear_button = document.getElementById('pardus-flight-computer-clear-recording-output');

        record_button.addEventListener('click', () => {
            let recording = PardusOptionsUtility.getVariableValue('recording', false);
            PardusOptionsUtility.setVariableValue('recording', !recording);
            recording_box.innerHtml = get_recording_box_html();
            recording_box.refreshElement();
        });

        clear_button.addEventListener('click', () => {
            PardusOptionsUtility.setVariableValue('recorded_tiles', []);
            recording_box.innerHtml = get_recording_box_html();
            recording_box.refreshElement();
        });
    }

    recording_box.innerHtml = get_recording_box_html();
    recording_box.addAfterRefreshHook(recordingAfterRefresh);

    pardus_flight_computer_tab.refreshElement();
}

switch (document.location.pathname) {
    case '/options.php':
        optionsPage();
        break;
    case '/main.php':
        navPage();
        break;
}
