/**
 * @class HtmlElement
 */
export default class HtmlElement {
    /**
     * @constructor HtmlElement
     * @param {string} id HTML identifier for the element. Must be globally unique.
     */
    constructor(id) {
        // Make sure it is a valid html identifier
        if (!id || id === '') {
            throw new Error('Id cannot be empty.');
        }
        const validIds = /^[a-zA-Z][\w:.-]*$/;
        if (!validIds.test(id)) {
            throw new Error(`Id '${id}' is not a valid HTML identifier.`);
        }

        this.id = id;
        this.afterRefreshHooks = [];
        this.beforeRefreshHooks = [];
    }

    /**
     * Add an event listener to the element
     * @function HtmlElement#addEventListener
     * @param {string} eventName Name of the event to listen for
     * @param {function} listener Listener to call when the event fires
     */
    addEventListener(eventName, listener, opts = false) {
        if (this.getElement()) {
            this.getElement().addEventListener(eventName, listener, opts);
        }

        if (opts && Object.hasOwn(opts, 'ephemeral') && opts.ephemeral) {
            return;
        }

        this.addAfterRefreshHook(() => {
            if (this.getElement()) {
                this.getElement().addEventListener(eventName, listener, opts);
            }
        });
    }

    /**
     * Remove an event listener from the element
     * @function HtmlElement#removeEventListener
     * @param {string} eventName Name of the event to listen for
     * @param {function} listener Listener to call when the event fires
     */
    removeEventListener(eventName, listener) {
        if (this.getElement()) {
            this.getElement().removeEventListener(eventName, listener);
        }
    }

    /**
     * Return a string representation of the html element
     * @function HtmlElement#toString
     * @returns {string} String representation of the html element
     */
    toString() {
        return `<div id='${this.id}'></div>`;
    }

    /**
     * Run all hooks that should be called prior to refreshing the element
     * @function HtmlElement#beforeRefreshElement
     */
    beforeRefreshElement() {
        for (const func of this.beforeRefreshHooks) {
            func();
        }
    }

    /**
     * Run all hooks that should be called after refreshing the element
     * @function HtmlElement#afterRefreshElement
     * @param {object} opts Optional arguments to be passed to the hooks
     */
    afterRefreshElement(opts = {}) {
        for (const func of this.afterRefreshHooks) {
            func(opts);
        }
    }

    /**
     * Add a hook to run after the element is refreshed
     * @function HtmlElement#addAfterRefreshElement
     * @param {function} func Function to call after the element is refreshed
     */
    addAfterRefreshHook(func) {
        this.afterRefreshHooks.push(func);
    }

    /**
     * Refresh the element in the dom
     * @function HtmlElement#refreshElement
     */
    refreshElement() {
        this.beforeRefreshElement();
        this.getElement().replaceWith(this.toElement());
        this.afterRefreshElement();
    }

    /**
     * Gets how much the element should be offset from the top of the DOM
     * @function HtmlElement#getOffsetTop
     * @returns {integer} Pixels the element is offset from the top of the DOM
     */
    getOffsetTop() {
        let currentOffset = this.getElement().offsetTop + this.getElement().offsetHeight;
        let parent = this.getElement().offsetParent;

        while (parent !== null) {
            currentOffset += parent.offsetTop;
            parent = parent.offsetParent;
        }

        return currentOffset;
    }

    /**
     * Gets how much the element should be offset from the left of the DOM
     * @function HtmlElement#getOffsetLeft
     * @returns {integer} Pixels the element is offset from the left of the DOM
     */
    getOffsetLeft() {
        let currentOffset = this.getElement().offsetLeft;
        let parent = this.getElement().offsetParent;

        while (parent !== null) {
            currentOffset += parent.offsetLeft;
            parent = parent.offsetParent;
        }

        return currentOffset;
    }

    /**
     * Gets the element
     * @function HtmlElement#getElement
     * @returns {element} Element
     */
    getElement() {
        return document.getElementById(this.id);
    }

    /**
     * Creates the element within the DOM from the string representation
     * @function HtmlElement#toElement
     * @returns {element} Element
     */
    toElement() {
        const template = document.createElement('template');
        template.innerHTML = this.toString();
        return template.content.firstChild;
    }

    /**
     * Appends a child element to the element within the DOM
     * @function HtmlElement#appendChild
     * @param {element} child The child to append
     * @returns {element} The child element
     */
    appendChild(ele) {
        return document.getElementById(this.id).appendChild(ele);
    }

    /**
     * Appends a child element to the element if it was a table within the DOM
     * @function HtmlElement#appendTableChild
     * @param {element} child The child to append
     * @returns {element} The child element
     */
    appendTableChild(ele) {
        return document.getElementById(this.id).firstChild.appendChild(ele);
    }

    /**
     * Sets the innerHTML property of the element
     * @function HtmlElement#setHTML
     * @param {html} html to set inside the element
     */
    setHTML(html) {
        this.innerHtml = html;
    }
}
