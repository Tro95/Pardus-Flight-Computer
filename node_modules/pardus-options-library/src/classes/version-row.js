import HtmlElement from './html-element.js';

export default class VersionRow extends HtmlElement {
    constructor({
        id,
    }) {
        super(id);
    }

    toString() {
        return `<tr id="${this.id}"><td align="right" style="font-size:11px;color:#696988;padding-right:7px;padding-top:5px">Version ${GM_info.script.version}</td></tr>`;
    }
}
