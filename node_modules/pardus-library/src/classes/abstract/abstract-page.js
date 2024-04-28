export default class AbstractPage {
    #page;

    constructor(pageName = '') {
        if (pageName === '') {
            throw "Page is not defined for class";
        }

        this.#page = pageName;
    }

    toString() {
        return this.#page;
    }

    navigateTo() {
        document.location.assign(`${document.location.origin}${this.#page}`);
    }

    isActive() {
        return document.location.pathname === this.#page;
    }
}
