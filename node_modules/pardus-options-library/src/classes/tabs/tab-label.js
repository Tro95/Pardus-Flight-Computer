import HtmlElement from '../html-element.js';
import PardusOptionsUtility from '../pardus-options-utility.js';

export default class TabLabel extends HtmlElement {
    constructor({
        id,
        heading,
        active = false,
        padding = '0px',
    }) {
        super(id);
        this.padding = padding;
        this.heading = heading;
        this.active = active;
        this.addEventListener('mouseover', () => {
            if (this.active) {
                this.getElement().style.cursor = 'default';
            } else {
                this.getElement().style.backgroundImage = `url(${PardusOptionsUtility.getImagePackUrl()}tabactive.png)`;
                this.getElement().style.cursor = 'default';
            }
        });
        this.addEventListener('mouseout', () => {
            if (!this.active) {
                this.getElement().style.backgroundImage = `url(${PardusOptionsUtility.getImagePackUrl()}tab.png)`;
                this.getElement().style.cursor = 'default';
            }
        });
    }

    toString() {
        const imageUrl = (this.active) ? 'tabactive' : 'tab';
        return `<td id="${this.id}" style="background: transparent url(&quot;${PardusOptionsUtility.getImagePackUrl()}${imageUrl}.png&quot;) no-repeat scroll 0% 0%; background-size: cover; cursor: default; padding-left: ${this.padding}; padding-right: ${this.padding}" class="tabcontent">${this.heading}</td>`;
    }

    setActive() {
        this.getElement().style.backgroundImage = `url('${PardusOptionsUtility.getImagePackUrl()}tabactive.png')`;
        this.active = true;
    }

    setInactive() {
        this.getElement().style.backgroundImage = `url('${PardusOptionsUtility.getImagePackUrl()}tab.png')`;
        this.active = false;
    }
}
