import PardusOptionsUtility from '../pardus-options-utility.js';
import OptionsContent from '../options-content.js';
import TabLabel from './tab-label.js';

export default class SubTab {
    constructor({
        id,
        label,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        refresh = true,
        active = false,
        padding,
    }) {
        this.id = id;
        this.active = active;
        this.label = new TabLabel({
            id: `${this.id}-label`,
            heading: label,
            active: this.active,
            padding,
        });
        this.content = new OptionsContent({
            id: `${this.id}-content`,
            saveFunction,
            getFunction,
            refresh,
            active: this.active,
        });
    }

    setActive() {
        if (this.active === true) {
            return;
        }
        this.active = true;
        this.label.setActive();
        this.content.setActive();
    }

    setInactive() {
        if (this.active === false) {
            return;
        }
        this.active = false;
        this.label.setInactive();
        this.content.setInactive();
    }

    afterRefreshElement(opts) {
        this.label.afterRefreshElement(opts);
        this.content.afterRefreshElement(opts);
    }

    getLabel() {
        return this.label;
    }

    getContent() {
        return this.content;
    }

    toString() {
        return this.content.toString();
    }
}
