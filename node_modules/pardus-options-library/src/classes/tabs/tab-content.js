import HtmlElement from '../html-element.js';
import PardusOptionsUtility from '../pardus-options-utility.js';
import TabsRow from './tabs-row.js';
import SubTab from './sub-tab.js';
import VersionRow from '../version-row.js';

export default class TabContent extends HtmlElement {
    constructor({
        id,
        heading,
        defaultLabel = 'Default tab',
        content = null,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        refresh = true,
    }) {
        super(id);
        this.heading = heading;
        this.content = content;
        this.saveFunction = saveFunction;
        this.getFunction = getFunction;
        this.subTabsRow = new TabsRow({
            id: `${this.id}-tabsrow`,
        });
        this.refresh = refresh;
        this.subTabs = [];
        this.defaultTab = this.addSubTab({
            label: defaultLabel,
            saveFunction: this.saveFunction,
            getFunction: this.getFunction,
            refresh: false,
            active: true,
        });
        this.versionRow = new VersionRow({
            id: `${this.id}-versionrow`,
        });
        this.addAfterRefreshHook((opts) => {
            if (opts.maintainRefreshStatus) {
                return;
            }
            this.refresh = true;
        });
        this.addAfterRefreshHook((opts) => {
            if (!this.refresh && opts.maintainRefreshStatus) {
                return;
            }
            for (const subTab of this.subTabs) {
                subTab.afterRefreshElement(opts);
            }
        });
    }

    addSubTab({
        label,
        saveFunction = this.saveFunction,
        getFunction = this.getFunction,
        refresh = this.refresh,
        active = false,
        padding,
    }) {
        const newSubTab = new SubTab({
            id: `${this.id}-subtab-${this.subTabs.length}`,
            label,
            saveFunction,
            getFunction,
            refresh,
            active,
            padding,
        });

        const newSubTabContent = newSubTab.getContent();
        const newSubTabLabel = newSubTab.getLabel();

        this.subTabsRow.addLabel({
            label: newSubTabLabel,
        });

        this.subTabs.push(newSubTab);

        newSubTabLabel.addEventListener('click', () => {
            this.setActiveSubTab(newSubTab.id);
        });

        if (refresh) {
            this.refreshElement();
        }

        return newSubTabContent;
    }

    setActiveSubTab(subTabId) {
        for (const subTab of this.subTabs) {
            if (subTab.id === subTabId) {
                subTab.setActive();
            } else {
                subTab.setInactive();
            }
        }
    }

    addBox(args) {
        return this.defaultTab.addBox(args);
    }

    addBoxBottom(args) {
        return this.defaultTab.addBoxBottom(args);
    }

    addBoxTop(args) {
        return this.defaultTab.addBoxTop(args);
    }

    addBoxLeft(args) {
        return this.defaultTab.addBoxLeft(args);
    }

    addBoxRight(args) {
        return this.defaultTab.addBoxRight(args);
    }

    addPremiumBox(args) {
        return this.defaultTab.addPremiumBox(args);
    }

    addPremiumBoxLeft(args) {
        return this.defaultTab.addPremiumBoxLeft(args);
    }

    addPremiumBoxRight(args) {
        return this.defaultTab.addPremiumBoxRight(args);
    }

    setActive() {
        this.getElement().removeAttribute('hidden');
    }

    setInactive() {
        this.getElement().setAttribute('hidden', '');
    }

    toString() {
        if (this.content !== null) {
            return this.content;
        }
        const hidden = (this.subTabs.length > 1) ? '' : 'hidden';
        const innerStyle = (this.subTabs.length > 1) ? 'class="tabstyle"' : '';
        return `<table id="${this.id}" hidden class="tabstyle" style="background:url(${PardusOptionsUtility.getImagePackUrl()}bgdark.gif)" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td><div align="center"><h1>${this.heading}</h1></div></td></tr><tr><td><table width="100%" align="center" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td><table cellspacing="0" cellpadding="0" border="0" ${hidden}><tbody>${this.subTabsRow}</tbody></table></td></tr><tr><td><table ${innerStyle} cellspacing="0" cellpadding="0" border="0"><tbody>${this.subTabs.join('')}</tbody></table></td></tr></tbody></table></td></tr>${this.versionRow}</tbody></table>`;
    }
}
