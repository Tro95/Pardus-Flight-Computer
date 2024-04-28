import DisablableHtmlElement from './disablable-html-element.js';
import PardusOptionsUtility from './pardus-options-utility.js';
import SaveButtonRow from './save-button-row/save-button-row.js';
import Presets from './save-button-row/presets.js';
import OptionsGroup from './options-group.js';
import DescriptionElement from './description-element.js';

export default class OptionsBox extends DisablableHtmlElement {
    constructor({
        id,
        heading,
        premium = false,
        description = '',
        imageLeft = '',
        imageRight = '',
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        refresh = true,
        resetButton = false,
        presets = 0,
        disabled = false,
    }) {
        super({
            id,
            disabled,
        });
        this.heading = heading;
        this.premium = premium;
        this.saveFunction = saveFunction;
        this.getFunction = getFunction;
        this.refresh = refresh;
        this.resetButton = resetButton;
        this.disabled = disabled;

        const headerHtml = (premium) ? '<th class="premium">' : '<th>';
        this.frontContainer = `<form id="${this.id}" action="none"><table style="background:url(${PardusOptionsUtility.getImagePackUrl()}bgd.gif)" width="100%" cellpadding="3" align="center"><tbody><tr>${headerHtml}${heading}</th></tr>`;
        this.backContainer = '</tbody></table></form>';
        this.innerHtml = '';
        this.description = new DescriptionElement({
            id: `${this.id}-description`,
            description,
            imageLeft,
            imageRight,
        });
        this.optionsGroup = new OptionsGroup({
            id: `${this.id}-options-group`,
            premium,
            saveFunction,
            getFunction,
            disabled,
        });
        this.saveButtonRow = new SaveButtonRow({
            id: `${this.id}-save`,
            premium,
            resetButton,
            disabled,
        });
        this.presets = new Presets({
            id: `${this.id}-presets`,
            premium,
            presets,
            disabled,
        });
        this.addAfterRefreshHook((opts) => {
            if (opts.maintainRefreshStatus) {
                return;
            }
            this.refresh = true;
        });
        this.addAfterRefreshHook(() => {
            this.optionsGroup.afterRefreshElement();
            this.saveButtonRow.afterRefreshElement();
        });
        this.addAfterRefreshHook(() => {
            this.setFunctions();
        });
    }

    toString() {
        if (this.optionsGroup.options.length === 0) {
            return this.frontContainer + this.description + this.innerHtml + this.optionsGroup + this.backContainer;
        }
        return this.frontContainer + this.description + this.innerHtml + this.optionsGroup + this.saveButtonRow + this.presets + this.backContainer;
    }

    setFunctions() {
        if (this.optionsGroup.options.length !== 0) {
            this.saveButtonRow.addSaveEventListener(() => {
                for (const option of this.optionsGroup.options) {
                    option.saveValue();
                }
                this.saveButtonRow.displaySaved();

                const event = new Event('save');
                this.getElement().dispatchEvent(event);
            });
            this.saveButtonRow.addResetEventListener(() => {
                for (const option of this.optionsGroup.options) {
                    option.resetValue();
                }
                this.saveButtonRow.displayReset();
                this.optionsGroup.refreshElement();

                const event = new Event('reset');
                this.getElement().dispatchEvent(event);
            });
        }

        this.presets.setFunctions(this.optionsGroup.options);
    }

    /**
     * Allows disabling or enabling this element and all nested elements without refreshing
     * @function OptionsBox#setDisabled
     */
    setDisabled(disabled = false) {
        this.disabled = disabled;
        this.optionsGroup.setDisabled(disabled);
        this.saveButtonRow.setDisabled(disabled);
        this.presets.setDisabled(disabled);
    }

    addSaveEventListener(func) {
        return this.saveButtonRow.addSaveEventListener(func);
    }

    addBooleanOption({
        refresh = this.refresh,
        ...args
    }) {
        const newOption = this.optionsGroup.addBooleanOption(args);
        if (refresh) {
            this.refreshElement();
        }
        return newOption;
    }

    addTextAreaOption({
        refresh = this.refresh,
        ...args
    }) {
        const newOption = this.optionsGroup.addTextAreaOption(args);
        if (refresh) {
            this.refreshElement();
        }
        return newOption;
    }

    addNumericOption({
        refresh = this.refresh,
        ...args
    }) {
        const newOption = this.optionsGroup.addNumericOption(args);
        if (refresh) {
            this.refreshElement();
        }
        return newOption;
    }

    addKeyDownOption({
        refresh = this.refresh,
        ...args
    }) {
        const newOption = this.optionsGroup.addKeyDownOption(args);
        if (refresh) {
            this.refreshElement();
        }
        return newOption;
    }

    addSelectOption({
        refresh = this.refresh,
        ...args
    }) {
        const newOption = this.optionsGroup.addSelectOption(args);
        if (refresh) {
            this.refreshElement();
        }
        return newOption;
    }

    addGroupedOption({
        description,
        saveFunction = this.saveFunction,
        getFunction = this.getFunction,
        refresh = this.refresh,
    }) {
        const groupedOptions = {
            description,
            saveFunction,
            getFunction,
        };

        const newOption = this.optionsGroup.addGroupedOption(groupedOptions);
        if (refresh) {
            this.refreshElement();
        }
        return newOption;
    }
}
