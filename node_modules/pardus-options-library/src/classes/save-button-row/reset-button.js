import AbstractButton from '../abstract/abstract-button.js';

export default class ResetButton extends AbstractButton {
    constructor({
        id,
        premium = false,
        disabled = false,
    }) {
        super({
            id,
            premium,
            disabled,
            actionText: 'Reset',
            actionPerformedText: 'Reset',
        });
    }

    displayReset() {
        this.displayClicked();
    }
}
