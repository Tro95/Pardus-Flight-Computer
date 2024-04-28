import HtmlElement from '../html-element.js';
import TabsRow from './tabs-row.js';

export default class TabsElement extends HtmlElement {
    constructor({
        id,
    }) {
        super(id);
        this.tabsRow = new TabsRow({
            id: `${this.id}-row`,
        });
    }

    addLabel({
        label,
    }) {
        this.tabsRow.addLabel({
            label,
        });
    }

    toString() {
        return `<table id="${this.id}" cellspacing="0" cellpadding="0" border="0" align="left"><tbody>${this.tabsRow}</tbody></table>`;
    }
}
