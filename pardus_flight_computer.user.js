// ==UserScript==
// @name            Pardus Flight Computer
// @version         0.7.3
// @description     Flight Computer to assist pathfinding in Pardus
// @author          Tro (Artemis)
// @include         http*://*.pardus.at/main.php*
// @include         http*://*.pardus.at/ship2opponent_combat.php*
// @include         http*://*.pardus.at/options.php
// @grant           GM_setValue
// @grant           GM_getValue
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Options-Library/v2.5.2/pardus_options_library.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.7.3/data/colours.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.7.3/data/sectors.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.7.3/pages/options.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.7.3/pages/main.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.7.3/pages/ship2opponent_combat.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.7.3/utility/helpers.js
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
