import PardusOptionsUtility from '../pardus-options-utility.js';
import TabLabel from './tab-label.js';
import TabContent from './tab-content.js';

export default class Tab {
    constructor({
        id,
        heading,
        content = null,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        refresh = true,
        defaultLabel,
    }) {
        this.id = id;
        this.heading = heading;
        this.content = new TabContent({
            id: `options-content-${this.id}`,
            heading,
            content,
            saveFunction,
            getFunction,
            refresh,
            defaultLabel,
        });
        this.label = new TabLabel({
            id: `${this.id}-label`,
            heading,
        });
        this.active = false;
        this.saveFunction = saveFunction;
        this.getFunction = getFunction;
    }

    addListeners() {
        this.getLabel().addEventListener('click', () => PardusOptionsUtility.setActiveTab(this.id), true);
        window.addEventListener('storage', () => {
            if (window.localStorage.getItem('pardusOptionsOpenTab') === this.id && !this.active) {
                this.setActive();
            }
            if (window.localStorage.getItem('pardusOptionsOpenTab') !== this.id && this.active) {
                this.setInactive();
            }
        });
    }

    setActive() {
        this.label.setActive();
        this.content.setActive();
        this.active = true;
    }

    setInactive() {
        this.label.setInactive();
        this.content.setInactive();
        this.active = false;
    }

    getContent() {
        return this.content;
    }

    getLabel() {
        return this.label;
    }
}
