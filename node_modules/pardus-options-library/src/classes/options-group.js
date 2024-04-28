import DisablableHtmlElement from './disablable-html-element.js';
import PardusOptionsUtility from './pardus-options-utility.js';
import BooleanOption from './options/boolean-option.js';
import TextAreaOption from './options/text-area-option.js';
import NumericOption from './options/numeric-option.js';
import KeyDownOption from './options/key-down-option.js';
import SelectOption from './options/select-option.js';
import GroupedOptions from './options/grouped-options.js';

export default class OptionsGroup extends DisablableHtmlElement {
    constructor({
        id,
        premium = false,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        disabled = false,
    }) {
        super({
            id,
            disabled,
        });
        this.premium = premium;
        this.saveFunction = saveFunction;
        this.getFunction = getFunction;
        this.options = [];
        this.disabled = disabled;
        this.addAfterRefreshHook(() => {
            for (const option of this.options) {
                option.afterRefreshElement();
            }
        });
    }

    setDisabled(disabled = false) {
        this.disabled = disabled;
        for (const option of this.options) {
            option.setDisabled(disabled);
        }
    }

    addBooleanOption(args) {
        const newOption = new BooleanOption({
            id: `${this.id}-option-${this.options.length}`,
            disabled: this.disabled,
            ...args,
        });
        this.options.push(newOption);
        return newOption;
    }

    addTextAreaOption(args) {
        const newOption = new TextAreaOption({
            id: `${this.id}-option-${this.options.length}`,
            disabled: this.disabled,
            ...args,
        });
        this.options.push(newOption);
        return newOption;
    }

    addNumericOption(args) {
        const newOption = new NumericOption({
            id: `${this.id}-option-${this.options.length}`,
            disabled: this.disabled,
            ...args,
        });
        this.options.push(newOption);
        return newOption;
    }

    addKeyDownOption(args) {
        const newOption = new KeyDownOption({
            id: `${this.id}-option-${this.options.length}`,
            disabled: this.disabled,
            ...args,
        });
        this.options.push(newOption);
        return newOption;
    }

    addSelectOption(args) {
        const newOption = new SelectOption({
            id: `${this.id}-option-${this.options.length}`,
            disabled: this.disabled,
            ...args,
        });
        this.options.push(newOption);
        return newOption;
    }

    addGroupedOption({
        description,
        saveFunction = this.saveFunction,
        getFunction = this.getFunction,
    }) {
        const newOption = new GroupedOptions({
            id: `${this.id}-option-${this.options.length}`,
            disabled: this.disabled,
            description,
            saveFunction,
            getFunction,
        });
        this.options.push(newOption);
        return newOption;
    }

    toString() {
        // If no options have been defined, then don't add any elements
        if (this.options.length === 0) {
            return `<tr id="${this.id}" style="display: none;"><td><table width="100%"><tbody></tbody></table></td></tr>`;
        }
        return `<tr id="${this.id}"><td><table width="100%"><tbody>${this.options.join('')}</tbody></table></td></tr>`;
    }
}
