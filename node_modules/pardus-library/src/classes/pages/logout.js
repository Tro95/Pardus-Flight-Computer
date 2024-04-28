import AbstractPage from '../abstract/abstract-page.js';

export default class Logout extends AbstractPage {
    constructor() {
        super('/logout.php');
    }
}
