/* global PardusOptions, PardusOptionsUtility, colours, mapper_urls_from_route */

class OptionsPage {

    constructor() {
        this.pardus_flight_computer_tab = PardusOptions.addTab({
            heading: 'Flight Computer',
            id: 'flight-computer',
            defaultLabel: 'Route Highlight'
        });

        this.path_highlighting_subtab = this.pardus_flight_computer_tab.addSubTab({
            label: 'Path Highlight',
        });

        this.recording_subtab = this.pardus_flight_computer_tab.addSubTab({
            label: 'Recording',
        });

        this.squads_subtab = this.pardus_flight_computer_tab.addSubTab({
            label: 'Squads',
        });

        this.colours_selection = [];
        for (const colour in colours) {
            this.colours_selection.push({
                value: colours[colour].short_code,
                text: colour,
                style: `background-color:rgb(${colours[colour].red},${colours[colour].green},${colours[colour].blue})`
            });
        }

        this.routeHighlightingOptions(this.pardus_flight_computer_tab);
        this.pathHighlightingOptions(this.path_highlighting_subtab);
        this.recordingOptions(this.recording_subtab);
        this.squadsOptions(this.squads_subtab);

        this.pardus_flight_computer_tab.refreshElement();
    }

    pathHighlightingOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Path Highlighting',
            description: 'Path highlighting shows the path your ship will fly to a particular tile.'
        });

        const path_highlighting_general_options = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for path highlighting.'
        });

        path_highlighting_general_options.addBooleanOption({
            variable: 'show_pathing',
            description: 'Enable path highlighting',
            defaultValue: true
        });

        path_highlighting_general_options.addSelectOption({
            variable: 'default_path_colour',
            description: 'Colour for path highlighting',
            options: this.colours_selection,
            inheritStyle: true,
            defaultValue: 'y'
        });
    }

    routeHighlightingOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Route Highlighting',
            description: 'Route highlighting shows a pre-defined route on the nav screen. The route may consist of multiple disjoint and isolated tiles.'
        });

        const route_highlighting_general_options = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for route highlighting.'
        });

        route_highlighting_general_options.addBooleanOption({
            variable: 'highlight_tiles',
            description: 'Enable route highlighting',
            defaultValue: true
        });

        route_highlighting_general_options.addSelectOption({
            variable: 'default_colour',
            description: 'Default colour for route highlighting',
            options: this.colours_selection,
            defaultValue: 'g',
            inheritStyle: true,
            info: {
                title: 'Route Highlighting Colour',
                description: 'This option specifies the colour that is used to highlight tiles on the route when no colour is specified alongside the tile id. The colour of individual tiles may be overriden by specifying <code>{tile_id}|{colour}</code> within the route box, where colours are denoted by one of <code>g</code>, <code>r</code>, <code>b</code>, or <code>y</code>.'
            }
        });

        const tile_highlight_box = subtab.addBox({
            heading: 'Route Tiles',
            description: 'This is the list of tiles forming the route to highlight.',
            resetButton: true,
            presets: 4
        });

        tile_highlight_box.addTextAreaOption({
            variable: 'tiles_to_highlight',
            defaultValue: '',
            cols: 64,
            rows: 3
        });

        const autopilot_options = subtab.addBoxLeft({
            heading: 'Autopilot Options',
            description: 'These are the general options for autopilot.'
        });

        autopilot_options.addBooleanOption({
            variable: 'enable_autopilot',
            description: 'Enable autopilot',
            defaultValue: true
        });

        autopilot_options.addBooleanOption({
            variable: 'autopilot_forward',
            description: 'Forward direction',
            defaultValue: true
        });

        autopilot_options.addNumericOption({
            variable: 'autopilot_max_steps',
            description: 'Maximum steps',
            defaultValue: 10,
            min: 1,
            max: 10,
        });

        autopilot_options.addKeyDownOption({
            variable: 'move_along_path_key',
            description: 'Fly to the next tile',
            defaultValue: {
                code: 70,
                key: "KeyF",
                description: "f"
            }
        });

        autopilot_options.addKeyDownOption({
            variable: 'toggle_autopilot_direction',
            description: 'Change direction',
            defaultValue: {
                code: 67,
                key: "KeyC",
                description: "c"
            }
        });

        const mapper_box = subtab.addBoxBottom({
            heading: 'Mapper',
            description: 'The links below let you view the currently-stored route.'
        });

        mapper_box.innerHtml = OptionsPage.get_mapper_box_html();

        tile_highlight_box.addEventListener('save', () => {
            mapper_box.innerHtml = OptionsPage.get_mapper_box_html();
            mapper_box.refreshElement();
        });

        tile_highlight_box.addEventListener('preset-load', () => {
            mapper_box.innerHtml = OptionsPage.get_mapper_box_html();
            mapper_box.refreshElement();
        });

        tile_highlight_box.addEventListener('reset', () => {
            mapper_box.innerHtml = OptionsPage.get_mapper_box_html();
            mapper_box.refreshElement();
        });
    }

    squadsOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Sqauds Route Highlighting',
            description: 'Squads route highlighting shows a pre-defined route on the nav screen for squads. The route may consist of multiple disjoint and isolated tiles.'
        });

        const route_highlighting_general_options = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for route highlighting.'
        });

        route_highlighting_general_options.addBooleanOption({
            variable: 'squads_highlight_tiles',
            description: 'Enable sqauds route highlighting',
            defaultValue: true
        });

        route_highlighting_general_options.addSelectOption({
            variable: 'sqauds_default_colour',
            description: 'Default colour for sqauds route highlighting',
            options: this.colours_selection,
            defaultValue: 'g',
            inheritStyle: true,
            info: {
                title: 'Route Highlighting Colour',
                description: 'This option specifies the colour that is used to highlight tiles on the route when no colour is specified alongside the tile id. The colour of individual tiles may be overriden by specifying <code>{tile_id}|{colour}</code> within the route box, where colours are denoted by one of <code>g</code>, <code>r</code>, <code>b</code>, or <code>y</code>.'
            }
        });

        const tile_highlight_box = subtab.addBox({
            heading: 'Route Tiles',
            description: 'This is the list of tiles forming the route to highlight.',
            resetButton: true,
            presets: 4
        });

        tile_highlight_box.addTextAreaOption({
            variable: 'squads_tiles_to_highlight',
            defaultValue: '',
            cols: 64,
            rows: 3
        });

        const mapper_box = subtab.addBox({
            heading: 'Mapper',
            description: 'The links below let you view the currently-stored route.'
        });

        mapper_box.innerHtml = OptionsPage.get_mapper_box_html(true);

        tile_highlight_box.addEventListener('save', () => {
            mapper_box.innerHtml = OptionsPage.get_mapper_box_html(true);
            mapper_box.refreshElement();
        });

        tile_highlight_box.addEventListener('reset', () => {
            mapper_box.innerHtml = OptionsPage.get_mapper_box_html(true);
            mapper_box.refreshElement();
        });
    }

    recordingOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Recording',
            description: 'Recording allows you to record the all the tiles you fly on and over, and provides the list of tile ids for sharing with others.'
        });

        const recording_general_options = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for recording routes.'
        });

        recording_general_options.addBooleanOption({
            variable: 'colour_recorded_tiles',
            description: 'Highlight recorded tiles as you fly',
            defaultValue: true
        });

        recording_general_options.addSelectOption({
            variable: 'recording_mode',
            description: 'Record tiles',
            options: [
                {
                    value: 'all',
                    text: 'All tiles',
                    default: true
                },
                {
                    value: 'bad',
                    text: 'Bad tiles only'
                },
                {
                    value: 'good',
                    text: 'Good tiles only'
                }
            ]
        });

        recording_general_options.addSelectOption({
            variable: 'recorded_tile_colour',
            description: 'Colour to highlight recorded tiles',
            options: this.colours_selection,
            defaultValue: 'c',
            inheritStyle: true,
        });

        recording_general_options.addSelectOption({
            variable: 'bad_recorded_tile_colour',
            description: 'Colour to highlight bad tiles',
            options: this.colours_selection,
            defaultValue: 'r',
            inheritStyle: true,
            info: {
                title: 'Bad Tile Recording and Highlighting',
                description: 'This option enables recording of tiles when you encounter an NPC, colouring them differently to normal recorded tiles, and saving them separately.'
            }
        });

        recording_general_options.addKeyDownOption({
            variable: 'toggle_recording_keypress',
            description: 'Start/stop recording',
            defaultValue: {
                code: 82,
                key: "KeyR",
                description: "r"
            }
        });

        const recorded_output_box = subtab.addBox({
            heading: 'Recorded Tiles',
            description: 'The tiles that have been recorded.'
        });

        recorded_output_box.innerHtml = OptionsPage.get_recorded_output_box_html();
        recorded_output_box.addAfterRefreshHook(() => {this.recordedOutputAfterRefresh(recorded_output_box)});

        recording_general_options.addEventListener('save', () => {
            recorded_output_box.innerHtml = OptionsPage.get_recorded_output_box_html();
            recorded_output_box.refreshElement();
        });

        const recording_toggle_box = subtab.addBox({
            heading: 'Record',
            description: 'Start and stop recording.'
        });

        recording_toggle_box.innerHtml = OptionsPage.get_recording_toggle_box_html();
        recording_toggle_box.addAfterRefreshHook(() => {this.recordingToggleAfterRefresh(recording_toggle_box)});

    }

    static get_recording_toggle_box_html() {
        const offset = '-2px';
        const off_blob = `<img src="data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0B%00%00%00%0D%08%03%00%00%00H%2Bd%09%00%00%00lPLTE%FF%FF%FF%D3%D3%D3%BB%BB%BB%9B%9B%9B%91%91%91%90%90%90%82%82%82%80%80%80~~~%7D%7D%7DuuullljjjgggbbbaaaUUUSSSMMMGGGDDD%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%2F%E3%EE%3C%00%00%00%16tRNS%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%00%01%D2%C0%E4%00%00%00_IDATx%DAT%8DI%0E%C0%20%0C%03%034%10%F6%00%E1%FF_-%B4%87R%9F%AC%915%86%F9%05%FE%5Dz%E3%D6e%F7%C1%25%C5TxL%10%CE%81%9C%0F%99%05z%0D%16%0D%DAP%3A%B4D%A8%95FJ%0D8%3A%A3%40%19%17yq%BF%F9%B5%F9%B9%7F%3D%F4x%96%BF.%7F%DD%FE%E3%F7%16%60%00%8E%9C%07%C8%8B%B1%7B%ED%00%00%00%00IEND%AEB%60%82" style="vertical-align:${offset};" alt="Off bloc created by Takius Stargazer" border="0">`;
        const on_blob = `<img src="data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0B%00%00%00%0D%08%03%00%00%00H%2Bd%09%00%00%00%7BPLTE%EF%00%01%DD%00%01%C5%00%01%B4%00%01%9A%00%01%95%00%01%88%00%01%7D%00%01%F9%00%00%F4%00%00%F4%01%00%EF%01%00%EE%00%00%DD%00%00%DD%01%00%CB%00%00%CB%01%00%C5%00%00%C5%01%00%BF%00%00%B4%00%00%B4%01%00%B3%00%00%9A%00%00%9A%01%00%99%00%00%95%00%00%88%00%00%88%01%00%7D%00%00%7D%01%00w%00%00v%00%00%FF%17%17%FF%18%18%FF--%FFpp%FFqq%FF%A3%A3%FF%FF%FF%FF%FF%FF%D1%8Fv%E3%00%00%00)tRNS%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%00R%F4%20%87%00%00%00wIDATx%DAT%8D%D1%0E%C2%20%14C%AB%E2%1C2D%C0%E1%B8%E8%04%99%C8%FF%7F%A1%98%18%8D%7D%3Ai%9A%1E%D4_%F0%CF1%D0%99.%F1%CDW%B6Y%2B%7D%F2%BB%8A%C8%AC%04%1F%A4%9Dn%08N%F6)%A7%FE0v%20%23%D2R%96%24%0C%C1%1Fy.%CF%92%F7j%02%E9%A1%F5%8F%BB%D0%F4%DD%CB1%20z%BB%12%1C%ED\'%A2%CE%DE%19%A5%9D%9F%3F%5E%B6%ED%9A%F7%25%C0%00%C0~%0Ek%A4Y%8A%96%00%00%00%00IEND%AEB%60%82" style="vertical-align:${offset};" alt="On blob created by Takius Stargazer" border="0">`;
        const record_button_id = 'pardus-flight-computer-record-button';

        let recording = PardusOptionsUtility.getVariableValue('recording', false);

        let recording_status = `${off_blob}&nbsp;Not recording`;
        let button_text = 'Start recording';

        if (recording) {
            recording_status = `${on_blob}&nbsp;<font color='red'>Recording</font>`;
            button_text = 'Stop recording';
        }

        return `<tr><td><div><table width="100%"><tbody><tr><td width="1%" style="white-space: nowrap;">Recording status:</td><td><div id="pardus-flight-computer-recording-status">${recording_status}</div></td><td align="right"><input type="button" value="${button_text}" id="${record_button_id}"></td></tr></tbody></table></div></td></tr>`;
    }

    static get_recorded_output_box_html() {
        let recording_output = PardusOptionsUtility.getVariableValue('recorded_tiles', []).concat(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []).map(x => x + '|' + PardusOptionsUtility.getVariableValue('bad_recorded_tile_colour', 'r'))).join(','); 

        if (recording_output === '') {
            recording_output = 'No tiles recorded';
        }

        return `<tr><td><div><table width="100%"><tbody><tr><td colspan="3"><pre id="pardus-flight-computer-recording-output" style="padding: 5px; border-style: dashed; border-color: yellow; border-width: thin; white-space: pre-wrap; word-wrap: anywhere;">${recording_output}</pre></td></tr><tr><td align="right" colspan="3"><input value="Clear" id="pardus-flight-computer-clear-recording-output" type="button"></td></tr></tbody></table></div></td></tr>`;
    }

    recordingToggleAfterRefresh(recording_toggle_box) {
        const record_button = document.getElementById('pardus-flight-computer-record-button');

        record_button.addEventListener('click', () => {
            const recording = PardusOptionsUtility.getVariableValue('recording', false);
            PardusOptionsUtility.setVariableValue('recording', !recording);
            recording_toggle_box.innerHtml = OptionsPage.get_recording_toggle_box_html();
            recording_toggle_box.refreshElement();
        });
    }

    recordedOutputAfterRefresh(recorded_output_box) {
        const clear_button = document.getElementById('pardus-flight-computer-clear-recording-output');

        clear_button.addEventListener('click', () => {
            PardusOptionsUtility.setVariableValue('recorded_tiles', []);
            PardusOptionsUtility.setVariableValue('bad_recorded_tiles', []);
            PardusOptionsUtility.setVariableValue('expected_route', []);
            recorded_output_box.innerHtml = OptionsPage.get_recorded_output_box_html();
            recorded_output_box.refreshElement();
        });        
    }

    static get_mapper_box_html(squads = false) {
        const coloured_tiles_to_highlight = PardusOptionsUtility.getVariableValue(squads ? 'squads_tiles_to_highlight' : 'tiles_to_highlight', '').split(',');
        const tiles_to_highlight = [];

        for (const tile of coloured_tiles_to_highlight) {
            if (tile) {
                tiles_to_highlight.push(tile.split('|')[0]);
            }
        }

        const mapper_urls = mapper_urls_from_route(tiles_to_highlight);

        let html = '<tr><td><div><table width="100%"><tbody>';

        for (const sector in mapper_urls) {
            html += `<tr><td>${sector}</td><td style="word-wrap: anywhere;"><a href="${mapper_urls[sector]}" target="_blank">${mapper_urls[sector]}</a></td></tr>`;
        }

        if (Object.keys(mapper_urls).length === 0) {
            html += `<tr><td>No sectors detected in the currently-stored route.</td></tr>`;
        }

        html += '</tbody></table></div></td></tr>';

        return html;
    }
}