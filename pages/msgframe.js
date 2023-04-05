/* global PardusOptionsUtility */

class MsgFramePage {
    constructor() {
        this.centreTd = document.querySelector('td[align="center"]');

        if (window.parent) {
            window.parent.window.addEventListener('pardus-message', (event) => {
                console.log('Received pardus message!');
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
        let icon = 'gnome-info';
        let colour = '#CCCCCC';

        switch (type) {
            case 'error':
                icon = 'gnome-error';
                colour = '#FF3300';
                break;
        }

        this._setMessage(msg, icon, colour);
    }

    _setMessage(msg, icon, colour) {
        const str = `<table style="background-image:url(${PardusOptionsUtility.getImagePackUrl()}bgmedium.gif);border-style:ridge;border-color:#2b2b51;border-width:2px;" cellspacing="0" cellpadding="0" align="center"><tbody><tr><td><img src="${PardusOptionsUtility.getImagePackUrl()}${icon}.png" alt="" width="32" height="32"></td><td style="padding-left:2px;padding-right:4px;"><font style="font-weight:bold;font-size:13px;" color="${colour}"> ${msg}</font></td></tr></tbody></table>`;
        this.centreTd.innerHTML = str;
    }

    addErrorMessage(msg) {

    }

    static sendMessage(msg, type) {
        if (window.parent) {
            return window.parent.window.dispatchEvent(new CustomEvent('pardus-message', {detail: {msg, type}}));
        }

        return window.dispatchEvent(new CustomEvent('pardus-message', {detail: {msg, type}}));
    }
}