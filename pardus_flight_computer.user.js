// ==UserScript==
// @name            Pardus Flight Computer
// @version         0.5.4
// @description     Flight Computer to assist pathfinding in Pardus
// @author          Tro (Artemis)
// @include         http*://*.pardus.at/main.php
// @include         http*://*.pardus.at/options.php
// @grant           GM_setValue
// @grant           GM_getValue
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Options-Library/v2.5.2/pardus_options_library.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.5.4/data/colours.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.5.4/data/sectors.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.5.4/pages/options.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.5.4/pages/main.js
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/v0.5.4/utility/helpers.js
// @downloadURL     https://github.com/Tro95/Pardus-Flight-Computer/raw/main/pardus_flight_computer.user.js
// @updateURL       https://github.com/Tro95/Pardus-Flight-Computer/raw/main/pardus_flight_computer.meta.js
// ==/UserScript==

switch (document.location.pathname) {
    case '/options.php':
        new OptionsPage();
        break;
    case '/main.php':
        new MainPage();
        break;
}
