import HtmlElement from './html-element.js';

export default class ContentsArea extends HtmlElement {
    constructor({
        id,
    }) {
        super(id);
    }

    addContent({
        content,
    }) {
        this.appendChild(document.createElement('div').appendChild(content.toElement()));
        content.afterRefreshElement({
            maintainRefreshStatus: true,
        });
    }

    toString() {
        return `<tr id="${this.id}" cellspacing="0" cellpadding="0" border="0"></tr>`;
    }
}
