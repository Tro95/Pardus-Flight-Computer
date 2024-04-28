import HtmlElement from './html-element.js';
import PardusOptionsUtility from './pardus-options-utility.js';

export default class TipBox extends HtmlElement {
    constructor({
        id,
    }) {
        super(id);
        this.contents = '';
        this.title = '';
        this.addEventListener('click', () => {
            this.hide();
        });
    }

    setContents({
        contents = '',
        title = '',
    }) {
        this.contents = contents;
        this.title = title;
        this.refreshElement();
    }

    setPosition({
        element,
        position = 'right',
    }) {
        let xOffset = 15;
        let yOffset = -13;

        switch (position) {
            case 'left': {
                xOffset += -220;
                break;
            }

            case 'er': {
                xOffset += 128;
                break;
            }

            case 'lf': {
                xOffset += -160;
                yOffset += -310;
                break;
            }

            default: {
                break;
            }
        }

        this.getElement().style.top = `${element.getOffsetTop() + yOffset}px`;
        this.getElement().style.left = `${element.getOffsetLeft() + xOffset}px`;
    }

    show() {
        this.getElement().removeAttribute('hidden');
    }

    hide() {
        this.getElement().setAttribute('hidden', '');
    }

    toString() {
        return `<div id="${this.id}" hidden="" style="position: absolute; width: 200px; z-index: 100; border: 1pt black solid; background: #000000; padding: 0px;"><table class="messagestyle" style="background:url(${PardusOptionsUtility.getImagePackUrl()}bgd.gif)" width="100%" cellspacing="0" cellpadding="3"><tbody><tr><td style="text-align:left;background:#000000;"><b>${this.title}</b></td></tr><tr><td style="text-align:left;">${this.contents}</td></tr><tr><td height="5"><spacer type="block" width="1" height="1"></spacer></td></tr><tr><td style="text-align:right;background:#31313A;"><b>GNN Library</b><img src="${PardusOptionsUtility.getImagePackUrl()}info.gif" width="10" height="12" border="0"></td></tr></tbody></table></div>`;
    }
}
