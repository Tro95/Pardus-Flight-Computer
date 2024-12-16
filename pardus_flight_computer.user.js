// ==UserScript==
// @name            Pardus Flight Computer
// @version         1.0.0
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
// @require         https://raw.githubusercontent.com/Tro95/Pardus-Flight-Computer/refs/heads/new/dist/pardus_flight_computer.js
// @downloadURL     https://github.com/Tro95/Pardus-Flight-Computer/raw/refs/heads/new/pardus_flight_computer.user.js
// @updateURL       https://github.com/Tro95/Pardus-Flight-Computer/raw/refs/heads/new/pardus_flight_computer.meta.js
// ==/UserScript==

/* global PardusFlightComputer */

new PardusFlightComputer();
