import { PardusOptions, PardusOptionsUtility } from 'pardus-options-library';
import { Tile } from 'pardus-library';
import { mapperUrlsFromRoute } from '../../static/helpers.js';

export default class OptionsPage {
    constructor() {
        this.pardusFlightComputerTab = PardusOptions.addTab({
            heading: 'Flight Computer',
            id: 'flight-computer',
            defaultLabel: 'Route Highlight',
        });

        this.pathHighlightingSubtab = this.pardusFlightComputerTab.addSubTab({
            label: 'Path Highlight',
        });

        this.recordingSubtab = this.pardusFlightComputerTab.addSubTab({
            label: 'Recording',
        });

        this.routeCalculatorSubtab = this.pardusFlightComputerTab.addSubTab({
            label: 'Route Calculator',
        });

        this.squadsSubtab = this.pardusFlightComputerTab.addSubTab({
            label: 'Squads',
        });

        this.coloursSelection = [];
        for (const colour of Tile.colours) {
            this.coloursSelection.push({
                value: colour[1].short_code,
                text: colour[0],
                style: `background-color:rgb(${colour[1].red},${colour[1].green},${colour[1].blue})`,
            });
        }

        this.routeHighlightingOptions(this.pardusFlightComputerTab);
        this.pathHighlightingOptions(this.pathHighlightingSubtab);
        this.recordingOptions(this.recordingSubtab);
        this.routeCalculatorOptions(this.routeCalculatorSubtab);
        this.squadsOptions(this.squadsSubtab);

        this.pardusFlightComputerTab.refreshElement();
    }

    pathHighlightingOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Path Highlighting',
            description: 'Path highlighting shows the path your ship will fly to a particular tile.',
        });

        const pathHighlightingGeneralOptions = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for path highlighting.',
        });

        pathHighlightingGeneralOptions.addBooleanOption({
            variable: 'show_pathing',
            description: 'Enable path highlighting',
            defaultValue: true,
        });

        pathHighlightingGeneralOptions.addSelectOption({
            variable: 'default_path_colour',
            description: 'Colour for path highlighting',
            options: this.coloursSelection,
            inheritStyle: true,
            defaultValue: 'y',
        });
    }

    routeHighlightingOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Route Highlighting',
            description: 'Route highlighting shows a pre-defined route on the nav screen. The route may consist of multiple disjoint and isolated tiles.',
        });

        const routeHighlightingGeneralOptions = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for route highlighting.',
        });

        routeHighlightingGeneralOptions.addBooleanOption({
            variable: 'highlight_tiles',
            description: 'Enable route highlighting',
            defaultValue: true,
            info: {
                title: 'Route Highlighting',
                description: 'Enabling route highlighting will show the route on the nav screen corresponding to the route in the route tiles box. This option does not enable or disable the autopilot functionality.',
            },
        });

        routeHighlightingGeneralOptions.addSelectOption({
            variable: 'default_colour',
            description: 'Default colour for route highlighting',
            options: this.coloursSelection,
            defaultValue: 'g',
            inheritStyle: true,
            info: {
                title: 'Route Highlighting Colour',
                description: 'This option specifies the colour that is used to highlight tiles on the route when no colour is specified alongside the tile id. The colour of individual tiles may be overriden by specifying <code>{tile_id}|{colour}</code> within the route box, where colours are denoted by one of <code>g</code>, <code>r</code>, <code>b</code>, or <code>y</code>.',
            },
        });

        const tileHighlightBox = subtab.addBox({
            heading: 'Route Tiles',
            description: 'This is the list of tiles forming the route to highlight. If you are using autopilot, please ensure the tiles create a continuous path, and are ordered sequentially from one end to the other.',
            resetButton: true,
            presets: 4,
        });

        tileHighlightBox.addTextAreaOption({
            variable: 'tiles_to_highlight',
            defaultValue: '',
            cols: 64,
            rows: 3,
        });

        const autopilotOptions = subtab.addBoxLeft({
            heading: 'Autopilot Options',
            description: 'These are the general options for autopilot. Autopilot will attempt to fly along the route configured in the route tiles box, ensuring that it only travels over tiles contained in the route. If the route configured is not continuous, autopilot will fly to the end of the current continuous section and stop. Autopilot will only work when you are somewhere along the route; one tile off and autopilot will not move.',
        });

        autopilotOptions.addBooleanOption({
            variable: 'enable_autopilot',
            description: 'Enable autopilot',
            defaultValue: true,
            info: {
                title: 'Autopilot',
                description: 'Enabling autopilot will allow you to fly along the route configured in the route tiles box using the key configured for flying. It is recommended to enable route highlighting with the autopilot, so you can visually see the route the autopilot will fly. This option does not enable or disable the route highlighting functionality.',
            },
        });

        autopilotOptions.addBooleanOption({
            variable: 'autopilot_forward',
            description: 'Forward direction',
            defaultValue: true,
            info: {
                title: 'Autopilot Direction',
                description: 'This setting determines the direction autopilot will fly in for the configured route in the route tiles box. Forwards will fly from the first tile to the last tile in the route tiles box, and backwards will fly from the last to the first. This setting can be changed using the configured key to change direction.',
            },
        });

        autopilotOptions.addBooleanOption({
            variable: 'autopilot_check_for_npcs',
            description: 'Check for NPCs',
            defaultValue: true,
            info: {
                title: 'Check for NPCs',
                description: 'This setting determines whether autopilot will check for NPCs on the route, and stop before landing on them. Disabling this option will make the autopilot attempt to fly through NPCs.',
            },
        });

        autopilotOptions.addNumericOption({
            variable: 'autopilot_max_steps',
            description: 'Maximum steps',
            defaultValue: 8,
            min: 1,
            max: 8,
            info: {
                title: 'Autopilot Steps',
                description: 'The maximum number of tiles autopilot will fly over every keypress. The maximum achievable is 8 tiles, allowing you to fly as far as you can see on your nav. The minimum is 1, and will allow you to fly one tile at a time.',
            },
        });

        autopilotOptions.addKeyDownOption({
            variable: 'move_along_path_key',
            description: 'Fly to the next tile',
            defaultValue: {
                code: 70,
                key: 'KeyF',
                description: 'f',
            },
            info: {
                title: 'Autopilot Fly Key',
                description: 'Every press, autopilot will fly along the route configured. Disabling this option will prevent autopilot from working. It is recommended to check this key does not conflict with any other scripts.',
            },
        });

        autopilotOptions.addKeyDownOption({
            variable: 'toggle_autopilot_direction',
            description: 'Change direction',
            defaultValue: {
                code: 67,
                key: 'KeyC',
                description: 'c',
            },
            info: {
                title: 'Change Direction Key',
                description: 'Changes the direction autopilot will fly in from the nav screen. Disabling this option will require you to come into this settings page and change the direction setting manually. It is recommended to check this key does not conflict with any other scripts.',
            },
        });

        autopilotOptions.addKeyDownOption({
            variable: 'modify_autopilot_route',
            description: 'Modify route',
            defaultValue: {
                code: 77,
                key: 'KeyM',
                description: 'm',
            },
            info: {
                title: 'Modify Route Key',
                description: 'Temporarily adjust the route, and press the key a second time to stop.',
            },
        });

        const mapperBox = subtab.addBoxBottom({
            heading: 'Mapper',
            description: 'The links below let you view the currently-stored route.',
        });

        mapperBox.innerHtml = OptionsPage.getMapperBoxHtml();

        tileHighlightBox.addEventListener('save', () => {
            mapperBox.innerHtml = OptionsPage.getMapperBoxHtml();
            mapperBox.refreshElement();
        });

        tileHighlightBox.addEventListener('preset-load', () => {
            mapperBox.innerHtml = OptionsPage.getMapperBoxHtml();
            mapperBox.refreshElement();
        });

        tileHighlightBox.addEventListener('reset', () => {
            mapperBox.innerHtml = OptionsPage.getMapperBoxHtml();
            mapperBox.refreshElement();
        });
    }

    routeCalculatorOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Route Highlighting',
            description: 'Route calculator will calculator an AP-efficient route from your current location to your target destination. Using the calculator will require the script accessing non-Pardus websites, which perform the calculations remotely. For more fine-grained control, please use <a href="https://tro.xcom-alliance.info/path_calculator.html" target="_blank">https://tro.xcom-alliance.info/path_calculator.html</a>.',
        });

        const routeCalculatorGeneralOptions = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for the route calculator.',
        });

        routeCalculatorGeneralOptions.addKeyDownOption({
            variable: 'open_navigation_key',
            description: 'Open navigation box',
            defaultValue: {
                code: 68,
                key: 'KeyD',
                description: 'd',
            },
            info: {
                title: 'Navigation Box',
                description: 'This button opens the navigation box. It can be closed by pressing the escape key, or by clicking the cancel button. Disabling this option effectively disables the nagivation calculator.',
            },
        });

        routeCalculatorGeneralOptions.addNumericOption({
            variable: 'navigation_number_of_favourites',
            description: 'Number of favourites',
            defaultValue: 4,
            min: 1,
            max: 10,
        });
    }

    squadsOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Sqauds Route Highlighting',
            description: 'Squads route highlighting shows a pre-defined route on the nav screen for squads. The route may consist of multiple disjoint and isolated tiles.',
        });

        const routeHighlightingGeneralOptions = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for route highlighting.',
        });

        routeHighlightingGeneralOptions.addBooleanOption({
            variable: 'squads_highlight_tiles',
            description: 'Enable sqauds route highlighting',
            defaultValue: true,
        });

        routeHighlightingGeneralOptions.addSelectOption({
            variable: 'sqauds_default_colour',
            description: 'Default colour for sqauds route highlighting',
            options: this.coloursSelection,
            defaultValue: 'g',
            inheritStyle: true,
            info: {
                title: 'Route Highlighting Colour',
                description: 'This option specifies the colour that is used to highlight tiles on the route when no colour is specified alongside the tile id. The colour of individual tiles may be overriden by specifying <code>{tile_id}|{colour}</code> within the route box, where colours are denoted by one of <code>g</code>, <code>r</code>, <code>b</code>, or <code>y</code>.',
            },
        });

        const tileHighlightBox = subtab.addBox({
            heading: 'Route Tiles',
            description: 'This is the list of tiles forming the route to highlight.',
            resetButton: true,
            presets: 4,
        });

        tileHighlightBox.addTextAreaOption({
            variable: 'squads_tiles_to_highlight',
            defaultValue: '',
            cols: 64,
            rows: 3,
        });

        const autopilotOptions = subtab.addBoxLeft({
            heading: 'Autopilot Options',
            description: 'These are the general options for autopilot. Autopilot will attempt to fly along the route configured in the route tiles box, ensuring that it only travels over tiles contained in the route. If the route configured is not continuous, autopilot will fly to the end of the current continuous section and stop. Autopilot will only work when you are somewhere along the route; one tile off and autopilot will not move.',
        });

        autopilotOptions.addBooleanOption({
            variable: 'squads_enable_autopilot',
            description: 'Enable autopilot',
            defaultValue: true,
            info: {
                title: 'Autopilot',
                description: 'Enabling autopilot will allow you to fly along the route configured in the route tiles box using the key configured for flying. It is recommended to enable route highlighting with the autopilot, so you can visually see the route the autopilot will fly. This option does not enable or disable the route highlighting functionality.',
            },
        });

        autopilotOptions.addBooleanOption({
            variable: 'squads_autopilot_forward',
            description: 'Forward direction',
            defaultValue: true,
            info: {
                title: 'Autopilot Direction',
                description: 'This setting determines the direction autopilot will fly in for the configured route in the route tiles box. Forwards will fly from the first tile to the last tile in the route tiles box, and backwards will fly from the last to the first. This setting can be changed using the configured key to change direction.',
            },
        });

        autopilotOptions.addNumericOption({
            variable: 'squads_autopilot_max_steps',
            description: 'Maximum steps',
            defaultValue: 8,
            min: 1,
            max: 8,
            info: {
                title: 'Autopilot Steps',
                description: 'The maximum number of tiles autopilot will fly over every keypress. The maximum achievable is 8 tiles, allowing you to fly as far as you can see on your nav. The minimum is 1, and will allow you to fly one tile at a time.',
            },
        });

        const mapperBox = subtab.addBoxBottom({
            heading: 'Mapper',
            description: 'The links below let you view the currently-stored route.',
        });

        mapperBox.innerHtml = OptionsPage.getMapperBoxHtml(true);

        tileHighlightBox.addEventListener('save', () => {
            mapperBox.innerHtml = OptionsPage.getMapperBoxHtml(true);
            mapperBox.refreshElement();
        });

        tileHighlightBox.addEventListener('reset', () => {
            mapperBox.innerHtml = OptionsPage.getMapperBoxHtml(true);
            mapperBox.refreshElement();
        });
    }

    recordingOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Recording',
            description: 'Recording allows you to record the all the tiles you fly on and over, and provides the list of tile ids for sharing with others.',
        });

        const recordingGeneralOptions = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for recording routes.',
        });

        recordingGeneralOptions.addBooleanOption({
            variable: 'colour_recorded_tiles',
            description: 'Highlight recorded tiles as you fly',
            defaultValue: true,
        });

        recordingGeneralOptions.addSelectOption({
            variable: 'recording_mode',
            description: 'Record tiles',
            options: [
                {
                    value: 'all',
                    text: 'All tiles',
                    default: true,
                },
                {
                    value: 'bad',
                    text: 'Bad tiles only',
                },
                {
                    value: 'good',
                    text: 'Good tiles only',
                },
            ],
        });

        recordingGeneralOptions.addSelectOption({
            variable: 'recorded_tile_colour',
            description: 'Colour to highlight recorded tiles',
            options: this.coloursSelection,
            defaultValue: 'c',
            inheritStyle: true,
        });

        recordingGeneralOptions.addSelectOption({
            variable: 'bad_recorded_tile_colour',
            description: 'Colour to highlight bad tiles',
            options: this.coloursSelection,
            defaultValue: 'r',
            inheritStyle: true,
            info: {
                title: 'Bad Tile Recording and Highlighting',
                description: 'This option enables recording of tiles when you encounter an NPC, colouring them differently to normal recorded tiles, and saving them separately.',
            },
        });

        recordingGeneralOptions.addKeyDownOption({
            variable: 'toggle_recording_keypress',
            description: 'Start/stop recording',
            defaultValue: {
                code: 82,
                key: 'KeyR',
                description: 'r',
            },
        });

        const recordedOutputBox = subtab.addBox({
            heading: 'Recorded Tiles',
            description: 'The tiles that have been recorded.',
        });

        recordedOutputBox.setHTML(OptionsPage.getRecordedOutputBoxHtml());
        recordedOutputBox.addAfterRefreshHook(() => { this.recordedOutputAfterRefresh(recordedOutputBox); });

        recordingGeneralOptions.addEventListener('save', () => {
            recordedOutputBox.setHTML(OptionsPage.getRecordedOutputBoxHtml());
            recordedOutputBox.refreshElement();
        });

        const recordingToggleBox = subtab.addBox({
            heading: 'Record',
            description: 'Start and stop recording.',
        });

        recordingToggleBox.setHTML(OptionsPage.getRecordingToggleBoxHtml());
        recordingToggleBox.addAfterRefreshHook(() => { this.recordingToggleAfterRefresh(recordingToggleBox); });
    }

    static getRecordingToggleBoxHtml() {
        const offset = '-2px';
        const offBlob = `<img src="data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0B%00%00%00%0D%08%03%00%00%00H%2Bd%09%00%00%00lPLTE%FF%FF%FF%D3%D3%D3%BB%BB%BB%9B%9B%9B%91%91%91%90%90%90%82%82%82%80%80%80~~~%7D%7D%7DuuullljjjgggbbbaaaUUUSSSMMMGGGDDD%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%2F%E3%EE%3C%00%00%00%16tRNS%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%00%01%D2%C0%E4%00%00%00_IDATx%DAT%8DI%0E%C0%20%0C%03%034%10%F6%00%E1%FF_-%B4%87R%9F%AC%915%86%F9%05%FE%5Dz%E3%D6e%F7%C1%25%C5TxL%10%CE%81%9C%0F%99%05z%0D%16%0D%DAP%3A%B4D%A8%95FJ%0D8%3A%A3%40%19%17yq%BF%F9%B5%F9%B9%7F%3D%F4x%96%BF.%7F%DD%FE%E3%F7%16%60%00%8E%9C%07%C8%8B%B1%7B%ED%00%00%00%00IEND%AEB%60%82" style="vertical-align:${offset};" alt="Off bloc created by Takius Stargazer" border="0">`;
        const onBlob = `<img src="data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0B%00%00%00%0D%08%03%00%00%00H%2Bd%09%00%00%00%7BPLTE%EF%00%01%DD%00%01%C5%00%01%B4%00%01%9A%00%01%95%00%01%88%00%01%7D%00%01%F9%00%00%F4%00%00%F4%01%00%EF%01%00%EE%00%00%DD%00%00%DD%01%00%CB%00%00%CB%01%00%C5%00%00%C5%01%00%BF%00%00%B4%00%00%B4%01%00%B3%00%00%9A%00%00%9A%01%00%99%00%00%95%00%00%88%00%00%88%01%00%7D%00%00%7D%01%00w%00%00v%00%00%FF%17%17%FF%18%18%FF--%FFpp%FFqq%FF%A3%A3%FF%FF%FF%FF%FF%FF%D1%8Fv%E3%00%00%00)tRNS%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%00R%F4%20%87%00%00%00wIDATx%DAT%8D%D1%0E%C2%20%14C%AB%E2%1C2D%C0%E1%B8%E8%04%99%C8%FF%7F%A1%98%18%8D%7D%3Ai%9A%1E%D4_%F0%CF1%D0%99.%F1%CDW%B6Y%2B%7D%F2%BB%8A%C8%AC%04%1F%A4%9Dn%08N%F6)%A7%FE0v%20%23%D2R%96%24%0C%C1%1Fy.%CF%92%F7j%02%E9%A1%F5%8F%BB%D0%F4%DD%CB1%20z%BB%12%1C%ED'%A2%CE%DE%19%A5%9D%9F%3F%5E%B6%ED%9A%F7%25%C0%00%C0~%0Ek%A4Y%8A%96%00%00%00%00IEND%AEB%60%82" style="vertical-align:${offset};" alt="On blob created by Takius Stargazer" border="0">`;

        const recordButtonId = 'pardus-flight-computer-record-button';

        const recording = PardusOptionsUtility.getVariableValue('recording', false);

        let recordingStatus = `${offBlob}&nbsp;Not recording`;
        let buttonText = 'Start recording';

        if (recording) {
            recordingStatus = `${onBlob}&nbsp;<font color='red'>Recording</font>`;
            buttonText = 'Stop recording';
        }

        return `<tr><td><div><table width="100%"><tbody><tr><td width="1%" style="white-space: nowrap;">Recording status:</td><td><div id="pardus-flight-computer-recording-status">${recordingStatus}</div></td><td align="right"><input type="button" value="${buttonText}" id="${recordButtonId}"></td></tr></tbody></table></div></td></tr>`;
    }

    static getRecordedOutputBoxHtml() {
        let recordingOutput = PardusOptionsUtility.getVariableValue('recorded_tiles', []).concat(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []).map((x) => `${x}|${PardusOptionsUtility.getVariableValue('bad_recorded_tile_colour', 'r')}`)).join(',');

        if (recordingOutput === '') {
            recordingOutput = 'No tiles recorded';
        }

        return `<tr><td><div><table width="100%"><tbody><tr><td colspan="3"><pre id="pardus-flight-computer-recording-output" style="padding: 5px; border-style: dashed; border-color: yellow; border-width: thin; white-space: pre-wrap; word-wrap: anywhere;">${recordingOutput}</pre></td></tr><tr><td align="right" colspan="3"><input value="Clear" id="pardus-flight-computer-clear-recording-output" type="button"></td></tr></tbody></table></div></td></tr>`;
    }

    recordingToggleAfterRefresh(recordingToggleBox) {
        const recordButton = document.getElementById('pardus-flight-computer-record-button');

        recordButton.addEventListener('click', () => {
            const recording = PardusOptionsUtility.getVariableValue('recording', false);
            PardusOptionsUtility.setVariableValue('recording', !recording);
            recordingToggleBox.setHTML(OptionsPage.getRecordingToggleBoxHtml());
            recordingToggleBox.refreshElement();
        });
    }

    recordedOutputAfterRefresh(recordedOutputBox) {
        const clearButton = document.getElementById('pardus-flight-computer-clear-recording-output');

        clearButton.addEventListener('click', () => {
            PardusOptionsUtility.setVariableValue('recorded_tiles', []);
            PardusOptionsUtility.setVariableValue('bad_recorded_tiles', []);
            PardusOptionsUtility.setVariableValue('expected_route', []);
            recordedOutputBox.setHTML(OptionsPage.getRecordedOutputBoxHtml());
            recordedOutputBox.refreshElement();
        });
    }

    static getMapperBoxHtml(squads = false) {
        const colouredTilesToHighlight = PardusOptionsUtility.getVariableValue(squads ? 'squads_tiles_to_highlight' : 'tiles_to_highlight', '').split(',');
        const tilesToHighlight = [];

        for (const tile of colouredTilesToHighlight) {
            if (tile) {
                tilesToHighlight.push(tile.split('|')[0]);
            }
        }

        const mapperUrls = mapperUrlsFromRoute(tilesToHighlight);

        let html = '<tr><td><div><table width="100%"><tbody>';

        for (const sector of mapperUrls) {
            html += `<tr><td>${sector[0]}</td><td style="word-wrap: anywhere;"><a href="${sector[1]}" target="_blank">${sector[1]}</a></td></tr>`;
        }

        if (mapperUrls.size === 0) {
            html += '<tr><td>No sectors detected in the currently-stored route.</td></tr>';
        }

        html += '</tbody></table></div></td></tr>';

        return html;
    }
}
