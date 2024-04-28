import Nav from '../main/nav.js';

export default class Main {
    constructor(main) {
        this.squad = main.squad;
        this.optionsPrefix = this.squad ? 'squads_' : '';
        this.nav = new Nav(main.nav, this.optionsPrefix, this.squad);
    }
}
