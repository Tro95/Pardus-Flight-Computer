import AbstractButton from '../abstract/abstract-button.js';

export default class SaveButton extends AbstractButton {
    constructor({
        id,
        premium = false,
        disabled = false,
    }) {
        super({
            id,
            premium,
            disabled,
            actionText: 'Save',
            actionPerformedText: 'Saved',
        });
    }

    displaySaved() {
        this.displayClicked();
    }
}
