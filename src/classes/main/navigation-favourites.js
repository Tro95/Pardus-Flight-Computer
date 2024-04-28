import { PardusOptionsUtility } from 'pardus-options-library';
import NavigationFavourite from './navigation-favourite.js';

export default class NavigationFavourites {
    constructor() {
        this.id = 'pardus-flight-computer-navigation-calculator-favourites';
        this.numberOfFavourites = PardusOptionsUtility.getVariableValue('navigation_number_of_favourites', 4);
        this.favourites = [];
        this.setupFavourites();
    }

    setupFavourites() {
        for (let i = 1; i <= this.numberOfFavourites; i += 1) {
            this.favourites.push(new NavigationFavourite(i));
        }
    }

    addEventListeners() {
        for (const favourite of this.favourites) {
            favourite.addEventListeners();
        }
    }

    toString() {
        return this.getHtml();
    }

    getInnerHtml() {
        let html = '';

        for (const favourite of this.favourites) {
            html += favourite;
        }

        return html;
    }

    getHtml() {
        return `<table id='${this.id}' style='width: 100%;'><tbody>${this.getInnerHtml()}</tbody></table>`;
    }
}
