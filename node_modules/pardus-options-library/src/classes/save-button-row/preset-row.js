import DisablableHtmlElement from '../disablable-html-element.js';
import SaveButton from './save-button.js';
import LoadButton from './load-button.js';
import PresetLabel from './preset-label.js';

export default class PresetRow extends DisablableHtmlElement {
    constructor({
        id,
        premium = false,
        disabled = false,
        presetNumber,
    }) {
        super({
            id,
            disabled,
        });
        this.premium = premium;
        this.saveButton = new SaveButton({
            id: `${this.id}-save-button`,
            premium,
            disabled,
        });
        this.loadButton = new LoadButton({
            id: `${this.id}-load-button`,
            premium,
            disabled,
        });
        this.presetNumber = presetNumber;
        this.label = new PresetLabel({
            id: `${this.id}-label`,
            defaultValue: `Preset ${this.presetNumber}`,
            disabled,
        });

        if (!this.hasValue()) {
            this.loadButton.disable();
        }
    }

    toString() {
        return `<tr id="${this.id}"><td align="left">${this.label}</input></td><td align="right">${this.loadButton} ${this.saveButton}</td></tr>`;
    }

    /**
     * Allows disabling or enabling this element and all nested elements without refreshing
     * @function PresetRow#setDisabled
     */
    setDisabled(disabled = false) {
        this.disabled = disabled;
        this.saveButton.setDisabled(disabled);
        this.loadButton.setDisabled(disabled);
        this.label.setDisabled(disabled);
    }

    displaySaved() {
        this.saveButton.displaySaved();
    }

    displayLoaded() {
        if (this.loadButton) {
            this.loadButton.displayLoaded();
        }
    }

    hasValue() {
        return this.label.hasValue();
    }

    setFunctions(options) {
        if (options.length !== 0) {
            this.addSaveEventListener(() => {
                for (const option of options) {
                    option.saveValue((name, value) => {
                        option.saveFunction(`preset-${this.presetNumber}-${name}`, value);
                    });
                }
                this.displaySaved();
                this.loadButton.enable();

                this.label.save();

                const event = new Event('preset-save', { bubbles: true });
                this.getElement().dispatchEvent(event);
            });
            this.addLoadEventListener(() => {
                for (const option of options) {
                    option.loadValue(option.getValue((name, value) => option.getFunction(`preset-${this.presetNumber}-${name}`, value)));
                }
                this.displayLoaded();

                const event = new Event('preset-load', { bubbles: true });
                this.getElement().dispatchEvent(event);
            });
        }
    }

    addSaveEventListener(func) {
        this.saveButton.addEventListener('click', func);
    }

    addLoadEventListener(func) {
        if (this.loadButton) {
            this.loadButton.addEventListener('click', func);
        }
    }
}
