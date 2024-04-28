import { PardusLibrary } from 'pardus-library';
import {
    Main,
    Msgframe,
    Options,
    Ship2OpponentCombat,
} from './pages/index.js';

export default class PardusFlightComputer {
    constructor() {
        const pardus = new PardusLibrary();

        switch (document.location.pathname) {
            case '/main.php':
                new Main(pardus.currentPage);
                break;
            case '/options.php':
                new Options();
                break;
            case '/msgframe.php':
                new Msgframe();
                break;
            case '/ship2opponent_combat.php':
                new Ship2OpponentCombat();
                break;
            default:
                console.log(`Page '${document.location.pathname}' not implemented!`);
        }
    }
}
