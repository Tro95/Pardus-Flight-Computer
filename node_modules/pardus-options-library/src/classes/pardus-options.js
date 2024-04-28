import PardusOptionsUtility from './pardus-options-utility.js';
import TipBox from './tip-box.js';
import TabsElement from './tabs/tabs-element.js';
import ContentsArea from './contents-area.js';
import Tab from './tabs/tab.js';

/**
 * @module PardusOptions
 */
export default class PardusOptions {
    /**
     *  @ignore
     */
    static init() {
        if (document.getElementById('options-area')) {
            return;
        }

        // Get the normal Pardus options
        const defaultPardusOptionsContent = document.getElementsByTagName('table')[2];

        // Identify the containing HTML element to house all the options HTML
        const pardusMainElement = defaultPardusOptionsContent.parentNode;

        // Give the Pardus options an appropriate id, and remove it from the DOM
        defaultPardusOptionsContent.setAttribute('id', 'options-content-pardus-default');
        defaultPardusOptionsContent.setAttribute('class', 'tabstyle');
        defaultPardusOptionsContent.remove();

        // Add this object to the DOM within the main containing element
        pardusMainElement.appendChild(this.getPardusOptionsElement());

        const defaultTipBox = this.createDefaultTipBox();
        pardusMainElement.appendChild(defaultTipBox.toElement());

        // Add the Pardus options back in
        this.addTab({
            id: 'pardus-default',
            heading: 'Pardus Options',
            content: defaultPardusOptionsContent.outerHTML,
            refresh: false,
        });

        // Set the Pardus options tab to be active by default
        PardusOptionsUtility.setActiveTab('pardus-default');
    }

    /**
     *  @deprecated Get the version of the Pardus Options Library running
     */
    static version() {
        return 1.6;
    }

    /**
     * @ignore
     */
    static createDefaultTipBox() {
        return new TipBox({
            id: 'options-default-tip-box',
        });
    }

    /**
     * @ignore
     */
    static getDefaultTipBox() {
        const defaultTipBox = this.createDefaultTipBox();
        defaultTipBox.refreshElement();
        return defaultTipBox;
    }

    /**
     * @ignore
     */
    static getTabsElement() {
        return new TabsElement({
            id: 'options-tabs',
        });
    }

    /**
     * @ignore
     */
    static getContentElement() {
        return new ContentsArea({
            id: 'options-content',
        });
    }

    /**
     * @ignore
     */
    static getPardusOptionsElement() {
        const template = document.createElement('template');
        template.innerHTML = `<table id="options-area" cellspacing="0" cellpadding="0" border="0"><tbody><tr cellspacing="0" cellpadding="0" border="0"><td>${this.getTabsElement()}</td></tr>${this.getContentElement()}</tbody></table>`;
        return template.content.firstChild;
    }

    /**
     * Add a tab on the Options page on Pardus to show your options
     * @param {Object} params An object containing parameter values
     * @param {string} params.id A namespace identifier to identify the tab from other tabs. Must be globally unique.
     * @param {string} params.heading Text to display in the tab
     * @param {string} params.content HTML to embed within the tab.
     * @returns {TabContent} Tab
     */
    static addTab({
        id,
        heading,
        content = null,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        refresh = true,
        defaultLabel,
    }) {
        const newTab = new Tab({
            id,
            heading,
            content,
            saveFunction,
            getFunction,
            refresh,
            defaultLabel,
        });

        // Check for id uniqueness
        if (document.getElementById(newTab.id)) {
            throw new Error(`Tab '${newTab.id}' already exists!`);
        }

        this.getTabsElement().addLabel({
            label: newTab.getLabel(),
        });

        this.getContentElement().addContent({
            content: newTab.getContent(),
        });

        newTab.addListeners();

        return newTab.getContent();
    }
}
