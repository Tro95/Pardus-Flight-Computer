import { Main, Logout } from './pages/index.js';

export default class PardusLibrary {

    #currentPage;

    constructor() {
        switch (document.location.pathname) {
            case '/main.php':
                this.#currentPage = new Main();
                break;
            case '/logout.php':
                this.#currentPage = new Logout();
                break;
            default:
                this.#currentPage = 'No page implemented!';
        }
    }

    get page() {
        return document.location.pathname;
    }

    get currentPage() {
        return this.#currentPage;
    }

    get main() {
        if (this.page === '/main.php') {
            return this.#currentPage;
        }

        return null;
    }

    static getImagePackUrl() {
        const defaultImagePackUrl = '//static.pardus.at/img/std/';
        const imagePackUrl = String(document.querySelector('body').style.backgroundImage).replace(/url\("*|"*\)|[a-z0-9]+\.gif/g, '');

        return imagePackUrl !== '' ? imagePackUrl : defaultImagePackUrl;
    }

    /**
     *  Returns the active universe
     *  @returns {string} One of 'orion', 'artemis', or 'pegasus'
     *  @throws Will throw an error if no universe could be determined.
     */
    static getUniverse() {
        switch (document.location.hostname) {
            case 'orion.pardus.at':
                return 'orion';
            case 'artemis.pardus.at':
                return 'artemis';
            case 'pegasus.pardus.at':
                return 'pegasus';
            default:
                throw new Error('Unable to determine universe');
        }
    }
}