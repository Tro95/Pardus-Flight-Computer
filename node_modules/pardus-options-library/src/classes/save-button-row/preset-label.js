import DisablableHtmlElement from '../disablable-html-element.js';
import PardusOptionsUtility from '../pardus-options-utility.js';

export default class PresetLabel extends DisablableHtmlElement {
    constructor({
        id,
        disabled = false,
        defaultValue = '',
    }) {
        super({
            id,
            disabled,
        });
        this.defaultValue = defaultValue;
        this.styleExtra = '';
        this.colour = '#D0D1D9';
        this.backgroundColour = '#00001C';

        if (this.disabled) {
            this.colour = '#B5B5B5';
            this.backgroundColour = '#CCCCCC';
        }

        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;
    }

    toString() {
        return `<input id="${this.id}" type="text" value="${this.getValue()}" style="${this.style}" ${this.disabled ? 'disabled' : ''}></input>`;
    }

    save() {
        PardusOptionsUtility.defaultSaveFunction(`${PardusOptionsUtility.getVariableName(this.id)}`, this.getCurrentValue());
    }

    hasValue() {
        if (!PardusOptionsUtility.defaultGetFunction(`${PardusOptionsUtility.getVariableName(this.id)}`, false)) {
            return false;
        }

        return true;
    }

    /**
     * Disables the input element
     * @function AbstractOption#disable
     */
    disable() {
        this.setDisabled(true);
        if (this.getInputElement()) {
            this.getInputElement().removeAttribute('disabled');
            this.getInputElement().setAttribute('style', this.style);
        }
    }

    /**
     * Enables the input element
     * @function AbstractOption#enable
     */
    enable() {
        this.setDisabled(false);
        if (this.getInputElement()) {
            this.getInputElement().removeAttribute('disabled');
            this.getInputElement().setAttribute('style', this.style);
        }
    }

    setDisabled(disabled = false) {
        this.disabled = disabled;
        if (this.disabled) {
            this.colour = '#B5B5B5';
            this.backgroundColour = '#CCCCCC';
        } else {
            this.colour = '#D0D1D9';
            this.backgroundColour = '#00001C';
        }
        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;
    }

    /**
     * Gets the input element for the option
     * @function PresetLabel#getInputElement
     * @returns {object} Input element
     */
    getInputElement() {
        return document.getElementById(this.id);
    }

    getCurrentValue() {
        return this.getInputElement().value;
    }

    getValue() {
        return PardusOptionsUtility.defaultGetFunction(`${PardusOptionsUtility.getVariableName(this.id)}`, this.defaultValue);
    }
}
