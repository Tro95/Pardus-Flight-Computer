import AbstractOption from './abstract-option.js';
import PardusOptionsUtility from '../pardus-options-utility.js';

export default class SelectOption extends AbstractOption {
    constructor({
        id,
        variable,
        description,
        defaultValue = null,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        disabled = false,
        info = null,
        inheritStyle = false,
        options = [],
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
            align: 'right',
        });
        this.options = options;

        if (inheritStyle) {
            this.addEventListener('change', () => {
                this.updateSelectStyle();
            });
        }
    }

    getInnerHTML() {
        let selectHtml = '';
        const savedValue = this.getValue();
        let hasSelected = false;
        let selectStyle = '';
        for (const option of this.options) {
            const style = (option.style) ? ` style="${option.style}"` : '';
            if (!hasSelected && (option.value === savedValue || (option.default && option.default === true && !savedValue))) {
                selectHtml += `<option value=${option.value}${style} selected>${option.text}</option>`;
                hasSelected = true;
                selectStyle = (option.style) ? ` style="${option.style}"` : '';
            } else {
                selectHtml += `<option value=${option.value}${style}>${option.text}</option>`;
            }
        }

        selectHtml = `<select id="${this.inputId}"${selectStyle} style="${this.style}" ${this.disabled ? 'disabled' : ''}>${selectHtml}`;

        return selectHtml;
    }

    updateSelectStyle() {
        const currentStyle = this.getInputElement().selectedOptions[0].getAttribute('style');
        this.getInputElement().setAttribute('style', currentStyle);
    }

    getOptions() {
        return this.options;
    }

    setOptions(options = []) {
        this.options = options;
    }

    getCurrentValue() {
        return this.getInputElement().value;
    }
}
