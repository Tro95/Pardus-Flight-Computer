import HtmlElement from '../html-element.js';
import BooleanOption from './boolean-option.js';
import PardusOptionsUtility from '../pardus-options-utility.js';

export default class GroupedOptions extends HtmlElement {
    constructor({
        id,
        description,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
    }) {
        super(id);
        this.description = description;
        this.saveFunction = saveFunction;
        this.getFunction = getFunction;
        this.options = [];
    }

    toString() {
        return `<tr id="${this.id}"><td>${this.description}</td><td>${this.getInnerHTML()}</td></tr>`;
    }

    getInnerHTML() {
        let html = '<table><tbody><tr>';
        for (const option of this.options) {
            html += option;
        }
        html += '</tr></tbody></table>';
        return html;
    }

    saveValue() {
        for (const option of this.options) {
            option.saveValue();
        }
    }

    addBooleanOption({
        variable,
        description,
        defaultValue = false,
        saveFunction = this.saveFunction,
        getFunction = this.getFunction,
    }) {
        const booleanOptions = {
            id: `${this.id}-option-${this.options.length}`,
            variable,
            description,
            defaultValue,
            saveFunction,
            getFunction,
            shallow: true,
        };

        const newBooleanOption = new BooleanOption(booleanOptions);

        this.options.push(newBooleanOption);
        this.refreshElement();
        return newBooleanOption;
    }
}
