import DisablableHtmlElement from '../disablable-html-element.js';

export default class AbstractButton extends DisablableHtmlElement {
    constructor({
        id,
        premium = false,
        disabled = false,
        styleExtra = '',
        actionText = '',
        actionPerformedText = '',
    }) {
        super({
            id,
            disabled,
        });

        this.premium = premium;

        if (this.premium) {
            this.colour = '#FFCC11';
        } else {
            this.colour = '#D0D1D9';
        }

        this.backgroundColour = '#00001C';

        if (this.disabled) {
            this.colour = '#B5B5B5';
            this.backgroundColour = '#CCCCCC';
        }

        this.styleExtra = styleExtra;
        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;

        this.actionText = actionText;
        this.actionPerformedText = actionPerformedText;
    }

    toString() {
        return `<input value="${this.actionText}" id="${this.id}" type="button" style="${this.style}" ${this.disabled ? 'disabled' : ''}>`;
    }

    /**
     * Add an event listener to the element
     * @function HtmlElement#addEventListener
     * @param {function} listener Listener to call when the event fires
     */
    addClickListener(listener, opts = false) {
        if (this.getElement()) {
            this.getElement().addEventListener('click', listener, opts);
        }

        if (opts && Object.hasOwn(opts, 'ephemeral') && opts.ephemeral) {
            return;
        }

        this.addAfterRefreshHook(() => {
            if (this.getElement()) {
                this.getElement().addEventListener('click', listener, opts);
            }
        });
    }

    setActionText(actionText = '', actionPerformedText = '') {
        this.actionText = actionText;
        this.actionPerformedText = actionPerformedText;
        this.refreshElement();
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
