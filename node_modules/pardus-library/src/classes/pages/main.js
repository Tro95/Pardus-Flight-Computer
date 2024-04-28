import AbstractPage from '../abstract/abstract-page.js';
import NavArea from '../main/nav.js';

export default class Main extends AbstractPage {
    #navArea;

    constructor() {
        super('/main.php');

        this.#navArea = new NavArea();

        this.#handlePartialRefresh(() => {
            this.#navArea.refresh();
        });
    }

    get nav() {
        return this.#navArea;
    }

    #handlePartialRefresh(func) {
        const mainElement = document.getElementById('tdSpaceChart');
        const navElement = mainElement ? document.getElementById('tdSpaceChart').getElementsByTagName('table')[0].rows[1] : document.querySelectorAll('table td[valign="top"]')[1];

        // This would be more specific, but it doesn't trigger enough refreshes
        //const navElement = document.getElementById('nav').parentNode;

        // Options for the observer (which mutations to observe)
        const config = {
            attributes: false,
            childList: true, 
            subtree: true
        };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            func();
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(navElement, config);
    }
}
