import AbstractButton from './abstract-button.js';

export default class AbstractToggleButton extends AbstractButton {
    constructor({
        id,
        premium = false,
        disabled = false,
        styleExtra = '',
        actionText = '',
        actionPerformedText = '',
        toggleText = '',
        togglePerformedText = '',
        toggled = false,
    }) {
        super({
            id,
            premium,
            disabled,
            styleExtra,
            actionText,
            actionPerformedText,
        });

        this.toggled = toggled;

        this.defaultText = actionText;
        this.defaultPerformedText = actionPerformedText;
        this.toggleText = toggleText;
        this.togglePerformedText = togglePerformedText;

        if (this.toggled) {
            this.actionText = this.toggleText;
            this.actionPerformedText = this.togglePerformedText;
        }
    }

    toggle() {
        this.toggled = !this.toggled;

        if (this.toggled) {
            this.actionText = this.toggleText;
            this.actionPerformedText = this.togglePerformedText;
        } else {
            this.actionText = this.defaultText;
            this.actionPerformedText = this.defaultPerformedText;
        }

        this.refreshElement();
    }

    toString() {
        return `<input value="${this.actionText}" id="${this.id}" type="button" style="${this.style}" ${this.disabled ? 'disabled' : ''}>`;
    }

    displayClicked() {
        this.getElement().setAttribute('disabled', 'true');
        this.getElement().value = this.actionPerformedText;
        this.getElement().setAttribute('style', 'color:green;background-color:silver');
        setTimeout(() => {
            this.getElement().removeAttribute('disabled');
            this.getElement().value = this.actionText;
            if (this.premium) {
                this.getElement().setAttribute('style', 'color:#FFCC11');
            } else {
                this.getElement().removeAttribute('style');
            }
        }, 2000);
    }

    /**
     * Add an event listener to the element
     * @function HtmlElement#addEventListener
     * @param {string} eventName Name of the event to listen for
     * @param {function} listener Listener to call when the event fires
     */
    addClickListener(listener, opts = false) {
        if (this.getElement() && !this.toggled) {
            this.getElement().addEventListener('click', listener, opts);
        }

        if (opts && Object.hasOwn(opts, 'ephemeral') && opts.ephemeral) {
            return;
        }

        this.addAfterRefreshHook(() => {
            if (this.getElement() && !this.toggled) {
                this.getElement().addEventListener('click', listener, opts);
            }
        });
    }

    /**
     * Add an event listener to the element
     * @function HtmlElement#addEventListener
     * @param {string} eventName Name of the event to listen for
     * @param {function} listener Listener to call when the event fires
     */
    addToggleClickListener(listener, opts = false) {
        if (this.getElement() && this.toggled) {
            this.getElement().addEventListener('click', listener, opts);
        }

        if (opts && Object.hasOwn(opts, 'ephemeral') && opts.ephemeral) {
            return;
        }

        this.addAfterRefreshHook(() => {
            if (this.getElement() && this.toggled) {
                this.getElement().addEventListener('click', listener, opts);
            }
        });
    }

    setDisabled(disabled = false) {
        this.disabled = disabled;
        if (this.disabled) {
            this.colour = '#B5B5B5';
            this.backgroundColour = '#CCCCCC';
        } else {
            if (this.premium) {
                this.colour = '#FFCC11';
            } else {
                this.colour = '#D0D1D9';
            }
            this.backgroundColour = '#00001C';
        }
        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;
    }

    disable() {
        this.setDisabled(true);
        if (this.getElement()) {
            this.getElement().setAttribute('disabled', 'true');
            this.getElement().setAttribute('style', this.style);
        }
    }

    enable() {
        this.setDisabled(false);
        if (this.getElement()) {
            this.getElement().removeAttribute('disabled');
            this.getElement().setAttribute('style', this.style);
        }
    }
}
