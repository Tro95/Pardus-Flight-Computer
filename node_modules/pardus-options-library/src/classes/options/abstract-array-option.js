import AbstractOption from './abstract-option.js';
import PardusOptionsUtility from '../pardus-options-utility.js';

export default class AbstractArrayOption extends AbstractOption {
    constructor({
        id,
        variable,
        description,
        defaultValue = [],
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
    }) {
        super({
            id,
            variable,
            description,
            defaultValue,
            saveFunction,
            getFunction,
        });
    }

    toString() {
        return `<tr id="${this.id}"><td>${this.description}</td><td>${this.getInnerHTML()}</td></tr>`;
    }

    getInnerHTML() {
        let html = '<table><tbody>';
        const currentValues = this.getValue();

        for (const value of currentValues) {
            html += `<tr><td><input type="text" value="${value}"></td><td><input type="button" value="-"></td></tr>`;
        }
        html += '<tr><td><input type="text" value=""></td><td><input type="button" value="+"></td></tr>';
        html += '</tbody></table>';
        return html;
    }
}
