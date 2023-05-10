// ==UserScript==
// @name            Pardus Flight Computer
// @version         0.12.14
// @description     Flight Computer to assist pathfinding in Pardus
// @author          Tro (Artemis)
// @icon            https://static.pardus.at/img/std/equipment/drive_interphased_enhanced.png
// @match           http*://*.pardus.at/main.php*
// @match           http*://*.pardus.at/msgframe.php*
// @match           http*://*.pardus.at/squad_main.php*
// @match           http*://*.pardus.at/ship2opponent_combat.php*
// @match           http*://*.pardus.at/options.php
// @grant           GM_setValue
// @grant           GM_getValue
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Options-Library/v2.6.8/dist/pardus-options-library.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.12.14/data/colours.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.12.14/data/sectors.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.12.14/pages/options.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.12.14/pages/main.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.12.14/pages/msgframe.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.12.14/pages/ship2opponent_combat.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.12.14/utility/helpers.js
// @downloadURL     https://github.com/Tro95/Pardus-Flight-Computer/raw/autopilot/pardus_flight_computer.user.js
// @updateURL       https://github.com/Tro95/Pardus-Flight-Computer/raw/autopilot/pardus_flight_computer.meta.js
// ==/UserScript==

/* global OptionsPage, MainPage, MsgFramePage, Ship2opponent_combatPage */

switch (document.location.pathname) {
    case '/options.php':
        new OptionsPage();
        break;
    case '/main.php':
        new MainPage();
        break;
    case '/msgframe.php':
        new MsgFramePage();
        break;
    case '/squad_main.php':
        new MainPage({squad: true});
        break;
    case '/ship2opponent_combat.php':
        new Ship2opponent_combatPage();
        break;
}
