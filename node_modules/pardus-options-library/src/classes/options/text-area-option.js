import AbstractOption from './abstract-option.js';
import PardusOptionsUtility from '../pardus-options-utility.js';

export default class TextAreaOption extends AbstractOption {
    constructor({
        id,
        variable,
        description,
        defaultValue = 0,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        disabled = false,
        info = null,
        rows = 3,
        cols = 65,
    }) {
        super({
            id,
            variable,
            description,
            defaultValue,
            saveFunction,
            getFunction,
            info,
            disabled,
            styleExtra: 'font-family: Helvetica, Arial, sans-serif;font-size:11px;',
        });
        this.rows = rows;
        this.cols = cols;
    }

    getInnerHTML() {
        return `<textarea id="${this.inputId}" width="100%" autocomplete="off" autocorrect="off" spellcheck="false" ${(this.rows === 0) ? '' : `rows="${this.rows}"`} ${(this.cols === 0) ? '' : `cols="${this.cols}"`} style="${this.style}" ${this.disabled ? 'disabled' : ''}>${this.getValue()}</textarea>`;
    }

    getCurrentValue() {
        return this.getInputElement().value;
    }
}
