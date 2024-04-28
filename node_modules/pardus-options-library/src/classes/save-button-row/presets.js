import DisablableHtmlElement from '../disablable-html-element.js';
import PresetRow from './preset-row.js';

export default class Presets extends DisablableHtmlElement {
    constructor({
        id,
        premium = false,
        disabled = false,
        presets = 0,
    }) {
        super({
            id,
            disabled,
        });
        this.premium = premium;
        this.presets = [];
        for (let i = 0; i < presets; i += 1) {
            this.presets.push(new PresetRow({
                id: `${this.id}-preset-row-${i}`,
                premium,
                disabled,
                presetNumber: i + 1,
            }));
        }
    }

    /**
     * Allows disabling or enabling this element and all nested elements without refreshing
     * @function Presets#setDisabled
     */
    setDisabled(disabled = false) {
        this.disabled = disabled;
        for (const preset of this.presets) {
            preset.setDisabled(disabled);
        }
    }

    toString() {
        if (this.presets.length === 0) {
            return '';
        }

        let html = `<tr id="${this.id}"><td><table width="100%">`;

        for (const presetRow of this.presets) {
            html += presetRow;
        }

        return `${html}</table></td></tr>`;
    }

    setFunctions(options) {
        for (const presetRow of this.presets) {
            presetRow.setFunctions(options);
        }
    }
}
