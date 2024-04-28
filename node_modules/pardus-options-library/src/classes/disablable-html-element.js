import HtmlElement from './html-element.js';

/**
 * @class DisablableHtmlElement
 * @extends HtmlElement
 * @abstract
 */
export default class DisablableHtmlElement extends HtmlElement {
    constructor({
        id,
        disabled = false,
    }) {
        super(id);
        this.disabled = disabled;
    }

    /**
     * Disables this element and all nested elements
     * @function DisablableHtmlElement#disable
     */
    disable() {
        this.setDisabled(true);
        this.refreshElement();
    }

    /**
     * Enables this element and all nested elements
     * @function DisablableHtmlElement#enable
     */
    enable() {
        this.setDisabled(false);
        this.refreshElement();
    }

    /**
     * Allows disabling or enabling ths element and all nested elements without refreshing
     * @function DisablableHtmlElement#setDisabled
     */
    setDisabled(disabled = false) {
        this.disabled = disabled;
    }
}
