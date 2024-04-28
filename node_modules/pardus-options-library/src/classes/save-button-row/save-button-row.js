import DisablableHtmlElement from '../disablable-html-element.js';
import SaveButton from './save-button.js';
import ResetButton from './reset-button.js';

export default class SaveButtonRow extends DisablableHtmlElement {
    constructor({
        id,
        premium = false,
        resetButton = false,
        disabled = false,
    }) {
        super({
            id,
            disabled,
        });
        this.premium = premium;
        this.saveButton = new SaveButton({
            id: `${this.id}-button`,
            premium,
            disabled,
        });

        if (resetButton) {
            this.resetButton = new ResetButton({
                id: `${this.id}-reset-button`,
                premium,
                disabled,
            });
        } else {
            this.resetButton = null;
        }
    }

    toString() {
        return `<tr id="${this.id}"><td align="right" style="padding-right: 6px;">${(this.resetButton) ? `${this.resetButton}&nbsp` : ''}${this.saveButton}</td></tr>`;
    }

    /**
     * Allows disabling or enabling this element and all nested elements without refreshing
     * @function SaveButtonRow#setDisabled
     */
    setDisabled(disabled = false) {
        this.disabled = disabled;
        this.saveButton.setDisabled(disabled);
        if (this.resetButton) {
            this.resetButton.setDisabled(disabled);
        }
    }

    displaySaved() {
        this.saveButton.displaySaved();
    }

    displayReset() {
        if (this.resetButton) {
            this.resetButton.displayReset();
        }
    }

    addSaveEventListener(func) {
        this.saveButton.addEventListener('click', func);
    }

    addResetEventListener(func) {
        if (this.resetButton) {
            this.resetButton.addEventListener('click', func);
        }
    }
}
