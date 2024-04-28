import AbstractOption from './abstract-option.js';
import SetKeyButton from './key-down-set-key-button.js';
import DisableButton from './key-down-disable-button.js';
import PardusOptionsUtility from '../pardus-options-utility.js';

export default class KeyDownOption extends AbstractOption {
    constructor({
        id,
        variable,
        description = '',
        defaultValue = false,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        shallow = false,
        reverse = false,
        info = null,
    }) {
        const currValue = getFunction(`${PardusOptionsUtility.getVariableName(variable)}`, defaultValue);
        const currDisabled = Object.hasOwn(currValue, 'disabled') && currValue.disabled;
        super({
            id,
            variable,
            description,
            defaultValue,
            saveFunction,
            getFunction,
            shallow,
            reverse,
            info,
            disabled: currDisabled,
            styleExtra: 'width: 20px;padding: 2px;text-align: center;margin: 2px 7px 2px;',
        });
        this.setKeyButton = new SetKeyButton({
            id: `${this.id}-setkey`,
            disabled: currDisabled,
        });
        this.disableButton = new DisableButton({
            id: `${this.id}-disable`,
            toggled: currDisabled,
        });
        this.boundCaptureKeyListener = this.captureKeyListener.bind(this);
        this.setKeyButton.addClickListener(() => {
            document.getElementById(`${this.inputId}-key`).value = '_';
            document.getElementById(`${this.inputId}-key`).style.color = 'lime';
            document.addEventListener('keydown', this.boundCaptureKeyListener, {
                once: true,
                ephemeral: true,
            });
            this.setKeyButton.toggle();
            this.disableButton.disable();
        });
        this.setKeyButton.addToggleClickListener(() => {
            document.removeEventListener('keydown', this.boundCaptureKeyListener);
            this.setKeyButton.toggle();
            this.disableButton.enable();
            this.refreshElement();
        });
        this.disableButton.addClickListener(() => {
            this.disable();
            this.disableButton.toggle();
        });
        this.disableButton.addToggleClickListener(() => {
            this.enable();
            this.disableButton.toggle();
        });
        this.addAfterRefreshHook(() => {
            this.setKeyButton.afterRefreshElement();
            this.disableButton.afterRefreshElement();
        });
    }

    captureKeyListener(event) {
        this.getInputElement().value = JSON.stringify({
            code: event.keyCode,
            key: event.code,
            description: event.key,
        });
        document.getElementById(`${this.inputId}-key`).value = this.getCurrentKeyDescription();
        document.getElementById(`${this.inputId}-key`).style.color = '#D0D1D9';
        this.disableButton.enable();
        this.setKeyButton.toggle();
    }

    getInnerHTML() {
        let keyPressHtml = `<input id='${this.inputId}' type='text' hidden value='${JSON.stringify(this.getValue())}'>`;
        keyPressHtml += `<table width='100%' style='border-collapse: collapse;'><tbody><tr><td align="left"><input id='${this.inputId}-key' type='text' cols='1' maxlength='1' readonly value="${this.getKeyDescription()}" style="${this.style}" ${this.disabled ? 'disabled' : ''}/></td><td align="right">${this.setKeyButton}</td><td align="right" style='padding-right: 0px;'>${this.disableButton}</td></tr></tbody></table>`;
        return keyPressHtml;
    }

    /**
     * Disables the input element
     * @function AbstractOption#disable
     */
    disable() {
        this.setDisabled(true);
        document.getElementById(`${this.inputId}-key`).removeAttribute('disabled');
        document.getElementById(`${this.inputId}-key`).setAttribute('style', this.style);

        this.getInputElement().value = JSON.stringify({
            ...this.getCurrentValue(),
            disabled: true,
        });
    }

    /**
     * Enables the input element
     * @function AbstractOption#enable
     */
    enable() {
        this.setDisabled(false);
        document.getElementById(`${this.inputId}-key`).removeAttribute('disabled');
        document.getElementById(`${this.inputId}-key`).setAttribute('style', this.style);

        const newValue = this.getCurrentValue();
        delete newValue.disabled;
        this.getInputElement().value = JSON.stringify(newValue);
    }

    setDisabled(disabled = false) {
        this.disabled = disabled;
        if (this.disabled) {
            this.colour = '#B5B5B5';
            this.backgroundColour = '#CCCCCC';
            this.setKeyButton.disable();
        } else {
            this.colour = '#D0D1D9';
            this.backgroundColour = '#00001C';
            this.setKeyButton.enable();
        }
        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;
    }

    saveValue(overrideSaveFunction = null) {
        if (overrideSaveFunction && typeof overrideSaveFunction === 'function') {
            overrideSaveFunction(`${PardusOptionsUtility.getVariableName(this.variable)}`, this.getCurrentValue());
        } else {
            this.saveFunction(`${PardusOptionsUtility.getVariableName(this.variable)}`, this.getCurrentValue());
        }
    }

    getKey() {
        return this.getValue().key;
    }

    getKeyDescription() {
        return this.getValue().description;
    }

    getKeyCode() {
        return this.getValue().code;
    }

    isDisabled() {
        const value = this.getValue();

        if (Object.hasOwn(value, 'disabled') && value.disabled) {
            return true;
        }

        return false;
    }

    getCurrentKey() {
        return this.getCurrentValue().key;
    }

    getCurrentKeyDescription() {
        return this.getCurrentValue().description;
    }

    getCurrentCode() {
        return this.getCurrentValue().code;
    }

    getCurrentValue() {
        return JSON.parse(this.getInputElement().value);
    }
}
