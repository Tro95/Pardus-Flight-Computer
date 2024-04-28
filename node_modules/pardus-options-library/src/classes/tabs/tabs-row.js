import HtmlElement from '../html-element.js';

export default class TabsRow extends HtmlElement {
    constructor({
        id,
        hidden = false,
    }) {
        super(id);
        this.hidden = hidden;
        this.labels = [];
        this.addAfterRefreshHook(() => {
            for (const label of this.labels) {
                label.afterRefreshElement();
            }
        });
    }

    addLabel({
        label,
    }) {
        this.labels.push(label);
        if (this.getElement()) {
            this.appendChild(label.toElement());
            label.afterRefreshElement();
        }
    }

    show() {
        this.hidden = false;
        this.refreshElement();
    }

    hide() {
        this.hidden = true;
        this.refreshElement();
    }

    toString() {
        if (this.hidden) {
            return `<tr id="${this.id}" cellspacing="0" cellpadding="0" border="0" hidden="">${this.labels.join('')}</tr>`;
        }
        return `<tr id="${this.id}" cellspacing="0" cellpadding="0" border="0">${this.labels.join('')}</tr>`;
    }
}
