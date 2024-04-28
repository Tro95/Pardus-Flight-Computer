import { PardusOptionsUtility } from 'pardus-options-library';

export default class NavigationFavourite {
    constructor(favouriteNumber) {
        const prefix = 'navigation-favourite-';

        this.number = favouriteNumber;
        this.id = `${prefix}${favouriteNumber}`;

        const existingValue = PardusOptionsUtility.getVariableValue(this.id);

        if (existingValue) {
            this.name = existingValue.name;
            this.value = existingValue.value;
        }
    }

    save() {
        this.name = document.getElementById(`${this.id}-name`).value;
        this.value = {
            sector: document.getElementById('select-sector').value,
            x: document.getElementById('target-x').value,
            y: document.getElementById('target-y').value,
        };

        PardusOptionsUtility.setVariableValue(this.id, {
            name: this.name,
            value: this.value,
        });
    }

    load() {
        document.getElementById('select-sector').value = this.value.sector;
        document.getElementById('target-x').value = this.value.x;
        document.getElementById('target-y').value = this.value.y;
    }

    addEventListeners() {
        document.getElementById(`${this.id}-save`).addEventListener('click', () => {
            this.save();
            document.getElementById(`${this.id}-save`).setAttribute('disabled', 'true');
            document.getElementById(`${this.id}-save`).value = 'Saved';
            document.getElementById(`${this.id}-save`).setAttribute('style', 'color:green;background-color:silver');
            setTimeout(() => {
                document.getElementById(`${this.id}-save`).removeAttribute('disabled');
                document.getElementById(`${this.id}-save`).value = 'Save';
                document.getElementById(`${this.id}-save`).setAttribute('style', 'color:#D0D1D9;background-color:#00001C;');
            }, 2000);
        });

        document.getElementById(`${this.id}-load`).addEventListener('click', () => {
            this.load();
            document.getElementById(`${this.id}-load`).setAttribute('disabled', 'true');
            document.getElementById(`${this.id}-load`).value = 'Loaded';
            document.getElementById(`${this.id}-load`).setAttribute('style', 'color:green;background-color:silver');
            setTimeout(() => {
                document.getElementById(`${this.id}-load`).removeAttribute('disabled');
                document.getElementById(`${this.id}-load`).value = 'Load';
                document.getElementById(`${this.id}-load`).setAttribute('style', 'color:#D0D1D9;background-color:#00001C;');
            }, 2000);
        });
    }

    #saveButton() {
        return `<input value="Save" id="${this.id}-save" tabindex='-1' type="button" style="color:#D0D1D9;background-color:#00001C;"/>`;
    }

    #loadButton() {
        return `<input value="Load" id="${this.id}-load" tabindex='-1' type="button" style="color:#D0D1D9;background-color:#00001C;"/>`;
    }

    #input() {
        let valueOrPlaceholder = `placeholder='Favourite ${this.number}'`;

        if ('value' in this) {
            valueOrPlaceholder = `value='${this.name}'`;
        }

        return `<input id='${this.id}-name' type='text' tabindex='-1' ${valueOrPlaceholder} style='color:#D0D1D9; background-color:#00001C;width:120px;'></input>`;
    }

    toString() {
        return `<tr><td align='left'>${this.#input()}</td><td align='right'>${this.#loadButton()} ${this.#saveButton()}</td></tr>`;
    }
}
