// ==UserScript==
// @name            Pardus Flight Computer
// @version         0.9.0
// @description     Flight Computer to assist pathfinding in Pardus
// @author          Tro (Artemis)
// @icon            https://static.pardus.at/img/std/equipment/drive_interphased_enhanced.png
// @include         http*://*.pardus.at/main.php*
// @include         http*://*.pardus.at/ship2opponent_combat.php*
// @include         http*://*.pardus.at/options.php
// @grant           GM_setValue
// @grant           GM_getValue
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Options-Library/v2.6.0/dist/pardus-options-library.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.9.0/data/colours.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.9.0/data/sectors.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.9.0/pages/options.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.9.0/pages/main.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.9.0/pages/ship2opponent_combat.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.9.0/utility/helpers.js
// @downloadURL     https://github.com/Tro95/Pardus-Flight-Computer/raw/main/pardus_flight_computer.user.js
// @updateURL       https://github.com/Tro95/Pardus-Flight-Computer/raw/main/pardus_flight_computer.meta.js
// ==/UserScript==

/* global OptionsPage, MainPage, Ship2opponent_combatPage */

switch (document.location.pathname) {
    case '/options.php':
        new OptionsPage();
        break;
    case '/main.php':
        new MainPage();
        break;
    case '/ship2opponent_combat.php':
        new Ship2opponent_combatPage();
        break;
}
