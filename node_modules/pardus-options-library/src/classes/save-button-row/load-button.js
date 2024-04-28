import AbstractButton from '../abstract/abstract-button.js';

export default class LoadButton extends AbstractButton {
    constructor({
        id,
        premium = false,
        disabled = false,
    }) {
        super({
            id,
            premium,
            disabled,
            actionText: 'Load',
            actionPerformedText: 'Loaded',
        });
    }

    displayLoaded() {
        this.displayClicked();
    }
}
