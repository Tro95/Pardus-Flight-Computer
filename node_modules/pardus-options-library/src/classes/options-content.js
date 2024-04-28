import HtmlElement from './html-element.js';
import PardusOptionsUtility from './pardus-options-utility.js';
import OptionsBox from './options-box.js';

export default class OptionsContent extends HtmlElement {
    constructor({
        id,
        content = null,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        refresh = true,
        active = true,
    }) {
        super(id);
        this.content = content;
        this.saveFunction = saveFunction;
        this.getFunction = getFunction;
        this.leftBoxes = [];
        this.rightBoxes = [];
        this.topBoxes = [];
        this.bottomBoxes = [];
        this.refresh = refresh;
        this.active = active;
        this.addAfterRefreshHook((opts) => {
            if (opts.maintainRefreshStatus) {
                return;
            }
            this.refresh = true;
        });
        this.addAfterRefreshHook(() => {
            for (const box of this.topBoxes) {
                box.afterRefreshElement();
            }
            for (const box of this.leftBoxes) {
                box.afterRefreshElement();
            }
            for (const box of this.rightBoxes) {
                box.afterRefreshElement();
            }
            for (const box of this.bottomBoxes) {
                box.afterRefreshElement();
            }
        });
    }

    addBox({
        top = false,
        bottom = false,
        ...args
    }) {
        let newBox = null;
        if (top) {
            newBox = this.addBoxTop(args);
        } else if (bottom) {
            newBox = this.addBoxBottom(args);
        } else if (this.leftBoxes.length <= this.rightBoxes.length) {
            newBox = this.addBoxLeft(args);
        } else {
            newBox = this.addBoxRight(args);
        }
        return newBox;
    }

    addBoxBottom({
        refresh = this.refresh,
        ...args
    }) {
        const newBox = new OptionsBox({
            id: `${this.id}-bottom-box-${this.bottomBoxes.length}`,
            refresh,
            ...args,
        });

        this.bottomBoxes.push(newBox);

        if (refresh) {
            this.refreshElement();
        }

        return newBox;
    }

    addBoxTop({
        refresh = this.refresh,
        ...args
    }) {
        const newBox = new OptionsBox({
            id: `${this.id}-top-box-${this.topBoxes.length}`,
            refresh,
            ...args,
        });

        this.topBoxes.push(newBox);

        if (refresh) {
            this.refreshElement();
        }

        return newBox;
    }

    addBoxLeft({
        refresh = this.refresh,
        ...args
    }) {
        const newBox = new OptionsBox({
            id: `${this.id}-left-box-${this.leftBoxes.length}`,
            refresh,
            ...args,
        });

        this.leftBoxes.push(newBox);

        if (refresh) {
            this.refreshElement();
        }

        return newBox;
    }

    addBoxRight({
        refresh = this.refresh,
        ...args
    }) {
        const newBox = new OptionsBox({
            id: `${this.id}-right-box-${this.rightBoxes.length}`,
            refresh,
            ...args,
        });

        this.rightBoxes.push(newBox);

        if (refresh) {
            this.refreshElement();
        }

        return newBox;
    }

    addPremiumBox(args) {
        return this.addBox({
            premium: true,
            ...args,
        });
    }

    addPremiumBoxLeft(args) {
        return this.addBoxLeft({
            premium: true,
            ...args,
        });
    }

    addPremiumBoxRight(args) {
        return this.addBoxRight({
            premium: true,
            ...args,
        });
    }

    toString() {
        if (this.content !== null) {
            return this.content;
        }
        const hidden = this.active ? '' : 'hidden';
        return `<tr id="${this.id}" ${hidden}><td><table width="100%" align="center"><tbody><tr><td id="${this.id}-top" colspan="3" valign="top">${this.topBoxes.join('<br><br>')}${(this.topBoxes.length > 0) ? '<br><br>' : ''}</td></tr><tr><td id="${this.id}-left" width="350" valign="top">${this.leftBoxes.join('<br><br>')}</td><td width="40"></td><td id="${this.id}-right" width="350" valign="top">${this.rightBoxes.join('<br><br>')}</td></tr><tr><td id="${this.id}-bottom" colspan="3" valign="top">${(this.bottomBoxes.length > 0) ? '<br><br>' : ''}${this.bottomBoxes.join('<br><br>')}</td></tr></tbody></table></td></tr>`;
    }

    setActive() {
        this.active = true;
        this.getElement().removeAttribute('hidden');
    }

    setInactive() {
        this.active = false;
        this.getElement().setAttribute('hidden', '');
    }
}
