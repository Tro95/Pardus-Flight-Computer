import AbstractOption from './abstract-option.js';

/**
 * @class BooleanOption
 * @extends AbstractOption
 */
export default class BooleanOption extends AbstractOption {
    getInnerHTML() {
        let checkedStatus = '';
        if (this.getValue() === true) {
            checkedStatus = ' checked';
        }
        return `<input id="${this.inputId}" type="checkbox"${checkedStatus} style="${this.style}" ${this.disabled ? 'disabled' : ''}>`;
    }

    getCurrentValue() {
        return this.getInputElement().checked;
    }
}
