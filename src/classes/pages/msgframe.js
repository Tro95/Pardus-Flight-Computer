import { PardusOptionsUtility } from 'pardus-options-library';

export default class Msgframe {
    constructor() {
        this.centreTd = document.querySelector('td[align="center"]');

        if (window.parent) {
            window.parent.window.addEventListener('pardus-message', (event) => {
                this.addMessage(event.detail.msg, event.detail.type);
            });
        }
    }

    hasMessage() {
        if (this.centreTd.querySelector('table')) {
            return true;
        }

        return false;
    }

    addMessage(msg, type) {
        let icon; let
            colour;

        switch (type) {
            case 'error':
                icon = 'gnome-error';
                colour = '#FF3300';
                break;
            default:
                icon = 'gnome-info';
                colour = '#CCCCCC';
        }

        this.#setMessage(msg, icon, colour);
    }

    #setMessage(msg, icon, colour) {
        const str = `<table style="background-image:url(${PardusOptionsUtility.getImagePackUrl()}bgmedium.gif);border-style:ridge;border-color:#2b2b51;border-width:2px;" cellspacing="0" cellpadding="0" align="center"><tbody><tr><td><img src="${PardusOptionsUtility.getImagePackUrl()}${icon}.png" alt="" width="32" height="32"></td><td style="padding-left:2px;padding-right:4px;"><font style="font-weight:bold;font-size:13px;" color="${colour}"> ${msg}</font></td></tr></tbody></table>`;
        this.centreTd.innerHTML = str;
    }

    addErrorMessage(msg) {
        this.addMessage(msg, 'error');
    }

    static sendMessage(msg, type) {
        if (window.parent) {
            return window.parent.window.dispatchEvent(new CustomEvent('pardus-message', {
                detail: {
                    msg, type,
                },
            }));
        }

        return window.dispatchEvent(new CustomEvent('pardus-message', { detail: { msg, type } }));
    }
}
