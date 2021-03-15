// ==UserScript==
// @name            Pardus Flight Computer
// @version         0.4
// @description     Flight Computer to assist pathfinding in Pardus
// @author          Tro (Artemis)
// @include         http*://*.pardus.at/main.php
// @include         http*://*.pardus.at/options.php
// @grant           GM_setValue
// @grant           GM_getValue
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Options-Library/v2.4/pardus_options_library.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.4.1/data/colours.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.4.1/data/sectors.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.4.1/pages/options.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.4.1/pages/main.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.4.1/utility/helpers.js
// @downloadURL     https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.4.1/pardus_flight_computer.user.js
// @updateURL       https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.4.1/pardus_flight_computer.meta.js
// ==/UserScript==

switch (document.location.pathname) {
    case '/options.php':
        new OptionsPage();
        break;
    case '/main.php':
        new MainPage();
        break;
}
