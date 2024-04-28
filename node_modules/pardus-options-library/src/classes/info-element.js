import HtmlElement from './html-element.js';
import PardusOptionsUtility from './pardus-options-utility.js';
import PardusOptions from './pardus-options.js';

/**
 * @class InfoElement
 * @extends HtmlElement
 */
export default class InfoElement extends HtmlElement {
    /**
     * @constructor InfoElement
     * @param {string} id HTML identifier for the element. Must be globally unique.
     * @param {string} description Text to display in the InfoElement box
     * @param {string} title Title to display at the top of the InfoElement box
     * @param {string} [tipBoxPosition=right] The direction the InfoElement should appear in. Either 'right' or 'left'
     */
    constructor({
        id,
        description,
        title,
        tipBoxPosition = 'right',
    }) {
        super(id);
        this.description = description;
        this.title = title;
        this.tipBoxPosition = tipBoxPosition;

        this.addEventListener('mouseover', () => {
            // eslint-disable-next-line import/no-cycle
            this.tipBox = PardusOptions.getDefaultTipBox();
            this.tipBox.setContents({
                title: this.title,
                contents: this.description,
            });

            this.tipBox.setPosition({
                element: this,
                position: this.tipBoxPosition,
            });

            this.tipBox.show();
        });

        this.addEventListener('mouseout', () => {
            this.tipBox.hide();
        });
    }

    /**
     * Return a string representation of the InfoElement
     * @function HtmlElement#toString
     * @returns {string} String representation of the InfoElement
     */
    toString() {
        return `<a id="${this.id}" href="#" onclick="return false;"><img src="${PardusOptionsUtility.getImagePackUrl()}info.gif" class="infoButton" alt=""></a>`;
    }
}
