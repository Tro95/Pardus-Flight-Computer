import AbstractToggleButton from '../abstract/abstract-toggle-button.js';

export default class DisableButton extends AbstractToggleButton {
    constructor({
        id,
        premium = false,
        disabled = false,
        toggled = false,
    }) {
        super({
            id,
            premium,
            disabled,
            toggled,
            actionText: 'Disable',
            toggleText: 'Enable',
            styleExtra: 'width:58px;',
        });
    }
}
