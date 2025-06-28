(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["PardusFlightComputer"] = factory();
	else
		root["PardusFlightComputer"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ PardusFlightComputer)
});

;// CONCATENATED MODULE: ./node_modules/pardus-library/src/classes/abstract/abstract-page.js
class AbstractPage {
    #page;

    constructor(pageName = '') {
        if (pageName === '') {
            throw "Page is not defined for class";
        }

        this.#page = pageName;
    }

    toString() {
        return this.#page;
    }

    navigateTo() {
        document.location.assign(`${document.location.origin}${this.#page}`);
    }

    isActive() {
        return document.location.pathname === this.#page;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-library/src/classes/main/tile.js
class Tile {
    #x;
    #y;
    #tile_id;
    #virtual_tile;
    #highlights = new Set();
    #listenerNonce = new Set();

    static colours = new Map([
        ['Green', {
            'red': 0,
            'green': 128,
            'blue': 0,
            'short_code': 'g'
        }],
        ['Blue', {
            'red': 0,
            'green': 0,
            'blue': 128,
            'short_code': 'b',
        }],
        ['Red', {
            'red': 128,
            'green': 0,
            'blue': 0,
            'short_code': 'r'
        }],
        ['Yellow', {
            'red': 128,
            'green': 128,
            'blue': 0,
            'short_code': 'y'
        }],
        ['Cyan', {
            'red': 0,
            'green': 128,
            'blue': 128,
            'short_code': 'c'
        }],
        ['Magenta', {
            'red': 128,
            'green': 0,
            'blue': 128,
            'short_code': 'm'
        }],
        ['Silver', {
            'red': 128,
            'green': 128,
            'blue': 128,
            'short_code': 's'
        }],
    ]);

    constructor(element, x, y, tile_id = null, virtual_tile = false) {
        this.#x = x;
        this.#y = y;
        this.emphasised = false;
        this.path_highlighted = false;
        this.#virtual_tile = virtual_tile;
        this.type = 'regular';
        this.objectType = '';

        if (this.isVirtualTile()) {
            this.#tile_id = tile_id.toString();
        } else {
            this.element = element;
            this.background_image = this.element.style.backgroundImage;
            const unhighlight_regex = /^\s*linear-gradient.*?, (url\(.*)$/;

            if (unhighlight_regex.test(this.background_image)) {
                this.background_image = this.background_image.match(unhighlight_regex)[1];
            }

            if (this.element.classList.contains('navNpc')) {
                this.objectType = 'npc';
            }

            if (this.element.classList.contains('navBuilding')) {
                this.objectType = 'building';
            }

            if (this.element.classList.contains('navWormhole')) {
                this.type = 'wormhole';
            }

            if (this.element.classList.contains('navYhole')) {
                this.type = 'y-hole';
            }

            if (this.element.classList.contains('navXhole')) {
                this.type = 'x-hole';
            }

            // Get the tile id
            if (this.element.classList.contains('navShip') && this.element.querySelector('#thisShip')) {
                this.#tile_id = this.getUserloc();
            } else if (this.element.children.length > 0 && this.element.querySelector('A')) {

                // In order to support blue stims, we have to use querySelector to handle the extra <div>
                const child_element = this.element.querySelector('A');

                // Can we navigate to the tile?
                if ((!child_element.hasAttribute('onclick') || child_element.getAttribute('onclick').startsWith('warp')) && (!child_element.hasAttribute('_onclick') || child_element.getAttribute('_onclick').startsWith('warp'))) {
                    this.#tile_id = this.getUserloc();
                } else if (child_element.hasAttribute('onclick') && child_element.getAttribute('onclick').startsWith('nav')) {
                    this.#tile_id = child_element.getAttribute('onclick').match(/^[^\d]*(\d*)[^\d]*$/)[1];
                } else if (child_element.hasAttribute('_onclick') && child_element.getAttribute('_onclick').startsWith('nav')) {
                    // Freeze Frame compatibility
                    this.#tile_id = child_element.getAttribute('_onclick').match(/^[^\d]*(\d*)[^\d]*$/)[1];
                } else if (child_element.hasAttribute('_onclick') && child_element.getAttribute('_onclick') === "null") {
                    this.#tile_id = this.getUserloc();
                }
            } else if (this.element.classList.contains('navShip')) {
                // This only happens on retreating
                this.#tile_id = this.getUserloc();
            }
        }
    }

    isWormhole() {
        return this.type === 'wormhole';
    }

    isXHole() {
        return this.type === 'x-hole';
    }

    isYHole() {
        return this.type === 'y-hole';
    }

    hasNpc() {
        return this.objectType === 'npc';
    }

    set id(id) {
        this.#tile_id = id.toString();
    }

    get id() {
        return this.#tile_id;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    getUserloc() {
        if (typeof userloc !== 'undefined') {
            return userloc.toString();
        } else {
            return '-1';
        }
    }

    toString() {
        return `Tile ${this.#tile_id} [${this.x}, ${this.y}]`;
    }

    valueOf() {
        return Number(this.#tile_id);
    }

    isVirtualTile() {
        return this.#virtual_tile;
    }

    isClickable() {
        if (!this.isVirtualTile() && this.#tile_id && parseInt(this.#tile_id) > 0) {
            return true;
        }

        return false;
    }

    isNavigatable() {
        if (!this.isVirtualTile() && this.element && this.element.children.length > 0 && this.element.querySelector('A')?.getAttribute('onclick') && this.element.querySelector('A')?.getAttribute('onclick').startsWith('nav') && this.isClickable()) {
            return true;
        }

        if (!this.isVirtualTile() && this.element && this.element.children.length > 0 && this.element.querySelector('A')?.getAttribute('_onclick') && this.element.querySelector('A')?.getAttribute('_onclick').startsWith('nav') && this.isClickable()) {
            return true;
        }

        return false;
    }

    isCentreTile() {
        return this.is_centre_tile;
    }

    isHighlighted() {
        if (this.#highlights.size > 0) {
            return true;
        }

        return false;
    }

    addEventListener(event, func, options = {}) {
        if (options.hasOwnProperty('nonce')) {
            if (this.#listenerNonce.has(options.nonce)) {
                return;
            }
        }

        if (this.isNavigatable()) {
            this.element.querySelector('A').addEventListener(event, func, options);

            if (options.hasOwnProperty('nonce')) {
                this.#listenerNonce.add(options.nonce);
            }
        }
    }

    addHighlight(highlight_colour) {
        this.#highlights.add(highlight_colour);
        this.#refreshHighlightStatus();
    }

    addHighlights(highlights = new Set()) {
        highlights.forEach((value) => {
            this.#highlights.add(value);
        });

        this.#refreshHighlightStatus();
    }

    removeHighlight(highlight_colour) {
        this.#highlights.delete(highlight_colour);
        this.#refreshHighlightStatus();
    }

    isEmphasised() {
        return this.emphasised;
    }

    emphasiseHighlight() {
        this.emphasised = true;
        this.#refreshHighlightStatus();
    }

    removeEmphasis() {
        this.emphasised = false;
        this.#refreshHighlightStatus();
    }

    clearHighlight() {
        this.#clearAllHighlighting();
    }

    #refreshHighlightStatus() {
        if (this.isVirtualTile()) {
            return false;
        }

        if (this.#highlights.size === 0) {
            return this.#clearAllHighlighting();
        }

        const highlighted_colour_string = this.#getHighlightedColourString();
        const emphasis = this.emphasised ? 0.8 : 0.5;

        // Does this tile have a background image?
        if (this.background_image) {
            this.element.style.backgroundImage = `linear-gradient(to bottom, rgba(${highlighted_colour_string},${emphasis}), rgba(${highlighted_colour_string},${emphasis})), ` + this.background_image;
        } else {
            this.element.style.backgroundColor = `rgba(${highlighted_colour_string},1)`;
            this.element.firstElementChild.style.opacity = 1 - emphasis;
        }
    }

    #clearAllHighlighting() {
        if (this.isVirtualTile()) {
            return false;
        }

        this.#highlights.clear();

        if (this.background_image) {
            this.element.style.backgroundImage = this.background_image;
        } else {
            this.element.style.backgroundColor = ''
            this.element.firstElementChild.style.opacity = 1;
        }

        return true;
    }

    * #yieldHighlightsRGB() {
        const highlights = [];

        for (const colour of this.constructor.colours.values()) {
            if (this.#highlights.has(colour.short_code)) {
                yield {
                    red: colour.red,
                    green: colour.green,
                    blue: colour.blue
                };
            }
        }
    }

    #getHighlightedColourString() {
        if (this.isVirtualTile()) {
            return false;
        }

        // This is probably the world's worst colour-mixing algorithm
        let total_red = 0;
        let total_green = 0;
        let total_blue = 0;

        let number_red = 0;
        let number_green = 0;
        let number_blue = 0;

        for (const colour of this.#yieldHighlightsRGB()) {
            total_red += colour.red;
            total_green += colour.green;
            total_blue += colour.blue;

            number_red += 1;
            number_green += 1;
            number_blue += 1;
        }

        if (number_red === 0) {
            number_red = 1;
        }

        if (number_green === 0) {
            number_green = 1;
        }

        if (number_blue === 0) {
            number_blue = 1;
        }

        return `${Math.floor(total_red / number_red)},${Math.floor(total_green / number_green)},${Math.floor(total_blue / number_blue)}`;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-library/src/classes/pardus/sector.js


class Sector {

    #id_start = 0;
    #columns = 0;
    #rows = 0;

    constructor(name, start, columns, rows) {
        this.name = name;
        this.#id_start = start;
        this.#columns = columns;
        this.#rows = rows;
    }

    contains(tile_id) {
        if (tile_id >= this.#id_start && tile_id < this.#id_start + (this.#columns * this.#rows)) {
            return true;
        }

        return false;
    }

    getTile(tile_id) {
        if (!this.contains(tile_id)) {
            return null;
        }

        return {
            'sector': this.name,
            'x': Math.floor((tile_id - this.#id_start) / this.#rows),
            'y': (tile_id - this.#id_start) % this.#rows,
            'tile_id': tile_id,
            'rows': this.#rows,
            'colums': this.#columns
        }
    }

    getVirtualTile(x, y, reference) {
        return new Tile(null, x, y, Number(reference.id) + (x - reference.x) + ((y - reference.y) * this.#columns), true);
    }

    getTileHumanString(tile_id) {
        const sectorObj = this.getTile(tile_id);

        return `${sectorObj.sector} [${sectorObj.x}, ${sectorObj.y}]`;
    }

    getTileByCoords(x, y) {
        if (Number(x) < 0 || Number(y) < 0 || Number(x) >= this.#columns || Number(y) >= this.#rows) {
            return -1;
        }

        return Number(this.#id_start) + Number(x) * Number(this.#rows) + Number(y);
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-library/src/data/sectors.js
const sectorMapDataObj = {
    "Aandti" : { "start": 78435, "cols": 22, "rows": 13 },
    "AB 5-848" : { "start": 375000, "cols": 18, "rows": 14 },
    "Abeho" : { "start": 325645, "cols": 25, "rows": 13 },
    "Achird" : { "start": 118538, "cols": 22, "rows": 22 },
    "Ackandso" : { "start": 24458, "cols": 26, "rows": 20 },
    "Ackarack" : { "start": 300000, "cols": 14, "rows": 20 },
    "Ackexa" : { "start": 32188, "cols": 20, "rows": 15 },
    "Ackwada" : { "start": 101525, "cols": 22, "rows": 15 },
    "Adaa" : { "start": 6409, "cols": 22, "rows": 26 },
    "Adara" : { "start": 95219, "cols": 15, "rows": 21 },
    "Aedce" : { "start": 306687, "cols": 17, "rows": 20 },
    "Aeg" : { "start": 24978, "cols": 21, "rows": 13 },
    "Alfirk" : { "start": 95534, "cols": 20, "rows": 15 },
    "Algol" : { "start": 375252, "cols": 19, "rows": 25 },
    "Alioth" : { "start": 32488, "cols": 16, "rows": 15 },
    "Alpha Centauri" : { "start": 1, "cols": 19, "rows": 12 },
    "AN 2-956" : { "start": 52083, "cols": 19, "rows": 20 },
    "An Dzeve" : { "start": 6981, "cols": 23, "rows": 18 },
    "Anaam" : { "start": 16466, "cols": 18, "rows": 20 },
    "Anayed" : { "start": 300280, "cols": 15, "rows": 16 },
    "Andexa" : { "start": 229, "cols": 20, "rows": 15 },
    "Andsoled" : { "start": 318960, "cols": 18, "rows": 25 },
    "Anphiex" : { "start": 78721, "cols": 18, "rows": 30 },
    "Arexack" : { "start": 325970, "cols": 17, "rows": 17 },
    "Atlas" : { "start": 79261, "cols": 21, "rows": 15 },
    "Aveed" : { "start": 101855, "cols": 17, "rows": 15 },
    "Aya" : { "start": 142998, "cols": 40, "rows": 35 },
    "Ayargre" : { "start": 16826, "cols": 18, "rows": 18 },
    "Ayinti" : { "start": 300520, "cols": 20, "rows": 20 },
    "Ayqugre" : { "start": 307027, "cols": 16, "rows": 14 },
    "Baar" : { "start": 79576, "cols": 16, "rows": 12 },
    "Baham" : { "start": 139288, "cols": 29, "rows": 36 },
    "BE 3-702" : { "start": 119022, "cols": 20, "rows": 20 },
    "Becanin" : { "start": 52463, "cols": 17, "rows": 14 },
    "Becanol" : { "start": 79768, "cols": 20, "rows": 25 },
    "Bedaho" : { "start": 32728, "cols": 20, "rows": 18 },
    "Beeday" : { "start": 300920, "cols": 16, "rows": 15 },
    "Beethti" : { "start": 17150, "cols": 16, "rows": 20 },
    "Begreze" : { "start": 17470, "cols": 17, "rows": 14 },
    "Belati" : { "start": 301160, "cols": 25, "rows": 16 },
    "Bellatrix" : { "start": 119422, "cols": 25, "rows": 18 },
    "Besoex" : { "start": 25251, "cols": 13, "rows": 16 },
    "Beta Hydri" : { "start": 102110, "cols": 24, "rows": 20 },
    "Beta Proxima" : { "start": 529, "cols": 19, "rows": 19 },
    "Betelgeuse" : { "start": 33088, "cols": 32, "rows": 22 },
    "Betiess" : { "start": 40935, "cols": 13, "rows": 16 },
    "Beurso" : { "start": 319410, "cols": 19, "rows": 25 },
    "Bewaack" : { "start": 375727, "cols": 14, "rows": 25 },
    "BL 3961" : { "start": 890, "cols": 20, "rows": 10 },
    "BL 6-511" : { "start": 80268, "cols": 24, "rows": 31 },
    "BQ 3-927" : { "start": 41143, "cols": 15, "rows": 15 },
    "BU 5-773" : { "start": 326259, "cols": 25, "rows": 8 },
    "Cabard" : { "start": 52701, "cols": 9, "rows": 22 },
    "Canaab" : { "start": 7539, "cols": 18, "rows": 13 },
    "Canexin" : { "start": 17708, "cols": 25, "rows": 25 },
    "Canolin" : { "start": 324186, "cols": 16, "rows": 15 },
    "Canopus" : { "start": 41368, "cols": 13, "rows": 22 },
    "Capella" : { "start": 33792, "cols": 19, "rows": 17 },
    "Cassand" : { "start": 25459, "cols": 13, "rows": 19 },
    "CC 3-771" : { "start": 301560, "cols": 20, "rows": 10 },
    "Ceanze" : { "start": 307251, "cols": 15, "rows": 17 },
    "Cebalrai" : { "start": 119872, "cols": 21, "rows": 24 },
    "Cebece" : { "start": 140332, "cols": 27, "rows": 18 },
    "Cegreeth" : { "start": 376077, "cols": 18, "rows": 22 },
    "Ceina" : { "start": 319885, "cols": 16, "rows": 15 },
    "Cemiess" : { "start": 52899, "cols": 18, "rows": 15 },
    "Cesoho" : { "start": 1090, "cols": 12, "rows": 7 },
    "Cor Caroli" : { "start": 140818, "cols": 40, "rows": 42 },
    "CP 2-197" : { "start": 102590, "cols": 16, "rows": 13 },
    "Daaya" : { "start": 41654, "cols": 26, "rows": 25 },
    "Daaze" : { "start": 320125, "cols": 17, "rows": 15 },
    "Daceess" : { "start": 1174, "cols": 15, "rows": 8 },
    "Dadaex" : { "start": 326459, "cols": 18, "rows": 21 },
    "Dainfa" : { "start": 102798, "cols": 18, "rows": 18 },
    "Datiack" : { "start": 18333, "cols": 19, "rows": 15 },
    "Daured" : { "start": 103122, "cols": 18, "rows": 17 },
    "Daurlia" : { "start": 25706, "cols": 14, "rows": 15 },
    "Delta Pavonis" : { "start": 25916, "cols": 14, "rows": 27 },
    "DH 3-625" : { "start": 110554, "cols": 16, "rows": 13 },
    "DI 9-486" : { "start": 103428, "cols": 25, "rows": 16 },
    "Diphda" : { "start": 95834, "cols": 20, "rows": 20 },
    "DP 2-354" : { "start": 301760, "cols": 16, "rows": 14 },
    "Dsiban" : { "start": 120376, "cols": 17, "rows": 17 },
    "Dubhe" : { "start": 142498, "cols": 20, "rows": 25 },
    "Edbeeth" : { "start": 18618, "cols": 18, "rows": 15 },
    "Edeneth" : { "start": 8273, "cols": 12, "rows": 7 },
    "Edenve" : { "start": 81012, "cols": 25, "rows": 25 },
    "Edethex" : { "start": 103828, "cols": 25, "rows": 25 },
    "Edmial" : { "start": 376473, "cols": 17, "rows": 16 },
    "Edmize" : { "start": 18888, "cols": 16, "rows": 16 },
    "Edqueth" : { "start": 320380, "cols": 17, "rows": 10 },
    "Edvea" : { "start": 301984, "cols": 32, "rows": 24 },
    "EH 5-382" : { "start": 96234, "cols": 14, "rows": 15 },
    "Electra" : { "start": 42304, "cols": 23, "rows": 16 },
    "Elnath" : { "start": 376745, "cols": 18, "rows": 25 },
    "Enaness" : { "start": 42672, "cols": 21, "rows": 12 },
    "Encea" : { "start": 53169, "cols": 14, "rows": 15 },
    "Enif" : { "start": 138413, "cols": 35, "rows": 25 },
    "Enioar" : { "start": 307506, "cols": 21, "rows": 13 },
    "Enwaand" : { "start": 320550, "cols": 20, "rows": 22 },
    "Epsilon Eridani" : { "start": 1294, "cols": 18, "rows": 32 },
    "Epsilon Indi" : { "start": 34115, "cols": 20, "rows": 13 },
    "Ericon" : { "start": 1870, "cols": 15, "rows": 26 },
    "Essaa" : { "start": 34375, "cols": 11, "rows": 22 },
    "Eta Cassiopeia" : { "start": 26294, "cols": 15, "rows": 35 },
    "Etamin" : { "start": 144398, "cols": 31, "rows": 24 },
    "Exackcan" : { "start": 26819, "cols": 15, "rows": 13 },
    "Exbeur" : { "start": 53379, "cols": 25, "rows": 25 },
    "Exinfa" : { "start": 8357, "cols": 10, "rows": 20 },
    "Exiool" : { "start": 104453, "cols": 22, "rows": 19 },
    "Faarfa" : { "start": 81637, "cols": 14, "rows": 12 },
    "Facece" : { "start": 54004, "cols": 16, "rows": 23 },
    "Fadaphi" : { "start": 377195, "cols": 25, "rows": 25 },
    "Faedho" : { "start": 307779, "cols": 14, "rows": 25 },
    "Faexze" : { "start": 2260, "cols": 23, "rows": 16 },
    "Famiay" : { "start": 34617, "cols": 15, "rows": 13 },
    "Famida" : { "start": 326837, "cols": 25, "rows": 19 },
    "Famiso" : { "start": 42924, "cols": 22, "rows": 15 },
    "Faphida" : { "start": 19144, "cols": 22, "rows": 14 },
    "Fawaol" : { "start": 302752, "cols": 20, "rows": 25 },
    "Fomalhaut" : { "start": 27014, "cols": 20, "rows": 20 },
    "Fornacis" : { "start": 145142, "cols": 25, "rows": 30 },
    "FR 3-328" : { "start": 320990, "cols": 12, "rows": 20 },
    "Furud" : { "start": 120665, "cols": 15, "rows": 20 },
    "Gienah Cygni" : { "start": 120965, "cols": 15, "rows": 26 },
    "Gilo" : { "start": 81805, "cols": 18, "rows": 21 },
    "GM 4-572" : { "start": 54372, "cols": 15, "rows": 13 },
    "Gomeisa" : { "start": 145892, "cols": 30, "rows": 23 },
    "Greandin" : { "start": 27414, "cols": 14, "rows": 23 },
    "Grecein" : { "start": 8557, "cols": 13, "rows": 16 },
    "Greenso" : { "start": 377820, "cols": 20, "rows": 16 },
    "Grefaho" : { "start": 19452, "cols": 21, "rows": 20 },
    "Greliai" : { "start": 303252, "cols": 16, "rows": 20 },
    "Gresoin" : { "start": 327312, "cols": 25, "rows": 21 },
    "Gretiay" : { "start": 104871, "cols": 20, "rows": 20 },
    "GT 3-328" : { "start": 327837, "cols": 14, "rows": 16 },
    "GV 4-652" : { "start": 34812, "cols": 12, "rows": 12 },
    "HC 4-962" : { "start": 34956, "cols": 12, "rows": 13 },
    "Heze" : { "start": 146605, "cols": 35, "rows": 40 },
    "HO 2-296" : { "start": 48098, "cols": 15, "rows": 11 },
    "Hoanda" : { "start": 2628, "cols": 16, "rows": 18 },
    "Hobeex" : { "start": 308129, "cols": 19, "rows": 14 },
    "Hocancan" : { "start": 43254, "cols": 17, "rows": 19 },
    "Homam" : { "start": 121355, "cols": 17, "rows": 22 },
    "Hooth" : { "start": 82183, "cols": 25, "rows": 13 },
    "Hource" : { "start": 303572, "cols": 19, "rows": 16 },
    "HW 3-863" : { "start": 96444, "cols": 16, "rows": 20 },
    "Iceo" : { "start": 8765, "cols": 20, "rows": 14 },
    "Inena" : { "start": 35112, "cols": 14, "rows": 21 },
    "Inioen" : { "start": 308395, "cols": 13, "rows": 14 },
    "Iniolol" : { "start": 27736, "cols": 17, "rows": 14 },
    "Inliaa" : { "start": 9045, "cols": 12, "rows": 10 },
    "Iohofa" : { "start": 328061, "cols": 24, "rows": 16 },
    "Ioliaa" : { "start": 105271, "cols": 18, "rows": 16 },
    "Ioquex" : { "start": 82508, "cols": 16, "rows": 15 },
    "Iowagre" : { "start": 303876, "cols": 18, "rows": 12 },
    "Iozeio" : { "start": 48263, "cols": 19, "rows": 13 },
    "IP 3-251" : { "start": 7395, "cols": 16, "rows": 9 },
    "Izar" : { "start": 121729, "cols": 16, "rows": 18 },
    "JG 2-013" : { "start": 308577, "cols": 20, "rows": 8 },
    "JO 4-132" : { "start": 378140, "cols": 20, "rows": 20 },
    "JS 2-090" : { "start": 35406, "cols": 13, "rows": 10 },
    "Keid" : { "start": 122017, "cols": 20, "rows": 20 },
    "Keldon" : { "start": 27974, "cols": 26, "rows": 34 },
    "Kenlada" : { "start": 7773, "cols": 25, "rows": 20 },
    "Kitalpha" : { "start": 96764, "cols": 17, "rows": 16 },
    "KU 3-616" : { "start": 28858, "cols": 12, "rows": 8 },
    "Laanex" : { "start": 28954, "cols": 15, "rows": 16 },
    "Labela" : { "start": 148005, "cols": 34, "rows": 38 },
    "Ladaen" : { "start": 321230, "cols": 20, "rows": 23 },
    "Laedgre" : { "start": 43577, "cols": 19, "rows": 20 },
    "Lagreen" : { "start": 328445, "cols": 16, "rows": 20 },
    "Lahola" : { "start": 54567, "cols": 25, "rows": 21 },
    "Lalande" : { "start": 2916, "cols": 7, "rows": 10 },
    "Lamice" : { "start": 9165, "cols": 25, "rows": 22 },
    "Laolla" : { "start": 20240, "cols": 12, "rows": 17 },
    "Lasolia" : { "start": 82748, "cols": 19, "rows": 16 },
    "Lave" : { "start": 2986, "cols": 23, "rows": 16 },
    "Lavebe" : { "start": 328765, "cols": 23, "rows": 8 },
    "Lazebe" : { "start": 122417, "cols": 28, "rows": 19 },
    "Leesti" : { "start": 308737, "cols": 15, "rows": 16 },
    "Let" : { "start": 328949, "cols": 22, "rows": 34 },
    "Liaackti" : { "start": 321690, "cols": 20, "rows": 23 },
    "Liaface" : { "start": 308977, "cols": 20, "rows": 20 },
    "Lianla" : { "start": 9715, "cols": 20, "rows": 20 },
    "Liaququ" : { "start": 105559, "cols": 17, "rows": 24 },
    "LN 3-141" : { "start": 29194, "cols": 6, "rows": 6 },
    "LO 2-014" : { "start": 35536, "cols": 10, "rows": 3 },
    "Maia" : { "start": 35566, "cols": 20, "rows": 13 },
    "Matar" : { "start": 122949, "cols": 16, "rows": 16 },
    "Mebsuta" : { "start": 97036, "cols": 17, "rows": 20 },
    "Menkar" : { "start": 149297, "cols": 27, "rows": 34 },
    "Menkent" : { "start": 105967, "cols": 20, "rows": 17 },
    "Meram" : { "start": 168151, "cols": 20, "rows": 25 },
    "Miackio" : { "start": 304092, "cols": 25, "rows": 16 },
    "Miarin" : { "start": 3354, "cols": 7, "rows": 20 },
    "Miayack" : { "start": 10115, "cols": 24, "rows": 14 },
    "Miayda" : { "start": 378540, "cols": 25, "rows": 17 },
    "Micanex" : { "start": 35826, "cols": 20, "rows": 20 },
    "Mintaka" : { "start": 150215, "cols": 40, "rows": 25 },
    "Miola" : { "start": 329697, "cols": 25, "rows": 19 },
    "Miphimi" : { "start": 43957, "cols": 22, "rows": 18 },
    "Mizar" : { "start": 51715, "cols": 16, "rows": 23 },
    "Naos" : { "start": 106307, "cols": 17, "rows": 18 },
    "Nari" : { "start": 137155, "cols": 34, "rows": 37 },
    "Nashira" : { "start": 123205, "cols": 24, "rows": 21 },
    "Nebul" : { "start": 36226, "cols": 12, "rows": 26 },
    "Nekkar" : { "start": 123709, "cols": 14, "rows": 24 },
    "Nex 0001" : { "start": 83052, "cols": 23, "rows": 25 },
    "Nex 0002" : { "start": 44353, "cols": 20, "rows": 25 },
    "Nex 0003" : { "start": 55092, "cols": 25, "rows": 20 },
    "Nex 0004" : { "start": 97376, "cols": 25, "rows": 25 },
    "Nex 0005" : { "start": 324426, "cols": 25, "rows": 25 },
    "Nex 0006" : { "start": 378965, "cols": 25, "rows": 25 },
    "Nex Kataam" : { "start": 47473, "cols": 25, "rows": 25 },
    "Nhandu" : { "start": 160515, "cols": 28, "rows": 40 },
    "Nionquat" : { "start": 36538, "cols": 15, "rows": 20 },
    "Nunki" : { "start": 167638, "cols": 19, "rows": 27 },
    "Nusakan" : { "start": 98001, "cols": 25, "rows": 19 },
    "Oauress" : { "start": 322150, "cols": 22, "rows": 16 },
    "Olaeth" : { "start": 124045, "cols": 18, "rows": 14 },
    "Olaso" : { "start": 330172, "cols": 25, "rows": 20 },
    "Olbea" : { "start": 10451, "cols": 21, "rows": 22 },
    "Olcanze" : { "start": 44853, "cols": 20, "rows": 20 },
    "Oldain" : { "start": 304492, "cols": 18, "rows": 18 },
    "Olexti" : { "start": 3494, "cols": 8, "rows": 16 },
    "Ollaffa" : { "start": 309377, "cols": 17, "rows": 14 },
    "Olphize" : { "start": 20858, "cols": 19, "rows": 21 },
    "Omicron Eridani" : { "start": 36838, "cols": 16, "rows": 19 },
    "Ook" : { "start": 3622, "cols": 15, "rows": 15 },
    "Ophiuchi" : { "start": 55592, "cols": 22, "rows": 20 },
    "Orerve" : { "start": 3847, "cols": 18, "rows": 15 },
    "Oucanfa" : { "start": 379590, "cols": 15, "rows": 15 },
    "PA 2-013" : { "start": 330672, "cols": 20, "rows": 17 },
    "Paan" : { "start": 56032, "cols": 25, "rows": 23 },
    "Pardus" : { "start": 151215, "cols": 100, "rows": 93 },
    "Pass EMP-01" : { "start": 15053, "cols": 20, "rows": 25 },
    "Pass EMP-02" : { "start": 15553, "cols": 18, "rows": 20 },
    "Pass EMP-03" : { "start": 31688, "cols": 25, "rows": 20 },
    "Pass EMP-04" : { "start": 58622, "cols": 25, "rows": 25 },
    "Pass EMP-05" : { "start": 59247, "cols": 13, "rows": 20 },
    "Pass EMP-06" : { "start": 110762, "cols": 25, "rows": 13 },
    "Pass EMP-07" : { "start": 312856, "cols": 25, "rows": 23 },
    "Pass EMP-08" : { "start": 313431, "cols": 25, "rows": 21 },
    "Pass EMP-09" : { "start": 313956, "cols": 25, "rows": 25 },
    "Pass EMP-10" : { "start": 314581, "cols": 25, "rows": 25 },
    "Pass EMP-11" : { "start": 315206, "cols": 15, "rows": 22 },
    "Pass FED-01" : { "start": 15913, "cols": 18, "rows": 17 },
    "Pass FED-02" : { "start": 16219, "cols": 13, "rows": 19 },
    "Pass FED-03" : { "start": 39275, "cols": 17, "rows": 15 },
    "Pass FED-04" : { "start": 39530, "cols": 25, "rows": 22 },
    "Pass FED-05" : { "start": 40080, "cols": 21, "rows": 21 },
    "Pass FED-06" : { "start": 40521, "cols": 18, "rows": 23 },
    "Pass FED-07" : { "start": 85857, "cols": 27, "rows": 15 },
    "Pass FED-08" : { "start": 315536, "cols": 14, "rows": 23 },
    "Pass FED-09" : { "start": 315858, "cols": 23, "rows": 17 },
    "Pass FED-10" : { "start": 316249, "cols": 19, "rows": 20 },
    "Pass FED-11" : { "start": 316629, "cols": 22, "rows": 17 },
    "Pass FED-12" : { "start": 317003, "cols": 21, "rows": 22 },
    "Pass FED-13" : { "start": 381583, "cols": 16, "rows": 21 },
    "Pass UNI-01" : { "start": 111087, "cols": 25, "rows": 16 },
    "Pass UNI-02" : { "start": 111487, "cols": 10, "rows": 10 },
    "Pass UNI-03" : { "start": 111587, "cols": 18, "rows": 20 },
    "Pass UNI-04" : { "start": 127261, "cols": 25, "rows": 25 },
    "Pass UNI-05" : { "start": 127886, "cols": 25, "rows": 26 },
    "Pass UNI-06" : { "start": 317465, "cols": 17, "rows": 19 },
    "Pass UNI-07" : { "start": 317788, "cols": 23, "rows": 24 },
    "Pass UNI-08" : { "start": 318340, "cols": 20, "rows": 31 },
    "Pass UNI-09" : { "start": 381919, "cols": 20, "rows": 15 },
    "Phaet" : { "start": 124297, "cols": 17, "rows": 16 },
    "Phao" : { "start": 98476, "cols": 21, "rows": 20 },
    "Phekda" : { "start": 37142, "cols": 8, "rows": 17 },
    "Phiagre" : { "start": 45253, "cols": 21, "rows": 13 },
    "Phiandgre" : { "start": 322502, "cols": 24, "rows": 20 },
    "Phicanho" : { "start": 10913, "cols": 13, "rows": 25 },
    "PI 4-669" : { "start": 29230, "cols": 9, "rows": 10 },
    "PJ 3373" : { "start": 4117, "cols": 10, "rows": 6 },
    "PO 4-991" : { "start": 11238, "cols": 20, "rows": 14 },
    "Polaris" : { "start": 83627, "cols": 10, "rows": 14 },
    "Pollux" : { "start": 29320, "cols": 20, "rows": 10 },
    "PP 5-713" : { "start": 325051, "cols": 15, "rows": 13 },
    "Procyon" : { "start": 161635, "cols": 37, "rows": 31 },
    "Propus" : { "start": 379815, "cols": 16, "rows": 20 },
    "Quaack" : { "start": 162782, "cols": 28, "rows": 25 },
    "Quana" : { "start": 11518, "cols": 16, "rows": 26 },
    "Quaphi" : { "start": 304816, "cols": 17, "rows": 14 },
    "Quator" : { "start": 29520, "cols": 18, "rows": 18 },
    "Quexce" : { "start": 106613, "cols": 19, "rows": 24 },
    "Quexho" : { "start": 322982, "cols": 17, "rows": 14 },
    "Quince" : { "start": 56607, "cols": 14, "rows": 16 },
    "Qumia" : { "start": 83767, "cols": 20, "rows": 15 },
    "Qumiin" : { "start": 309615, "cols": 18, "rows": 20 },
    "Quurze" : { "start": 4177, "cols": 16, "rows": 20 },
    "QW 2-014" : { "start": 21257, "cols": 15, "rows": 9 },
    "RA 3-124" : { "start": 309975, "cols": 12, "rows": 12 },
    "Ras Elased" : { "start": 163482, "cols": 41, "rows": 40 },
    "Rashkan" : { "start": 37278, "cols": 25, "rows": 29 },
    "Regulus" : { "start": 29844, "cols": 16, "rows": 16 },
    "Remo" : { "start": 45526, "cols": 28, "rows": 26 },
    "Retho" : { "start": 21392, "cols": 22, "rows": 22 },
    "Rigel" : { "start": 165122, "cols": 49, "rows": 34 },
    "Ross" : { "start": 46254, "cols": 17, "rows": 15 },
    "Rotanev" : { "start": 98896, "cols": 16, "rows": 19 },
    "RV 2-578" : { "start": 11934, "cols": 14, "rows": 12 },
    "RX 3-129" : { "start": 305054, "cols": 13, "rows": 12 },
    "SA 2779" : { "start": 4497, "cols": 16, "rows": 5 },
    "Sargas" : { "start": 166788, "cols": 34, "rows": 25 },
    "SD 3-562" : { "start": 46509, "cols": 23, "rows": 19 },
    "Seginus" : { "start": 99200, "cols": 17, "rows": 18 },
    "SF 5-674" : { "start": 310119, "cols": 13, "rows": 22 },
    "Siberion" : { "start": 4577, "cols": 25, "rows": 15 },
    "Sigma Draconis" : { "start": 12102, "cols": 25, "rows": 20 },
    "Silaad" : { "start": 380135, "cols": 25, "rows": 20 },
    "Sirius" : { "start": 124569, "cols": 30, "rows": 25 },
    "Ska" : { "start": 12602, "cols": 40, "rows": 25 },
    "Sobein" : { "start": 331012, "cols": 15, "rows": 12 },
    "Sodaack" : { "start": 56831, "cols": 15, "rows": 16 },
    "Soessze" : { "start": 21876, "cols": 20, "rows": 20 },
    "Sohoa" : { "start": 38003, "cols": 14, "rows": 16 },
    "Sol" : { "start": 4952, "cols": 24, "rows": 29 },
    "Solaqu" : { "start": 84067, "cols": 25, "rows": 25 },
    "Soolti" : { "start": 310405, "cols": 21, "rows": 20 },
    "Sophilia" : { "start": 107069, "cols": 24, "rows": 17 },
    "Sowace" : { "start": 325246, "cols": 19, "rows": 21 },
    "Spica" : { "start": 107477, "cols": 20, "rows": 23 },
    "Stein" : { "start": 323220, "cols": 16, "rows": 16 },
    "Subra" : { "start": 125319, "cols": 20, "rows": 20 },
    "SZ 4-419" : { "start": 30100, "cols": 12, "rows": 7 },
    "Tau Ceti" : { "start": 5648, "cols": 25, "rows": 15 },
    "TG 2-143" : { "start": 22276, "cols": 11, "rows": 12 },
    "Thabit" : { "start": 99506, "cols": 25, "rows": 25 },
    "Tiacan" : { "start": 38227, "cols": 15, "rows": 18 },
    "Tiacken" : { "start": 22408, "cols": 19, "rows": 28 },
    "Tiafa" : { "start": 310825, "cols": 24, "rows": 27 },
    "Tianbe" : { "start": 30184, "cols": 19, "rows": 15 },
    "Tiexen" : { "start": 13602, "cols": 19, "rows": 20 },
    "Tigrecan" : { "start": 331192, "cols": 19, "rows": 13 },
    "Tiliala" : { "start": 57071, "cols": 25, "rows": 17 },
    "Tiurio" : { "start": 305210, "cols": 25, "rows": 14 },
    "Tivea" : { "start": 323476, "cols": 25, "rows": 20 },
    "Turais" : { "start": 125719, "cols": 20, "rows": 23 },
    "UF 3-555" : { "start": 311473, "cols": 14, "rows": 14 },
    "UG 5-093" : { "start": 126179, "cols": 22, "rows": 23 },
    "Urandack" : { "start": 13982, "cols": 20, "rows": 15 },
    "Ureneth" : { "start": 311669, "cols": 18, "rows": 17 },
    "Uressce" : { "start": 331439, "cols": 20, "rows": 17 },
    "Urfaa" : { "start": 107937, "cols": 23, "rows": 20 },
    "Urhoho" : { "start": 22940, "cols": 18, "rows": 18 },
    "Urioed" : { "start": 57496, "cols": 21, "rows": 9 },
    "Urlafa" : { "start": 30469, "cols": 17, "rows": 16 },
    "Ururur" : { "start": 46946, "cols": 20, "rows": 17 },
    "Usube" : { "start": 23264, "cols": 14, "rows": 30 },
    "Uv Seti" : { "start": 331779, "cols": 22, "rows": 15 },
    "UZ 8-466" : { "start": 84692, "cols": 20, "rows": 13 },
    "Veareth" : { "start": 57685, "cols": 19, "rows": 25 },
    "Vecelia" : { "start": 380635, "cols": 15, "rows": 26 },
    "Veedfa" : { "start": 323976, "cols": 14, "rows": 15 },
    "Vega" : { "start": 108857, "cols": 30, "rows": 25 },
    "Veliace" : { "start": 332109, "cols": 25, "rows": 16 },
    "Vewaa" : { "start": 30741, "cols": 22, "rows": 15 },
    "VH 3-344" : { "start": 14282, "cols": 8, "rows": 16 },
    "VM 3-326" : { "start": 311975, "cols": 25, "rows": 10 },
    "Waarze" : { "start": 58160, "cols": 20, "rows": 14 },
    "Waayan" : { "start": 38497, "cols": 25, "rows": 16 },
    "Wainze" : { "start": 109607, "cols": 17, "rows": 16 },
    "Waiophi" : { "start": 14410, "cols": 17, "rows": 15 },
    "Wamien" : { "start": 312225, "cols": 25, "rows": 15 },
    "Waolex" : { "start": 84952, "cols": 25, "rows": 25 },
    "Wasat" : { "start": 100131, "cols": 25, "rows": 19 },
    "Watibe" : { "start": 305560, "cols": 21, "rows": 15 },
    "Wezen" : { "start": 126685, "cols": 20, "rows": 20 },
    "WG 3-288" : { "start": 31071, "cols": 9, "rows": 13 },
    "WI 4-329" : { "start": 332509, "cols": 16, "rows": 21 },
    "WO 3-290" : { "start": 47286, "cols": 17, "rows": 11 },
    "Wolf" : { "start": 31188, "cols": 18, "rows": 20 },
    "WP 3155" : { "start": 6023, "cols": 17, "rows": 7 },
    "WW 2-934" : { "start": 127085, "cols": 16, "rows": 11 },
    "XC 3-261" : { "start": 14665, "cols": 16, "rows": 13 },
    "Xeho" : { "start": 381025, "cols": 16, "rows": 17 },
    "Xewao" : { "start": 312600, "cols": 16, "rows": 16 },
    "XH 3819" : { "start": 6142, "cols": 16, "rows": 12 },
    "YC 3-268" : { "start": 38897, "cols": 14, "rows": 15 },
    "Yildun" : { "start": 100606, "cols": 14, "rows": 17 },
    "YS 3-386" : { "start": 305875, "cols": 14, "rows": 20 },
    "YV 3-386" : { "start": 109879, "cols": 12, "rows": 18 },
    "Zamith" : { "start": 23684, "cols": 18, "rows": 18 },
    "Zaniah" : { "start": 100844, "cols": 16, "rows": 16 },
    "Zaurak" : { "start": 110095, "cols": 17, "rows": 27 },
    "Zeaay" : { "start": 332845, "cols": 27, "rows": 14 },
    "Zeaex" : { "start": 39107, "cols": 12, "rows": 14 },
    "Zearla" : { "start": 306155, "cols": 17, "rows": 16 },
    "Zelada" : { "start": 85577, "cols": 14, "rows": 20 },
    "Zeolen" : { "start": 14873, "cols": 15, "rows": 12 },
    "Zezela" : { "start": 31548, "cols": 14, "rows": 10 },
    "Zirr" : { "start": 24008, "cols": 25, "rows": 18 },
    "ZP 2-989" : { "start": 58440, "cols": 13, "rows": 14 },
    "ZS 3-798" : { "start": 306427, "cols": 13, "rows": 20 },
    "ZU 3-239" : { "start": 381297, "cols": 13, "rows": 22 },
    "Zuben Elakrab" : { "start": 101100, "cols": 25, "rows": 17 },
    "ZZ 2986" : { "start": 6334, "cols": 15, "rows": 5 },
};

;// CONCATENATED MODULE: ./node_modules/pardus-library/src/classes/static/sectors.js



const Sectors = new Map();

for (const sector of Object.keys(sectorMapDataObj)) {
    Sectors.set(sector, new Sector(sector, sectorMapDataObj[sector].start, sectorMapDataObj[sector].cols, sectorMapDataObj[sector].rows));
}

Sectors.getSectorForTile = function(tile_id) { 
    for (const sector of this.getSectors()) {
        if (sector.contains(tile_id)) {
            return sector;
        }
    }

    throw new Error(`No sector found for tile id ${tile_id}`);
}

Sectors.getSectorAndCoordsForTile = function(tile_id) {
    return this.getSectorForTile(tile_id).getTileHumanString(tile_id);
}

Sectors.getTileIdFromSectorAndCoords = function(sector, x, y) {
    if (sector.endsWith('NE')) {
        sector = sector.substring(0, sector.length - 3);
    }

    if (sector.endsWith('East') || sector.endsWith('West')) {
        sector = sector.substring(0, sector.length - 5);
    }

    if (sector.endsWith('North') || sector.endsWith('South') || sector.endsWith('Inner')) {
        sector = sector.substring(0, sector.length - 6);
    }

    if (!this.has(sector)) {
        throw `No data for sector '${sector}'!`;
    }

    return this.get(sector).getTileByCoords(x, y);
}

Sectors.getSectors = function * () {
    for (const sector of this) {
        yield sector[1];
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-library/src/classes/main/nav.js



class NavArea {

    #squad = false;
    #navElement;
    #height;
    #width;
    #grid = [];
    #centreTile;

    #afterRefreshHooks = [];
    #beforeRefreshHooks = [];

    constructor(options = {
        squad: false
    }) {
        this.#squad = options.squad;
        this.refresh();
    }

    /**
     * Add a hook to run after the element is refreshed
     * @function HtmlElement#addAfterRefreshElement
     * @param {function} func Function to call after the element is refreshed
     */
    addAfterRefreshHook(func) {
        this.#afterRefreshHooks.push(func);
    }

    /**
     * Add a hook to run after the element is refreshed
     * @function HtmlElement#addAfterRefreshElement
     * @param {function} func Function to call after the element is refreshed
     */
    addBeforeRefreshHook(func) {
        this.#beforeRefreshHooks.push(func);
    }

    /**
     * Run all hooks that should be called prior to refreshing the element
     * @function Nav#beforeRefresh
     */
    #beforeRefresh() {
        for (const func of this.#beforeRefreshHooks) {
            func();
        }
    }

    /**
     * Run all hooks that should be called after refreshing the element
     * @function Nav#afterRefresh
     * @param {object} opts Optional arguments to be passed to the hooks
     */
    #afterRefresh(opts = {}) {
        for (const func of this.#afterRefreshHooks) {
            func(opts);
        }
    }

    get height() {
        return this.#height;
    }

    get width() {
        return this.#width;
    }

    get grid() {
        return this.#grid;
    }

    get centreTile() {
        return this.#centreTile;
    }

    addTilesHighlights(tiles_to_highlight) {
        for (const tile of this.clickableTiles()) {
            if (tiles_to_highlight.has(tile.id)) {
                tile.addHighlights(tiles_to_highlight.get(tile.id));
            }
        }
    }

    addTilesHighlight(tiles_to_highlight) {
        for (const tile of this.clickableTiles()) {
            if (tiles_to_highlight.has(tile.id)) {
                tile.addHighlight(tiles_to_highlight.get(tile.id));
            }
        }
    }

    clearTilesHighlights() {
        for (const tile of this.clickableTiles()) {
            tile.clearHighlight();
        }
    }

    refreshTilesToHighlight(tiles_to_highlight) {
        this.tiles_to_highlight = tiles_to_highlight;
        this.reload(true);
    }

    refresh() {
        this.#beforeRefresh();
        this.#reload();
        this.#afterRefresh();
    }

    #reload() {
        this.#navElement = document.getElementById('navareatransition');

        if (!this.#navElement || this.#navElement.style.display === "none") {
            this.#navElement = document.getElementById('navarea');
        }

        this.#height = this.#navElement.rows.length;
        this.#width = this.#navElement.rows[0].childElementCount;
        this.#grid = [];

        this.tiles_map = new Map();

        let scanned_x = 0;
        let scanned_y = 0;

        for (const row of this.#navElement.rows) {
            const row_arr = [];

            for (const tile_td of row.children) {

                let tile_number;

                /* There's probably no reason not to use the squad logic for normal ships, too */
                if (this.#squad) {
                    tile_number = (scanned_y * this.#width) + scanned_x;
                } else {
                    tile_number = parseInt(tile_td.id.match(/[^\d]*(\d*)/)[1]);
                }

                const tile_x = tile_number % this.#width;
                const tile_y = Math.floor(tile_number / this.#width);

                const tile = new Tile(tile_td, tile_x, tile_y);

                row_arr.push(tile);
                this.tiles_map.set(tile.id, tile);

                scanned_x++;
            }

            this.#grid.push(row_arr);
            scanned_y++;
            scanned_x = 0;
        }

        const centre_x = Math.floor(this.#width / 2);
        const centre_y = Math.floor(this.#height / 2);

        this.#centreTile = this.#grid[centre_y][centre_x];
        this.#centreTile.is_centre_tile = true;

        /* For squads or other situations where no userloc is available */
        if (!this.#centreTile.id || this.#centreTile.id === '-1') {
            if (this.#grid[centre_y - 1][centre_x].id !== '-1') {
                const newId = parseInt(this.#grid[centre_y - 1][centre_x].id) + 1;
                this.#centreTile.id = newId;
            }
        }
    }

    getTileOrVirtual(x, y, reference) {
        if (x >= this.#grid[0].length || x < 0 || y < 0 || y >= this.#grid.length) {
            return Sectors.getSectorForTile(reference.id).getVirtualTile(x, y, reference);
        }

        return this.#grid[y][x];
    }

    * yieldPathBetween(from, to, ignore_navigatable = false) {
        let current_tile = from;
        yield current_tile;

        while (current_tile.x != to.x || current_tile.y != to.y) {

            let direction_x = 0;
            let direction_y = 0;

            // Which way do we want to move?
            if (current_tile.x > to.x) {
                direction_x = -1;
            } else if (current_tile.x < to.x) {
                direction_x = 1;
            }

            if (current_tile.y > to.y) {
                direction_y = -1;
            } else if (current_tile.y < to.y) {
                direction_y = 1;
            }

            if (direction_x == 0 && direction_y == 0) {
                // We should never end up here, as it implies the two co-ords have the same x and y
                break;
            }

            let candidate_tile = this.#grid[current_tile.y + direction_y][current_tile.x + direction_x];

            // Check to see if it's an unpassable tile, in which case the auto-pilot kicks in
            if (!candidate_tile.isNavigatable()) {

                if (candidate_tile.isVirtualTile()) {
                    break;
                }

                // If we're still going diagonally, the auto-pilot cannot do anything smart, so try to go in just one direction
                if (direction_x != 0 && direction_y != 0) {

                    candidate_tile = this.getTileOrVirtual(current_tile.x, current_tile.y + direction_y, current_tile);

                    if (!candidate_tile.isNavigatable()) {

                        candidate_tile = this.getTileOrVirtual(current_tile.x + direction_x, current_tile.y, current_tile);

                        if (!candidate_tile.isNavigatable()) {
                            break;
                        }
                    }
                } else if (direction_x == 0) {
                    // Vertical auto-pilot will attempt to navigate right, then left

                    candidate_tile = this.getTileOrVirtual(current_tile.x + 1, current_tile.y + direction_y, current_tile);

                    if (!candidate_tile.isNavigatable() && !candidate_tile.isVirtualTile()) {

                        candidate_tile = this.getTileOrVirtual(current_tile.x - 1, current_tile.y + direction_y, current_tile);

                        if (!candidate_tile.isNavigatable() && !candidate_tile.isVirtualTile()) {
                            break;
                        }
                    }
                } else if (direction_y == 0) {
                    // Horizontal auto-pilot will attempt to navigate down, then up

                    candidate_tile = this.getTileOrVirtual(current_tile.x + direction_x, current_tile.y + 1, current_tile);

                    if (!candidate_tile.isNavigatable() && !candidate_tile.isVirtualTile()) {

                        candidate_tile = this.getTileOrVirtual(current_tile.x + direction_x, current_tile.y - 1, current_tile);

                        if (!candidate_tile.isNavigatable() && !candidate_tile.isVirtualTile()) {
                            break;
                        }
                    }
                }
            }

            current_tile = candidate_tile;
            yield current_tile;
        }

    }

    getPathBetween(from, to) {
        return Array.from(this.yieldPathBetween(from, to));
    }

    getPathTo(tile) {
        return this.getPathBetween(this.#centreTile, tile);
    }

    getPathFrom(tile) {
        return this.getPathBetween(tile, this.#centreTile);
    }

    * yieldPathTo(tile) {
        yield* this.yieldPathBetween(this.#centreTile, tile);
    }

    * yieldPathFrom(id, ignore_navigatable = false) {
        const from_tile = this.getTile(id);
        yield* this.yieldPathBetween(from_tile, this.#centreTile, ignore_navigatable);
    }

    getTile(id) {
        if (this.tiles_map.has(id)) {
            return this.tiles_map.get(id);
        }

        return null;
    }

    * tiles() {
        for (const row of this.#grid) {
            for (const tile of row) {
                yield tile;
            }
        }
    }

    * clickableTiles() {
        for (const tile of this.tiles()) {
            if (tile.isClickable()) {
                yield tile;
            }
        }
    }

    * navigatableTiles() {
        for (const tile of this.tiles()) {
            if (tile.isNavigatable()) {
                yield tile;
            }
        }
    }

    getTileOnNav(id) {
        for (const tile of this.tiles()) {
            if (tile.id === id) {
                return tile;
            }
        }

        return null;
    }

    nav(id) {
        if (typeof navAjax === 'function') {
            return navAjax(id);
        }

        if (typeof nav === 'function') {
            return nav(id);
        }

        throw new Error('No function for nav or navAjax found!');
    }

    warp(id) {
        if (typeof warpAjax === 'function') {
            return warpAjax(id);
        }

        if (typeof warp === 'function') {
            return warp(id);
        }

        throw new Error('No function for warp or warpAjax found!');
    }

    xhole(id) {
        const validXHoles = [
            '44580', // Nex-0002
            '47811', // Nex-Kataam
            '55343', // Nex-0003
            '83339', // Nex-0001
            '97698', // Nex-0004
            '324730', // Nex-0005
            '379305', // Nex-0006
        ];

        if (!validXHoles.includes(id)) {
            throw new Error(`Destination ${id} is not a valid X-hole!`);
        }

        document.getElementById('xholebox').elements.warpx.value = id;

        if (typeof warpX === 'function') {
            return warpX();
        }

        return document.getElementById("xholebox").submit();
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-library/src/classes/pages/main.js



class Main extends AbstractPage {
    #navArea;

    constructor() {
        super('/main.php');

        this.#navArea = new NavArea();

        this.#handlePartialRefresh(() => {
            this.#navArea.refresh();
        });
    }

    get nav() {
        return this.#navArea;
    }

    #handlePartialRefresh(func) {
        const mainElement = document.getElementById('tdSpaceChart');
        const navElement = mainElement ? document.getElementById('tdSpaceChart').getElementsByTagName('table')[0].rows[1] : document.querySelectorAll('table td[valign="top"]')[1];

        // This would be more specific, but it doesn't trigger enough refreshes
        //const navElement = document.getElementById('nav').parentNode;

        // Options for the observer (which mutations to observe)
        const config = {
            attributes: false,
            childList: true, 
            subtree: true
        };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            func();
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(navElement, config);
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-library/src/classes/pages/logout.js


class Logout extends AbstractPage {
    constructor() {
        super('/logout.php');
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-library/src/classes/pages/index.js


;// CONCATENATED MODULE: ./node_modules/pardus-library/src/classes/pardus-library.js


class PardusLibrary {

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
;// CONCATENATED MODULE: ./node_modules/pardus-library/src/index.js



;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/pardus-options-utility.js
/**
 * @module PardusOptionsUtility
 */
class PardusOptionsUtility {
    /**
     * @ignore
     */
    static defaultSaveFunction(key, value) {
        return GM_setValue(key, value);
    }

    /**
     * @ignore
     */
    static defaultGetFunction(key, defaultValue = null) {
        return GM_getValue(key, defaultValue);
    }

    /**
     * @ignore
     */
    static defaultDeleteFunction(key) {
        return GM_deleteValue(key);
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

    /**
     *  Returns the universe-specific name of a variable
     */
    static getVariableName(variableName) {
        return `${this.getUniverse()}_${variableName}`;
    }

    /**
     *  Returns the universe-specific value of a variable
     */
    static getVariableValue(variableName, defaultValue = null) {
        return this.defaultGetFunction(this.getVariableName(variableName), defaultValue);
    }

    /**
     *  Sets the universe-specific value of a variable
     */
    static setVariableValue(variableName, value) {
        return this.defaultSaveFunction(this.getVariableName(variableName), value);
    }

    /**
     *  Deletes the universe-specific value of a variable
     */
    static deleteVariableValue(variableName) {
        return this.defaultDeleteFunction(this.getVariableName(variableName));
    }

    static setActiveTab(id) {
        window.localStorage.setItem('pardusOptionsOpenTab', id);
        window.dispatchEvent(new window.Event('storage'));
    }

    static getImagePackUrl() {
        const defaultImagePackUrl = '//static.pardus.at/img/std/';
        const imagePackUrl = String(document.querySelector('body').style.backgroundImage).replace(/url\("*|"*\)|[a-z0-9]+\.gif/g, '');

        return imagePackUrl !== '' ? imagePackUrl : defaultImagePackUrl;
    }

    /**
     * @ignore
     */
    static addGlobalListeners() {
        EventTarget.prototype.addPardusKeyDownListener = function addPardusKeyDownListener(pardusVariable, defaultValue = null, listener, options = false) {
            const pardusVariableKey = PardusOptionsUtility.getVariableValue(pardusVariable, defaultValue);

            if (!pardusVariableKey) {
                throw new Error(`No Pardus variable ${pardusVariable} defined!`);
            }

            if (Object.hasOwn(pardusVariableKey, 'disabled')) {
                return;
            }

            if (!this.pardusListeners) {
                this.pardusListeners = [];
            }

            // Prevent duplicates from being added
            if (this.pardusListeners.includes(`${pardusVariableKey.code}${pardusVariable}`)) {
                return;
            }

            this.pardusListeners.push(`${pardusVariableKey.code}${pardusVariable}`);

            const eventListener = (event) => {
                if (event.isComposing || event.keyCode === 229 || event.repeat) {
                    return;
                }

                if (event.keyCode !== pardusVariableKey.code) {
                    return;
                }

                listener(event);
            };

            this.addEventListener('keydown', eventListener, options);
        };
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/html-element.js
/**
 * @class HtmlElement
 */
class HtmlElement {
    /**
     * @constructor HtmlElement
     * @param {string} id HTML identifier for the element. Must be globally unique.
     */
    constructor(id) {
        // Make sure it is a valid html identifier
        if (!id || id === '') {
            throw new Error('Id cannot be empty.');
        }
        const validIds = /^[a-zA-Z][\w:.-]*$/;
        if (!validIds.test(id)) {
            throw new Error(`Id '${id}' is not a valid HTML identifier.`);
        }

        this.id = id;
        this.afterRefreshHooks = [];
        this.beforeRefreshHooks = [];
    }

    /**
     * Add an event listener to the element
     * @function HtmlElement#addEventListener
     * @param {string} eventName Name of the event to listen for
     * @param {function} listener Listener to call when the event fires
     */
    addEventListener(eventName, listener, opts = false) {
        if (this.getElement()) {
            this.getElement().addEventListener(eventName, listener, opts);
        }

        if (opts && Object.hasOwn(opts, 'ephemeral') && opts.ephemeral) {
            return;
        }

        this.addAfterRefreshHook(() => {
            if (this.getElement()) {
                this.getElement().addEventListener(eventName, listener, opts);
            }
        });
    }

    /**
     * Remove an event listener from the element
     * @function HtmlElement#removeEventListener
     * @param {string} eventName Name of the event to listen for
     * @param {function} listener Listener to call when the event fires
     */
    removeEventListener(eventName, listener) {
        if (this.getElement()) {
            this.getElement().removeEventListener(eventName, listener);
        }
    }

    /**
     * Return a string representation of the html element
     * @function HtmlElement#toString
     * @returns {string} String representation of the html element
     */
    toString() {
        return `<div id='${this.id}'></div>`;
    }

    /**
     * Run all hooks that should be called prior to refreshing the element
     * @function HtmlElement#beforeRefreshElement
     */
    beforeRefreshElement() {
        for (const func of this.beforeRefreshHooks) {
            func();
        }
    }

    /**
     * Run all hooks that should be called after refreshing the element
     * @function HtmlElement#afterRefreshElement
     * @param {object} opts Optional arguments to be passed to the hooks
     */
    afterRefreshElement(opts = {}) {
        for (const func of this.afterRefreshHooks) {
            func(opts);
        }
    }

    /**
     * Add a hook to run after the element is refreshed
     * @function HtmlElement#addAfterRefreshElement
     * @param {function} func Function to call after the element is refreshed
     */
    addAfterRefreshHook(func) {
        this.afterRefreshHooks.push(func);
    }

    /**
     * Refresh the element in the dom
     * @function HtmlElement#refreshElement
     */
    refreshElement() {
        this.beforeRefreshElement();
        this.getElement().replaceWith(this.toElement());
        this.afterRefreshElement();
    }

    /**
     * Gets how much the element should be offset from the top of the DOM
     * @function HtmlElement#getOffsetTop
     * @returns {integer} Pixels the element is offset from the top of the DOM
     */
    getOffsetTop() {
        let currentOffset = this.getElement().offsetTop + this.getElement().offsetHeight;
        let parent = this.getElement().offsetParent;

        while (parent !== null) {
            currentOffset += parent.offsetTop;
            parent = parent.offsetParent;
        }

        return currentOffset;
    }

    /**
     * Gets how much the element should be offset from the left of the DOM
     * @function HtmlElement#getOffsetLeft
     * @returns {integer} Pixels the element is offset from the left of the DOM
     */
    getOffsetLeft() {
        let currentOffset = this.getElement().offsetLeft;
        let parent = this.getElement().offsetParent;

        while (parent !== null) {
            currentOffset += parent.offsetLeft;
            parent = parent.offsetParent;
        }

        return currentOffset;
    }

    /**
     * Gets the element
     * @function HtmlElement#getElement
     * @returns {element} Element
     */
    getElement() {
        return document.getElementById(this.id);
    }

    /**
     * Creates the element within the DOM from the string representation
     * @function HtmlElement#toElement
     * @returns {element} Element
     */
    toElement() {
        const template = document.createElement('template');
        template.innerHTML = this.toString();
        return template.content.firstChild;
    }

    /**
     * Appends a child element to the element within the DOM
     * @function HtmlElement#appendChild
     * @param {element} child The child to append
     * @returns {element} The child element
     */
    appendChild(ele) {
        return document.getElementById(this.id).appendChild(ele);
    }

    /**
     * Appends a child element to the element if it was a table within the DOM
     * @function HtmlElement#appendTableChild
     * @param {element} child The child to append
     * @returns {element} The child element
     */
    appendTableChild(ele) {
        return document.getElementById(this.id).firstChild.appendChild(ele);
    }

    /**
     * Sets the innerHTML property of the element
     * @function HtmlElement#setHTML
     * @param {html} html to set inside the element
     */
    setHTML(html) {
        this.innerHtml = html;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/tip-box.js



class TipBox extends HtmlElement {
    constructor({
        id,
    }) {
        super(id);
        this.contents = '';
        this.title = '';
        this.addEventListener('click', () => {
            this.hide();
        });
    }

    setContents({
        contents = '',
        title = '',
    }) {
        this.contents = contents;
        this.title = title;
        this.refreshElement();
    }

    setPosition({
        element,
        position = 'right',
    }) {
        let xOffset = 15;
        let yOffset = -13;

        switch (position) {
            case 'left': {
                xOffset += -220;
                break;
            }

            case 'er': {
                xOffset += 128;
                break;
            }

            case 'lf': {
                xOffset += -160;
                yOffset += -310;
                break;
            }

            default: {
                break;
            }
        }

        this.getElement().style.top = `${element.getOffsetTop() + yOffset}px`;
        this.getElement().style.left = `${element.getOffsetLeft() + xOffset}px`;
    }

    show() {
        this.getElement().removeAttribute('hidden');
    }

    hide() {
        this.getElement().setAttribute('hidden', '');
    }

    toString() {
        return `<div id="${this.id}" hidden="" style="position: absolute; width: 200px; z-index: 100; border: 1pt black solid; background: #000000; padding: 0px;"><table class="messagestyle" style="background:url(${PardusOptionsUtility.getImagePackUrl()}bgd.gif)" width="100%" cellspacing="0" cellpadding="3"><tbody><tr><td style="text-align:left;background:#000000;"><b>${this.title}</b></td></tr><tr><td style="text-align:left;">${this.contents}</td></tr><tr><td height="5"><spacer type="block" width="1" height="1"></spacer></td></tr><tr><td style="text-align:right;background:#31313A;"><b>GNN Library</b><img src="${PardusOptionsUtility.getImagePackUrl()}info.gif" width="10" height="12" border="0"></td></tr></tbody></table></div>`;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/tabs/tabs-row.js


class TabsRow extends HtmlElement {
    constructor({
        id,
        hidden = false,
    }) {
        super(id);
        this.hidden = hidden;
        this.labels = [];
        this.addAfterRefreshHook(() => {
            for (const label of this.labels) {
                label.afterRefreshElement();
            }
        });
    }

    addLabel({
        label,
    }) {
        this.labels.push(label);
        if (this.getElement()) {
            this.appendChild(label.toElement());
            label.afterRefreshElement();
        }
    }

    show() {
        this.hidden = false;
        this.refreshElement();
    }

    hide() {
        this.hidden = true;
        this.refreshElement();
    }

    toString() {
        if (this.hidden) {
            return `<tr id="${this.id}" cellspacing="0" cellpadding="0" border="0" hidden="">${this.labels.join('')}</tr>`;
        }
        return `<tr id="${this.id}" cellspacing="0" cellpadding="0" border="0">${this.labels.join('')}</tr>`;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/tabs/tabs-element.js



class TabsElement extends HtmlElement {
    constructor({
        id,
    }) {
        super(id);
        this.tabsRow = new TabsRow({
            id: `${this.id}-row`,
        });
    }

    addLabel({
        label,
    }) {
        this.tabsRow.addLabel({
            label,
        });
    }

    toString() {
        return `<table id="${this.id}" cellspacing="0" cellpadding="0" border="0" align="left"><tbody>${this.tabsRow}</tbody></table>`;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/contents-area.js


class ContentsArea extends HtmlElement {
    constructor({
        id,
    }) {
        super(id);
    }

    addContent({
        content,
    }) {
        this.appendChild(document.createElement('div').appendChild(content.toElement()));
        content.afterRefreshElement({
            maintainRefreshStatus: true,
        });
    }

    toString() {
        return `<tr id="${this.id}" cellspacing="0" cellpadding="0" border="0"></tr>`;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/tabs/tab-label.js



class TabLabel extends HtmlElement {
    constructor({
        id,
        heading,
        active = false,
        padding = '0px',
    }) {
        super(id);
        this.padding = padding;
        this.heading = heading;
        this.active = active;
        this.addEventListener('mouseover', () => {
            if (this.active) {
                this.getElement().style.cursor = 'default';
            } else {
                this.getElement().style.backgroundImage = `url(${PardusOptionsUtility.getImagePackUrl()}tabactive.png)`;
                this.getElement().style.cursor = 'default';
            }
        });
        this.addEventListener('mouseout', () => {
            if (!this.active) {
                this.getElement().style.backgroundImage = `url(${PardusOptionsUtility.getImagePackUrl()}tab.png)`;
                this.getElement().style.cursor = 'default';
            }
        });
    }

    toString() {
        const imageUrl = (this.active) ? 'tabactive' : 'tab';
        return `<td id="${this.id}" style="background: transparent url(&quot;${PardusOptionsUtility.getImagePackUrl()}${imageUrl}.png&quot;) no-repeat scroll 0% 0%; background-size: cover; cursor: default; padding-left: ${this.padding}; padding-right: ${this.padding}" class="tabcontent">${this.heading}</td>`;
    }

    setActive() {
        this.getElement().style.backgroundImage = `url('${PardusOptionsUtility.getImagePackUrl()}tabactive.png')`;
        this.active = true;
    }

    setInactive() {
        this.getElement().style.backgroundImage = `url('${PardusOptionsUtility.getImagePackUrl()}tab.png')`;
        this.active = false;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/disablable-html-element.js


/**
 * @class DisablableHtmlElement
 * @extends HtmlElement
 * @abstract
 */
class DisablableHtmlElement extends HtmlElement {
    constructor({
        id,
        disabled = false,
    }) {
        super(id);
        this.disabled = disabled;
    }

    /**
     * Disables this element and all nested elements
     * @function DisablableHtmlElement#disable
     */
    disable() {
        this.setDisabled(true);
        this.refreshElement();
    }

    /**
     * Enables this element and all nested elements
     * @function DisablableHtmlElement#enable
     */
    enable() {
        this.setDisabled(false);
        this.refreshElement();
    }

    /**
     * Allows disabling or enabling ths element and all nested elements without refreshing
     * @function DisablableHtmlElement#setDisabled
     */
    setDisabled(disabled = false) {
        this.disabled = disabled;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/abstract/abstract-button.js


class AbstractButton extends DisablableHtmlElement {
    constructor({
        id,
        premium = false,
        disabled = false,
        styleExtra = '',
        actionText = '',
        actionPerformedText = '',
    }) {
        super({
            id,
            disabled,
        });

        this.premium = premium;

        if (this.premium) {
            this.colour = '#FFCC11';
        } else {
            this.colour = '#D0D1D9';
        }

        this.backgroundColour = '#00001C';

        if (this.disabled) {
            this.colour = '#B5B5B5';
            this.backgroundColour = '#CCCCCC';
        }

        this.styleExtra = styleExtra;
        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;

        this.actionText = actionText;
        this.actionPerformedText = actionPerformedText;
    }

    toString() {
        return `<input value="${this.actionText}" id="${this.id}" type="button" style="${this.style}" ${this.disabled ? 'disabled' : ''}>`;
    }

    /**
     * Add an event listener to the element
     * @function HtmlElement#addEventListener
     * @param {function} listener Listener to call when the event fires
     */
    addClickListener(listener, opts = false) {
        if (this.getElement()) {
            this.getElement().addEventListener('click', listener, opts);
        }

        if (opts && Object.hasOwn(opts, 'ephemeral') && opts.ephemeral) {
            return;
        }

        this.addAfterRefreshHook(() => {
            if (this.getElement()) {
                this.getElement().addEventListener('click', listener, opts);
            }
        });
    }

    setActionText(actionText = '', actionPerformedText = '') {
        this.actionText = actionText;
        this.actionPerformedText = actionPerformedText;
        this.refreshElement();
    }

    displayClicked() {
        this.getElement().setAttribute('disabled', 'true');
        this.getElement().value = this.actionPerformedText;
        this.getElement().setAttribute('style', 'color:green;background-color:silver');
        setTimeout(() => {
            this.getElement().removeAttribute('disabled');
            this.getElement().value = this.actionText;
            if (this.premium) {
                this.getElement().setAttribute('style', 'color:#FFCC11');
            } else {
                this.getElement().removeAttribute('style');
            }
        }, 2000);
    }

    setDisabled(disabled = false) {
        this.disabled = disabled;
        if (this.disabled) {
            this.colour = '#B5B5B5';
            this.backgroundColour = '#CCCCCC';
        } else {
            if (this.premium) {
                this.colour = '#FFCC11';
            } else {
                this.colour = '#D0D1D9';
            }
            this.backgroundColour = '#00001C';
        }
        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;
    }

    disable() {
        this.setDisabled(true);
        if (this.getElement()) {
            this.getElement().setAttribute('disabled', 'true');
            this.getElement().setAttribute('style', this.style);
        }
    }

    enable() {
        this.setDisabled(false);
        if (this.getElement()) {
            this.getElement().removeAttribute('disabled');
            this.getElement().setAttribute('style', this.style);
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/save-button-row/save-button.js


class SaveButton extends AbstractButton {
    constructor({
        id,
        premium = false,
        disabled = false,
    }) {
        super({
            id,
            premium,
            disabled,
            actionText: 'Save',
            actionPerformedText: 'Saved',
        });
    }

    displaySaved() {
        this.displayClicked();
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/save-button-row/reset-button.js


class ResetButton extends AbstractButton {
    constructor({
        id,
        premium = false,
        disabled = false,
    }) {
        super({
            id,
            premium,
            disabled,
            actionText: 'Reset',
            actionPerformedText: 'Reset',
        });
    }

    displayReset() {
        this.displayClicked();
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/save-button-row/save-button-row.js




class SaveButtonRow extends DisablableHtmlElement {
    constructor({
        id,
        premium = false,
        resetButton = false,
        disabled = false,
    }) {
        super({
            id,
            disabled,
        });
        this.premium = premium;
        this.saveButton = new SaveButton({
            id: `${this.id}-button`,
            premium,
            disabled,
        });

        if (resetButton) {
            this.resetButton = new ResetButton({
                id: `${this.id}-reset-button`,
                premium,
                disabled,
            });
        } else {
            this.resetButton = null;
        }
    }

    toString() {
        return `<tr id="${this.id}"><td align="right" style="padding-right: 6px;">${(this.resetButton) ? `${this.resetButton}&nbsp` : ''}${this.saveButton}</td></tr>`;
    }

    /**
     * Allows disabling or enabling this element and all nested elements without refreshing
     * @function SaveButtonRow#setDisabled
     */
    setDisabled(disabled = false) {
        this.disabled = disabled;
        this.saveButton.setDisabled(disabled);
        if (this.resetButton) {
            this.resetButton.setDisabled(disabled);
        }
    }

    displaySaved() {
        this.saveButton.displaySaved();
    }

    displayReset() {
        if (this.resetButton) {
            this.resetButton.displayReset();
        }
    }

    addSaveEventListener(func) {
        this.saveButton.addEventListener('click', func);
    }

    addResetEventListener(func) {
        if (this.resetButton) {
            this.resetButton.addEventListener('click', func);
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/save-button-row/load-button.js


class LoadButton extends AbstractButton {
    constructor({
        id,
        premium = false,
        disabled = false,
    }) {
        super({
            id,
            premium,
            disabled,
            actionText: 'Load',
            actionPerformedText: 'Loaded',
        });
    }

    displayLoaded() {
        this.displayClicked();
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/save-button-row/preset-label.js



class PresetLabel extends DisablableHtmlElement {
    constructor({
        id,
        disabled = false,
        defaultValue = '',
    }) {
        super({
            id,
            disabled,
        });
        this.defaultValue = defaultValue;
        this.styleExtra = '';
        this.colour = '#D0D1D9';
        this.backgroundColour = '#00001C';

        if (this.disabled) {
            this.colour = '#B5B5B5';
            this.backgroundColour = '#CCCCCC';
        }

        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;
    }

    toString() {
        return `<input id="${this.id}" type="text" value="${this.getValue()}" style="${this.style}" ${this.disabled ? 'disabled' : ''}></input>`;
    }

    save() {
        PardusOptionsUtility.defaultSaveFunction(`${PardusOptionsUtility.getVariableName(this.id)}`, this.getCurrentValue());
    }

    hasValue() {
        if (!PardusOptionsUtility.defaultGetFunction(`${PardusOptionsUtility.getVariableName(this.id)}`, false)) {
            return false;
        }

        return true;
    }

    /**
     * Disables the input element
     * @function AbstractOption#disable
     */
    disable() {
        this.setDisabled(true);
        if (this.getInputElement()) {
            this.getInputElement().removeAttribute('disabled');
            this.getInputElement().setAttribute('style', this.style);
        }
    }

    /**
     * Enables the input element
     * @function AbstractOption#enable
     */
    enable() {
        this.setDisabled(false);
        if (this.getInputElement()) {
            this.getInputElement().removeAttribute('disabled');
            this.getInputElement().setAttribute('style', this.style);
        }
    }

    setDisabled(disabled = false) {
        this.disabled = disabled;
        if (this.disabled) {
            this.colour = '#B5B5B5';
            this.backgroundColour = '#CCCCCC';
        } else {
            this.colour = '#D0D1D9';
            this.backgroundColour = '#00001C';
        }
        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;
    }

    /**
     * Gets the input element for the option
     * @function PresetLabel#getInputElement
     * @returns {object} Input element
     */
    getInputElement() {
        return document.getElementById(this.id);
    }

    getCurrentValue() {
        return this.getInputElement().value;
    }

    getValue() {
        return PardusOptionsUtility.defaultGetFunction(`${PardusOptionsUtility.getVariableName(this.id)}`, this.defaultValue);
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/save-button-row/preset-row.js





class PresetRow extends DisablableHtmlElement {
    constructor({
        id,
        premium = false,
        disabled = false,
        presetNumber,
    }) {
        super({
            id,
            disabled,
        });
        this.premium = premium;
        this.saveButton = new SaveButton({
            id: `${this.id}-save-button`,
            premium,
            disabled,
        });
        this.loadButton = new LoadButton({
            id: `${this.id}-load-button`,
            premium,
            disabled,
        });
        this.presetNumber = presetNumber;
        this.label = new PresetLabel({
            id: `${this.id}-label`,
            defaultValue: `Preset ${this.presetNumber}`,
            disabled,
        });

        if (!this.hasValue()) {
            this.loadButton.disable();
        }
    }

    toString() {
        return `<tr id="${this.id}"><td align="left">${this.label}</input></td><td align="right">${this.loadButton} ${this.saveButton}</td></tr>`;
    }

    /**
     * Allows disabling or enabling this element and all nested elements without refreshing
     * @function PresetRow#setDisabled
     */
    setDisabled(disabled = false) {
        this.disabled = disabled;
        this.saveButton.setDisabled(disabled);
        this.loadButton.setDisabled(disabled);
        this.label.setDisabled(disabled);
    }

    displaySaved() {
        this.saveButton.displaySaved();
    }

    displayLoaded() {
        if (this.loadButton) {
            this.loadButton.displayLoaded();
        }
    }

    hasValue() {
        return this.label.hasValue();
    }

    setFunctions(options) {
        if (options.length !== 0) {
            this.addSaveEventListener(() => {
                for (const option of options) {
                    option.saveValue((name, value) => {
                        option.saveFunction(`preset-${this.presetNumber}-${name}`, value);
                    });
                }
                this.displaySaved();
                this.loadButton.enable();

                this.label.save();

                const event = new Event('preset-save', { bubbles: true });
                this.getElement().dispatchEvent(event);
            });
            this.addLoadEventListener(() => {
                for (const option of options) {
                    option.loadValue(option.getValue((name, value) => option.getFunction(`preset-${this.presetNumber}-${name}`, value)));
                }
                this.displayLoaded();

                const event = new Event('preset-load', { bubbles: true });
                this.getElement().dispatchEvent(event);
            });
        }
    }

    addSaveEventListener(func) {
        this.saveButton.addEventListener('click', func);
    }

    addLoadEventListener(func) {
        if (this.loadButton) {
            this.loadButton.addEventListener('click', func);
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/save-button-row/presets.js



class Presets extends DisablableHtmlElement {
    constructor({
        id,
        premium = false,
        disabled = false,
        presets = 0,
    }) {
        super({
            id,
            disabled,
        });
        this.premium = premium;
        this.presets = [];
        for (let i = 0; i < presets; i += 1) {
            this.presets.push(new PresetRow({
                id: `${this.id}-preset-row-${i}`,
                premium,
                disabled,
                presetNumber: i + 1,
            }));
        }
    }

    /**
     * Allows disabling or enabling this element and all nested elements without refreshing
     * @function Presets#setDisabled
     */
    setDisabled(disabled = false) {
        this.disabled = disabled;
        for (const preset of this.presets) {
            preset.setDisabled(disabled);
        }
    }

    toString() {
        if (this.presets.length === 0) {
            return '';
        }

        let html = `<tr id="${this.id}"><td><table width="100%">`;

        for (const presetRow of this.presets) {
            html += presetRow;
        }

        return `${html}</table></td></tr>`;
    }

    setFunctions(options) {
        for (const presetRow of this.presets) {
            presetRow.setFunctions(options);
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/info-element.js




/**
 * @class InfoElement
 * @extends HtmlElement
 */
class InfoElement extends HtmlElement {
    /**
     * @constructor InfoElement
     * @param {string} id HTML identifier for the element. Must be globally unique.
     * @param {string} description Text to display in the InfoElement box
     * @param {string} title Title to display at the top of the InfoElement box
     * @param {string} [tipBoxPosition=right] The direction the InfoElement should appear in. Either 'right' or 'left'
     */
    constructor({
        id,
        description,
        title,
        tipBoxPosition = 'right',
    }) {
        super(id);
        this.description = description;
        this.title = title;
        this.tipBoxPosition = tipBoxPosition;

        this.addEventListener('mouseover', () => {
            // eslint-disable-next-line import/no-cycle
            this.tipBox = PardusOptions.getDefaultTipBox();
            this.tipBox.setContents({
                title: this.title,
                contents: this.description,
            });

            this.tipBox.setPosition({
                element: this,
                position: this.tipBoxPosition,
            });

            this.tipBox.show();
        });

        this.addEventListener('mouseout', () => {
            this.tipBox.hide();
        });
    }

    /**
     * Return a string representation of the InfoElement
     * @function HtmlElement#toString
     * @returns {string} String representation of the InfoElement
     */
    toString() {
        return `<a id="${this.id}" href="#" onclick="return false;"><img src="${PardusOptionsUtility.getImagePackUrl()}info.gif" class="infoButton" alt=""></a>`;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/options/abstract-option.js




/**
 * @class AbstractOption
 * @extends DisablableHtmlElement
 * @abstract
 */
class AbstractOption extends DisablableHtmlElement {
    constructor({
        id,
        variable,
        description = '',
        defaultValue = false,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        shallow = false,
        reverse = false,
        info = null,
        disabled = false,
        styleExtra = '',
        align = 'left',
    }) {
        super({
            id,
            disabled,
        });
        this.variable = variable;
        this.saveFunction = saveFunction;
        this.getFunction = getFunction;
        this.description = description;
        this.info = info;
        this.defaultValue = defaultValue;
        this.inputId = `${this.id}-input`;
        this.shallow = shallow;
        this.reverse = reverse;
        this.styleExtra = styleExtra;
        this.colour = '#D0D1D9';
        this.backgroundColour = '#00001C';
        this.align = align;

        if (this.disabled) {
            this.colour = '#B5B5B5';
            this.backgroundColour = '#CCCCCC';
        }

        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;

        if (this.info !== null) {
            this.infoElement = new InfoElement({
                id: `${this.id}-info`,
                description: this.info.description,
                title: this.info.title,
            });

            this.addAfterRefreshHook(() => {
                this.infoElement.afterRefreshElement();
            });
        } else {
            this.infoElement = '';
        }
    }

    toString() {
        if (this.shallow) {
            return `<td id='${this.id}'>${this.getInnerHTML()}<label>${this.description}</label>${this.infoElement}</td>`;
        }
        if (this.reverse) {
            return `<tr id='${this.id}'><td>${this.getInnerHTML()}</td><td><label for='${this.inputId}'>${this.description}</label>${this.infoElement}</td></tr>`;
        }

        if (this.description === '') {
            return `<tr id='${this.id}'><td col='2'>${this.getInnerHTML()}</td></tr>`;
        }

        return `<tr id='${this.id}'><td><label for='${this.inputId}'>${this.description}:</label>${this.infoElement}</td><td align='${this.align}'>${this.getInnerHTML()}</td></tr>`;
    }

    /**
     * Get the inner HTML of the options element
     * @abstract
     * @function AbstractOption#getInnerHTML
     * @returns {string} Inner HTML of the options element
     */
    getInnerHTML() {
        return '';
    }

    /**
     * Gets the last-saved value of the options element
     * @function AbstractOption#getValue
     * @returns {type} Last-saved value of the options element
     */
    getValue(overrideGetFunction = null) {
        if (overrideGetFunction && typeof overrideGetFunction === 'function') {
            return overrideGetFunction(`${PardusOptionsUtility.getVariableName(this.variable)}`, this.defaultValue);
        }

        return this.getFunction(`${PardusOptionsUtility.getVariableName(this.variable)}`, this.defaultValue);
    }

    /**
     * Gets the current value of the options element
     * @abstract
     * @function AbstractOption#getCurrentValue
     * @returns {type} Value of the options element
     */
    getCurrentValue() {
        return null;
    }

    /**
     * Gets the input element for the option
     * @function AbstractOption#getInputElement
     * @returns {object} Input element
     */
    getInputElement() {
        return document.getElementById(this.inputId);
    }

    /**
     * Resets the saved value of the options element to its default
     * @function AbstractOption#resetValue
     */
    resetValue() {
        this.saveFunction(`${PardusOptionsUtility.getVariableName(this.variable)}`, this.defaultValue);
    }

    /**
     * Saves the current value of the options element
     * @function AbstractOption#saveValue
     */
    saveValue(overrideSaveFunction = null) {
        if (overrideSaveFunction && typeof overrideSaveFunction === 'function') {
            overrideSaveFunction(`${PardusOptionsUtility.getVariableName(this.variable)}`, this.getCurrentValue());
        } else if (!this.disabled) {
            this.saveFunction(`${PardusOptionsUtility.getVariableName(this.variable)}`, this.getCurrentValue());
        }
    }

    refreshStyle() {
        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;
        if (this.getInputElement()) {
            this.getInputElement().setAttribute('style', this.style);
        }
    }

    /**
     * Disables the input element
     * @function AbstractOption#disable
     */
    disable() {
        this.setDisabled(true);
        if (this.getInputElement()) {
            this.getInputElement().setAttribute('disabled', '');
            this.getInputElement().setAttribute('style', this.style);
        }
    }

    /**
     * Enables the input element
     * @function AbstractOption#enable
     */
    enable() {
        this.setDisabled(false);
        if (this.getInputElement()) {
            this.getInputElement().removeAttribute('disabled');
            this.getInputElement().setAttribute('style', this.style);
        }
    }

    setDisabled(disabled = false) {
        this.disabled = disabled;
        if (this.disabled) {
            this.colour = '#B5B5B5';
            this.backgroundColour = '#CCCCCC';
        } else {
            this.colour = '#D0D1D9';
            this.backgroundColour = '#00001C';
        }
        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;
    }

    loadValue(value) {
        this.getInputElement().value = value;
        this.saveValue();
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/options/boolean-option.js


/**
 * @class BooleanOption
 * @extends AbstractOption
 */
class BooleanOption extends AbstractOption {
    getInnerHTML() {
        let checkedStatus = '';
        if (this.getValue() === true) {
            checkedStatus = ' checked';
        }
        return `<input id="${this.inputId}" type="checkbox"${checkedStatus} style="${this.style}" ${this.disabled ? 'disabled' : ''}>`;
    }

    getCurrentValue() {
        return this.getInputElement().checked;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/options/text-area-option.js



class TextAreaOption extends AbstractOption {
    constructor({
        id,
        variable,
        description,
        defaultValue = 0,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        disabled = false,
        info = null,
        rows = 3,
        cols = 65,
    }) {
        super({
            id,
            variable,
            description,
            defaultValue,
            saveFunction,
            getFunction,
            info,
            disabled,
            styleExtra: 'font-family: Helvetica, Arial, sans-serif;font-size:11px;',
        });
        this.rows = rows;
        this.cols = cols;
    }

    getInnerHTML() {
        return `<textarea id="${this.inputId}" width="100%" autocomplete="off" autocorrect="off" spellcheck="false" ${(this.rows === 0) ? '' : `rows="${this.rows}"`} ${(this.cols === 0) ? '' : `cols="${this.cols}"`} style="${this.style}" ${this.disabled ? 'disabled' : ''}>${this.getValue()}</textarea>`;
    }

    getCurrentValue() {
        return this.getInputElement().value;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/options/numeric-option.js



class NumericOption extends AbstractOption {
    constructor({
        id,
        variable,
        description,
        defaultValue = 0,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        disabled = false,
        min = 0,
        max = 0,
        step = 1,
        info = null,
    }) {
        super({
            id,
            variable,
            description,
            defaultValue,
            saveFunction,
            getFunction,
            info,
            disabled,
        });
        this.minValue = min;
        this.maxValue = max;
        this.stepValue = step;
    }

    getInnerHTML() {
        return `<input id="${this.inputId}" type="number" min="${this.minValue}" max="${this.maxValue}" step="${this.stepValue}" value="${this.getValue()}" style="${this.style}" ${this.disabled ? 'disabled' : ''}>`;
    }

    getCurrentValue() {
        return this.getInputElement().value;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/abstract/abstract-toggle-button.js


class AbstractToggleButton extends AbstractButton {
    constructor({
        id,
        premium = false,
        disabled = false,
        styleExtra = '',
        actionText = '',
        actionPerformedText = '',
        toggleText = '',
        togglePerformedText = '',
        toggled = false,
    }) {
        super({
            id,
            premium,
            disabled,
            styleExtra,
            actionText,
            actionPerformedText,
        });

        this.toggled = toggled;

        this.defaultText = actionText;
        this.defaultPerformedText = actionPerformedText;
        this.toggleText = toggleText;
        this.togglePerformedText = togglePerformedText;

        if (this.toggled) {
            this.actionText = this.toggleText;
            this.actionPerformedText = this.togglePerformedText;
        }
    }

    toggle() {
        this.toggled = !this.toggled;

        if (this.toggled) {
            this.actionText = this.toggleText;
            this.actionPerformedText = this.togglePerformedText;
        } else {
            this.actionText = this.defaultText;
            this.actionPerformedText = this.defaultPerformedText;
        }

        this.refreshElement();
    }

    toString() {
        return `<input value="${this.actionText}" id="${this.id}" type="button" style="${this.style}" ${this.disabled ? 'disabled' : ''}>`;
    }

    displayClicked() {
        this.getElement().setAttribute('disabled', 'true');
        this.getElement().value = this.actionPerformedText;
        this.getElement().setAttribute('style', 'color:green;background-color:silver');
        setTimeout(() => {
            this.getElement().removeAttribute('disabled');
            this.getElement().value = this.actionText;
            if (this.premium) {
                this.getElement().setAttribute('style', 'color:#FFCC11');
            } else {
                this.getElement().removeAttribute('style');
            }
        }, 2000);
    }

    /**
     * Add an event listener to the element
     * @function HtmlElement#addEventListener
     * @param {string} eventName Name of the event to listen for
     * @param {function} listener Listener to call when the event fires
     */
    addClickListener(listener, opts = false) {
        if (this.getElement() && !this.toggled) {
            this.getElement().addEventListener('click', listener, opts);
        }

        if (opts && Object.hasOwn(opts, 'ephemeral') && opts.ephemeral) {
            return;
        }

        this.addAfterRefreshHook(() => {
            if (this.getElement() && !this.toggled) {
                this.getElement().addEventListener('click', listener, opts);
            }
        });
    }

    /**
     * Add an event listener to the element
     * @function HtmlElement#addEventListener
     * @param {string} eventName Name of the event to listen for
     * @param {function} listener Listener to call when the event fires
     */
    addToggleClickListener(listener, opts = false) {
        if (this.getElement() && this.toggled) {
            this.getElement().addEventListener('click', listener, opts);
        }

        if (opts && Object.hasOwn(opts, 'ephemeral') && opts.ephemeral) {
            return;
        }

        this.addAfterRefreshHook(() => {
            if (this.getElement() && this.toggled) {
                this.getElement().addEventListener('click', listener, opts);
            }
        });
    }

    setDisabled(disabled = false) {
        this.disabled = disabled;
        if (this.disabled) {
            this.colour = '#B5B5B5';
            this.backgroundColour = '#CCCCCC';
        } else {
            if (this.premium) {
                this.colour = '#FFCC11';
            } else {
                this.colour = '#D0D1D9';
            }
            this.backgroundColour = '#00001C';
        }
        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;
    }

    disable() {
        this.setDisabled(true);
        if (this.getElement()) {
            this.getElement().setAttribute('disabled', 'true');
            this.getElement().setAttribute('style', this.style);
        }
    }

    enable() {
        this.setDisabled(false);
        if (this.getElement()) {
            this.getElement().removeAttribute('disabled');
            this.getElement().setAttribute('style', this.style);
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/options/key-down-set-key-button.js


class SetKeyButton extends AbstractToggleButton {
    constructor({
        id,
        premium = false,
        disabled = false,
    }) {
        super({
            id,
            premium,
            disabled,
            actionText: 'Set Key',
            toggleText: 'Cancel',
            styleExtra: 'width:58px;',
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/options/key-down-disable-button.js


class DisableButton extends AbstractToggleButton {
    constructor({
        id,
        premium = false,
        disabled = false,
        toggled = false,
    }) {
        super({
            id,
            premium,
            disabled,
            toggled,
            actionText: 'Disable',
            toggleText: 'Enable',
            styleExtra: 'width:58px;',
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/options/key-down-option.js





class KeyDownOption extends AbstractOption {
    constructor({
        id,
        variable,
        description = '',
        defaultValue = false,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        shallow = false,
        reverse = false,
        info = null,
    }) {
        const currValue = getFunction(`${PardusOptionsUtility.getVariableName(variable)}`, defaultValue);
        const currDisabled = Object.hasOwn(currValue, 'disabled') && currValue.disabled;
        super({
            id,
            variable,
            description,
            defaultValue,
            saveFunction,
            getFunction,
            shallow,
            reverse,
            info,
            disabled: currDisabled,
            styleExtra: 'width: 20px;padding: 2px;text-align: center;margin: 2px 7px 2px;',
        });
        this.setKeyButton = new SetKeyButton({
            id: `${this.id}-setkey`,
            disabled: currDisabled,
        });
        this.disableButton = new DisableButton({
            id: `${this.id}-disable`,
            toggled: currDisabled,
        });
        this.boundCaptureKeyListener = this.captureKeyListener.bind(this);
        this.setKeyButton.addClickListener(() => {
            document.getElementById(`${this.inputId}-key`).value = '_';
            document.getElementById(`${this.inputId}-key`).style.color = 'lime';
            document.addEventListener('keydown', this.boundCaptureKeyListener, {
                once: true,
                ephemeral: true,
            });
            this.setKeyButton.toggle();
            this.disableButton.disable();
        });
        this.setKeyButton.addToggleClickListener(() => {
            document.removeEventListener('keydown', this.boundCaptureKeyListener);
            this.setKeyButton.toggle();
            this.disableButton.enable();
            this.refreshElement();
        });
        this.disableButton.addClickListener(() => {
            this.disable();
            this.disableButton.toggle();
        });
        this.disableButton.addToggleClickListener(() => {
            this.enable();
            this.disableButton.toggle();
        });
        this.addAfterRefreshHook(() => {
            this.setKeyButton.afterRefreshElement();
            this.disableButton.afterRefreshElement();
        });
    }

    captureKeyListener(event) {
        this.getInputElement().value = JSON.stringify({
            code: event.keyCode,
            key: event.code,
            description: event.key,
        });
        document.getElementById(`${this.inputId}-key`).value = this.getCurrentKeyDescription();
        document.getElementById(`${this.inputId}-key`).style.color = '#D0D1D9';
        this.disableButton.enable();
        this.setKeyButton.toggle();
    }

    getInnerHTML() {
        let keyPressHtml = `<input id='${this.inputId}' type='text' hidden value='${JSON.stringify(this.getValue())}'>`;
        keyPressHtml += `<table width='100%' style='border-collapse: collapse;'><tbody><tr><td align="left"><input id='${this.inputId}-key' type='text' cols='1' maxlength='1' readonly value="${this.getKeyDescription()}" style="${this.style}" ${this.disabled ? 'disabled' : ''}/></td><td align="right">${this.setKeyButton}</td><td align="right" style='padding-right: 0px;'>${this.disableButton}</td></tr></tbody></table>`;
        return keyPressHtml;
    }

    /**
     * Disables the input element
     * @function AbstractOption#disable
     */
    disable() {
        this.setDisabled(true);
        document.getElementById(`${this.inputId}-key`).removeAttribute('disabled');
        document.getElementById(`${this.inputId}-key`).setAttribute('style', this.style);

        this.getInputElement().value = JSON.stringify({
            ...this.getCurrentValue(),
            disabled: true,
        });
    }

    /**
     * Enables the input element
     * @function AbstractOption#enable
     */
    enable() {
        this.setDisabled(false);
        document.getElementById(`${this.inputId}-key`).removeAttribute('disabled');
        document.getElementById(`${this.inputId}-key`).setAttribute('style', this.style);

        const newValue = this.getCurrentValue();
        delete newValue.disabled;
        this.getInputElement().value = JSON.stringify(newValue);
    }

    setDisabled(disabled = false) {
        this.disabled = disabled;
        if (this.disabled) {
            this.colour = '#B5B5B5';
            this.backgroundColour = '#CCCCCC';
            this.setKeyButton.disable();
        } else {
            this.colour = '#D0D1D9';
            this.backgroundColour = '#00001C';
            this.setKeyButton.enable();
        }
        this.style = `color: ${this.colour};background-color: ${this.backgroundColour};${this.styleExtra}`;
    }

    saveValue(overrideSaveFunction = null) {
        if (overrideSaveFunction && typeof overrideSaveFunction === 'function') {
            overrideSaveFunction(`${PardusOptionsUtility.getVariableName(this.variable)}`, this.getCurrentValue());
        } else {
            this.saveFunction(`${PardusOptionsUtility.getVariableName(this.variable)}`, this.getCurrentValue());
        }
    }

    getKey() {
        return this.getValue().key;
    }

    getKeyDescription() {
        return this.getValue().description;
    }

    getKeyCode() {
        return this.getValue().code;
    }

    isDisabled() {
        const value = this.getValue();

        if (Object.hasOwn(value, 'disabled') && value.disabled) {
            return true;
        }

        return false;
    }

    getCurrentKey() {
        return this.getCurrentValue().key;
    }

    getCurrentKeyDescription() {
        return this.getCurrentValue().description;
    }

    getCurrentCode() {
        return this.getCurrentValue().code;
    }

    getCurrentValue() {
        return JSON.parse(this.getInputElement().value);
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/options/select-option.js



class SelectOption extends AbstractOption {
    constructor({
        id,
        variable,
        description,
        defaultValue = null,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        disabled = false,
        info = null,
        inheritStyle = false,
        options = [],
    }) {
        super({
            id,
            variable,
            description,
            defaultValue,
            saveFunction,
            getFunction,
            info,
            disabled,
            align: 'right',
        });
        this.options = options;

        if (inheritStyle) {
            this.addEventListener('change', () => {
                this.updateSelectStyle();
            });
        }
    }

    getInnerHTML() {
        let selectHtml = '';
        const savedValue = this.getValue();
        let hasSelected = false;
        let selectStyle = '';
        for (const option of this.options) {
            const style = (option.style) ? ` style="${option.style}"` : '';
            if (!hasSelected && (option.value === savedValue || (option.default && option.default === true && !savedValue))) {
                selectHtml += `<option value=${option.value}${style} selected>${option.text}</option>`;
                hasSelected = true;
                selectStyle = (option.style) ? ` style="${option.style}"` : '';
            } else {
                selectHtml += `<option value=${option.value}${style}>${option.text}</option>`;
            }
        }

        selectHtml = `<select id="${this.inputId}"${selectStyle} style="${this.style}" ${this.disabled ? 'disabled' : ''}>${selectHtml}`;

        return selectHtml;
    }

    updateSelectStyle() {
        const currentStyle = this.getInputElement().selectedOptions[0].getAttribute('style');
        this.getInputElement().setAttribute('style', currentStyle);
    }

    getOptions() {
        return this.options;
    }

    setOptions(options = []) {
        this.options = options;
    }

    getCurrentValue() {
        return this.getInputElement().value;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/options/grouped-options.js




class GroupedOptions extends HtmlElement {
    constructor({
        id,
        description,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
    }) {
        super(id);
        this.description = description;
        this.saveFunction = saveFunction;
        this.getFunction = getFunction;
        this.options = [];
    }

    toString() {
        return `<tr id="${this.id}"><td>${this.description}</td><td>${this.getInnerHTML()}</td></tr>`;
    }

    getInnerHTML() {
        let html = '<table><tbody><tr>';
        for (const option of this.options) {
            html += option;
        }
        html += '</tr></tbody></table>';
        return html;
    }

    saveValue() {
        for (const option of this.options) {
            option.saveValue();
        }
    }

    addBooleanOption({
        variable,
        description,
        defaultValue = false,
        saveFunction = this.saveFunction,
        getFunction = this.getFunction,
    }) {
        const booleanOptions = {
            id: `${this.id}-option-${this.options.length}`,
            variable,
            description,
            defaultValue,
            saveFunction,
            getFunction,
            shallow: true,
        };

        const newBooleanOption = new BooleanOption(booleanOptions);

        this.options.push(newBooleanOption);
        this.refreshElement();
        return newBooleanOption;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/options-group.js









class OptionsGroup extends DisablableHtmlElement {
    constructor({
        id,
        premium = false,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        disabled = false,
    }) {
        super({
            id,
            disabled,
        });
        this.premium = premium;
        this.saveFunction = saveFunction;
        this.getFunction = getFunction;
        this.options = [];
        this.disabled = disabled;
        this.addAfterRefreshHook(() => {
            for (const option of this.options) {
                option.afterRefreshElement();
            }
        });
    }

    setDisabled(disabled = false) {
        this.disabled = disabled;
        for (const option of this.options) {
            option.setDisabled(disabled);
        }
    }

    addBooleanOption(args) {
        const newOption = new BooleanOption({
            id: `${this.id}-option-${this.options.length}`,
            disabled: this.disabled,
            ...args,
        });
        this.options.push(newOption);
        return newOption;
    }

    addTextAreaOption(args) {
        const newOption = new TextAreaOption({
            id: `${this.id}-option-${this.options.length}`,
            disabled: this.disabled,
            ...args,
        });
        this.options.push(newOption);
        return newOption;
    }

    addNumericOption(args) {
        const newOption = new NumericOption({
            id: `${this.id}-option-${this.options.length}`,
            disabled: this.disabled,
            ...args,
        });
        this.options.push(newOption);
        return newOption;
    }

    addKeyDownOption(args) {
        const newOption = new KeyDownOption({
            id: `${this.id}-option-${this.options.length}`,
            disabled: this.disabled,
            ...args,
        });
        this.options.push(newOption);
        return newOption;
    }

    addSelectOption(args) {
        const newOption = new SelectOption({
            id: `${this.id}-option-${this.options.length}`,
            disabled: this.disabled,
            ...args,
        });
        this.options.push(newOption);
        return newOption;
    }

    addGroupedOption({
        description,
        saveFunction = this.saveFunction,
        getFunction = this.getFunction,
    }) {
        const newOption = new GroupedOptions({
            id: `${this.id}-option-${this.options.length}`,
            disabled: this.disabled,
            description,
            saveFunction,
            getFunction,
        });
        this.options.push(newOption);
        return newOption;
    }

    toString() {
        // If no options have been defined, then don't add any elements
        if (this.options.length === 0) {
            return `<tr id="${this.id}" style="display: none;"><td><table width="100%"><tbody></tbody></table></td></tr>`;
        }
        return `<tr id="${this.id}"><td><table width="100%"><tbody>${this.options.join('')}</tbody></table></td></tr>`;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/description-element.js


/**
 * Controls the description for a specific OptionsBox, only one description per OptionsBox permitted
 * @private
 */
class DescriptionElement extends HtmlElement {
    constructor({
        id,
        description = '',
        imageLeft = '',
        imageRight = '',
    }) {
        super(id);
        this.backContainer = '';
        this.description = description;
        this.imageLeft = imageLeft;
        this.imageRight = imageRight;
        this.alignment = '';
        this.frontContainer = {
            styling: 'style="display: none;"',
            id: '',
            setId(idToSet) {
                this.id = idToSet;
            },
            setStyle(style) {
                this.styling = `style="${style}"`;
            },
            toString() {
                return '';
            },
        };
        this.frontContainer.setId(id);
    }

    addImageLeft(imageSrc) {
        this.imageLeft = imageSrc;
        this.refreshElement();
    }

    addImageRight(imageSrc) {
        this.imageRight = imageSrc;
        this.refreshElement();
    }

    setDescription(description) {
        this.description = description;
        this.refreshElement();
    }

    setAlignment(alignment) {
        this.alignment = alignment;
        this.refreshElement();
    }

    toString() {
        let html = `<tr id=${this.id} style=''><td><table><tbody><tr>`;

        if (this.imageLeft && this.imageLeft !== '') {
            html = `${html}<td><img src="${this.imageLeft}"></td>`;
        }

        // If there's no specific alignment, work out the most ideal one to use
        if (this.alignment === '') {
            if (this.imageLeft === '' && this.imageRight === '') {
                html = `${html}<td align="left">${this.description}</td>`;
            } else {
                html = `${html}<td align="center">${this.description}</td>`;
            }
        } else {
            html = `${html}<td align="${this.alignment}">${this.description}</td>`;
        }

        if (this.imageRight && this.imageRight !== '') {
            html = `${html}<td><img src="${this.imageRight}"></td>`;
        }

        return `${html}</tr></tbody></table></td></tr>`;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/options-box.js







class OptionsBox extends DisablableHtmlElement {
    constructor({
        id,
        heading,
        premium = false,
        description = '',
        imageLeft = '',
        imageRight = '',
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        refresh = true,
        resetButton = false,
        presets = 0,
        disabled = false,
    }) {
        super({
            id,
            disabled,
        });
        this.heading = heading;
        this.premium = premium;
        this.saveFunction = saveFunction;
        this.getFunction = getFunction;
        this.refresh = refresh;
        this.resetButton = resetButton;
        this.disabled = disabled;

        const headerHtml = (premium) ? '<th class="premium">' : '<th>';
        this.frontContainer = `<form id="${this.id}" action="none"><table style="background:url(${PardusOptionsUtility.getImagePackUrl()}bgd.gif)" width="100%" cellpadding="3" align="center"><tbody><tr>${headerHtml}${heading}</th></tr>`;
        this.backContainer = '</tbody></table></form>';
        this.innerHtml = '';
        this.description = new DescriptionElement({
            id: `${this.id}-description`,
            description,
            imageLeft,
            imageRight,
        });
        this.optionsGroup = new OptionsGroup({
            id: `${this.id}-options-group`,
            premium,
            saveFunction,
            getFunction,
            disabled,
        });
        this.saveButtonRow = new SaveButtonRow({
            id: `${this.id}-save`,
            premium,
            resetButton,
            disabled,
        });
        this.presets = new Presets({
            id: `${this.id}-presets`,
            premium,
            presets,
            disabled,
        });
        this.addAfterRefreshHook((opts) => {
            if (opts.maintainRefreshStatus) {
                return;
            }
            this.refresh = true;
        });
        this.addAfterRefreshHook(() => {
            this.optionsGroup.afterRefreshElement();
            this.saveButtonRow.afterRefreshElement();
        });
        this.addAfterRefreshHook(() => {
            this.setFunctions();
        });
    }

    toString() {
        if (this.optionsGroup.options.length === 0) {
            return this.frontContainer + this.description + this.innerHtml + this.optionsGroup + this.backContainer;
        }
        return this.frontContainer + this.description + this.innerHtml + this.optionsGroup + this.saveButtonRow + this.presets + this.backContainer;
    }

    setFunctions() {
        if (this.optionsGroup.options.length !== 0) {
            this.saveButtonRow.addSaveEventListener(() => {
                for (const option of this.optionsGroup.options) {
                    option.saveValue();
                }
                this.saveButtonRow.displaySaved();

                const event = new Event('save');
                this.getElement().dispatchEvent(event);
            });
            this.saveButtonRow.addResetEventListener(() => {
                for (const option of this.optionsGroup.options) {
                    option.resetValue();
                }
                this.saveButtonRow.displayReset();
                this.optionsGroup.refreshElement();

                const event = new Event('reset');
                this.getElement().dispatchEvent(event);
            });
        }

        this.presets.setFunctions(this.optionsGroup.options);
    }

    /**
     * Allows disabling or enabling this element and all nested elements without refreshing
     * @function OptionsBox#setDisabled
     */
    setDisabled(disabled = false) {
        this.disabled = disabled;
        this.optionsGroup.setDisabled(disabled);
        this.saveButtonRow.setDisabled(disabled);
        this.presets.setDisabled(disabled);
    }

    addSaveEventListener(func) {
        return this.saveButtonRow.addSaveEventListener(func);
    }

    addBooleanOption({
        refresh = this.refresh,
        ...args
    }) {
        const newOption = this.optionsGroup.addBooleanOption(args);
        if (refresh) {
            this.refreshElement();
        }
        return newOption;
    }

    addTextAreaOption({
        refresh = this.refresh,
        ...args
    }) {
        const newOption = this.optionsGroup.addTextAreaOption(args);
        if (refresh) {
            this.refreshElement();
        }
        return newOption;
    }

    addNumericOption({
        refresh = this.refresh,
        ...args
    }) {
        const newOption = this.optionsGroup.addNumericOption(args);
        if (refresh) {
            this.refreshElement();
        }
        return newOption;
    }

    addKeyDownOption({
        refresh = this.refresh,
        ...args
    }) {
        const newOption = this.optionsGroup.addKeyDownOption(args);
        if (refresh) {
            this.refreshElement();
        }
        return newOption;
    }

    addSelectOption({
        refresh = this.refresh,
        ...args
    }) {
        const newOption = this.optionsGroup.addSelectOption(args);
        if (refresh) {
            this.refreshElement();
        }
        return newOption;
    }

    addGroupedOption({
        description,
        saveFunction = this.saveFunction,
        getFunction = this.getFunction,
        refresh = this.refresh,
    }) {
        const groupedOptions = {
            description,
            saveFunction,
            getFunction,
        };

        const newOption = this.optionsGroup.addGroupedOption(groupedOptions);
        if (refresh) {
            this.refreshElement();
        }
        return newOption;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/options-content.js




class OptionsContent extends HtmlElement {
    constructor({
        id,
        content = null,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        refresh = true,
        active = true,
    }) {
        super(id);
        this.content = content;
        this.saveFunction = saveFunction;
        this.getFunction = getFunction;
        this.leftBoxes = [];
        this.rightBoxes = [];
        this.topBoxes = [];
        this.bottomBoxes = [];
        this.refresh = refresh;
        this.active = active;
        this.addAfterRefreshHook((opts) => {
            if (opts.maintainRefreshStatus) {
                return;
            }
            this.refresh = true;
        });
        this.addAfterRefreshHook(() => {
            for (const box of this.topBoxes) {
                box.afterRefreshElement();
            }
            for (const box of this.leftBoxes) {
                box.afterRefreshElement();
            }
            for (const box of this.rightBoxes) {
                box.afterRefreshElement();
            }
            for (const box of this.bottomBoxes) {
                box.afterRefreshElement();
            }
        });
    }

    addBox({
        top = false,
        bottom = false,
        ...args
    }) {
        let newBox = null;
        if (top) {
            newBox = this.addBoxTop(args);
        } else if (bottom) {
            newBox = this.addBoxBottom(args);
        } else if (this.leftBoxes.length <= this.rightBoxes.length) {
            newBox = this.addBoxLeft(args);
        } else {
            newBox = this.addBoxRight(args);
        }
        return newBox;
    }

    addBoxBottom({
        refresh = this.refresh,
        ...args
    }) {
        const newBox = new OptionsBox({
            id: `${this.id}-bottom-box-${this.bottomBoxes.length}`,
            refresh,
            ...args,
        });

        this.bottomBoxes.push(newBox);

        if (refresh) {
            this.refreshElement();
        }

        return newBox;
    }

    addBoxTop({
        refresh = this.refresh,
        ...args
    }) {
        const newBox = new OptionsBox({
            id: `${this.id}-top-box-${this.topBoxes.length}`,
            refresh,
            ...args,
        });

        this.topBoxes.push(newBox);

        if (refresh) {
            this.refreshElement();
        }

        return newBox;
    }

    addBoxLeft({
        refresh = this.refresh,
        ...args
    }) {
        const newBox = new OptionsBox({
            id: `${this.id}-left-box-${this.leftBoxes.length}`,
            refresh,
            ...args,
        });

        this.leftBoxes.push(newBox);

        if (refresh) {
            this.refreshElement();
        }

        return newBox;
    }

    addBoxRight({
        refresh = this.refresh,
        ...args
    }) {
        const newBox = new OptionsBox({
            id: `${this.id}-right-box-${this.rightBoxes.length}`,
            refresh,
            ...args,
        });

        this.rightBoxes.push(newBox);

        if (refresh) {
            this.refreshElement();
        }

        return newBox;
    }

    addPremiumBox(args) {
        return this.addBox({
            premium: true,
            ...args,
        });
    }

    addPremiumBoxLeft(args) {
        return this.addBoxLeft({
            premium: true,
            ...args,
        });
    }

    addPremiumBoxRight(args) {
        return this.addBoxRight({
            premium: true,
            ...args,
        });
    }

    toString() {
        if (this.content !== null) {
            return this.content;
        }
        const hidden = this.active ? '' : 'hidden';
        return `<tr id="${this.id}" ${hidden}><td><table width="100%" align="center"><tbody><tr><td id="${this.id}-top" colspan="3" valign="top">${this.topBoxes.join('<br><br>')}${(this.topBoxes.length > 0) ? '<br><br>' : ''}</td></tr><tr><td id="${this.id}-left" width="350" valign="top">${this.leftBoxes.join('<br><br>')}</td><td width="40"></td><td id="${this.id}-right" width="350" valign="top">${this.rightBoxes.join('<br><br>')}</td></tr><tr><td id="${this.id}-bottom" colspan="3" valign="top">${(this.bottomBoxes.length > 0) ? '<br><br>' : ''}${this.bottomBoxes.join('<br><br>')}</td></tr></tbody></table></td></tr>`;
    }

    setActive() {
        this.active = true;
        this.getElement().removeAttribute('hidden');
    }

    setInactive() {
        this.active = false;
        this.getElement().setAttribute('hidden', '');
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/tabs/sub-tab.js




class SubTab {
    constructor({
        id,
        label,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        refresh = true,
        active = false,
        padding,
    }) {
        this.id = id;
        this.active = active;
        this.label = new TabLabel({
            id: `${this.id}-label`,
            heading: label,
            active: this.active,
            padding,
        });
        this.content = new OptionsContent({
            id: `${this.id}-content`,
            saveFunction,
            getFunction,
            refresh,
            active: this.active,
        });
    }

    setActive() {
        if (this.active === true) {
            return;
        }
        this.active = true;
        this.label.setActive();
        this.content.setActive();
    }

    setInactive() {
        if (this.active === false) {
            return;
        }
        this.active = false;
        this.label.setInactive();
        this.content.setInactive();
    }

    afterRefreshElement(opts) {
        this.label.afterRefreshElement(opts);
        this.content.afterRefreshElement(opts);
    }

    getLabel() {
        return this.label;
    }

    getContent() {
        return this.content;
    }

    toString() {
        return this.content.toString();
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/version-row.js


class VersionRow extends HtmlElement {
    constructor({
        id,
    }) {
        super(id);
    }

    toString() {
        return `<tr id="${this.id}"><td align="right" style="font-size:11px;color:#696988;padding-right:7px;padding-top:5px">Version ${GM_info.script.version}</td></tr>`;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/tabs/tab-content.js






class TabContent extends HtmlElement {
    constructor({
        id,
        heading,
        defaultLabel = 'Default tab',
        content = null,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        refresh = true,
    }) {
        super(id);
        this.heading = heading;
        this.content = content;
        this.saveFunction = saveFunction;
        this.getFunction = getFunction;
        this.subTabsRow = new TabsRow({
            id: `${this.id}-tabsrow`,
        });
        this.refresh = refresh;
        this.subTabs = [];
        this.defaultTab = this.addSubTab({
            label: defaultLabel,
            saveFunction: this.saveFunction,
            getFunction: this.getFunction,
            refresh: false,
            active: true,
        });
        this.versionRow = new VersionRow({
            id: `${this.id}-versionrow`,
        });
        this.addAfterRefreshHook((opts) => {
            if (opts.maintainRefreshStatus) {
                return;
            }
            this.refresh = true;
        });
        this.addAfterRefreshHook((opts) => {
            if (!this.refresh && opts.maintainRefreshStatus) {
                return;
            }
            for (const subTab of this.subTabs) {
                subTab.afterRefreshElement(opts);
            }
        });
    }

    addSubTab({
        label,
        saveFunction = this.saveFunction,
        getFunction = this.getFunction,
        refresh = this.refresh,
        active = false,
        padding,
    }) {
        const newSubTab = new SubTab({
            id: `${this.id}-subtab-${this.subTabs.length}`,
            label,
            saveFunction,
            getFunction,
            refresh,
            active,
            padding,
        });

        const newSubTabContent = newSubTab.getContent();
        const newSubTabLabel = newSubTab.getLabel();

        this.subTabsRow.addLabel({
            label: newSubTabLabel,
        });

        this.subTabs.push(newSubTab);

        newSubTabLabel.addEventListener('click', () => {
            this.setActiveSubTab(newSubTab.id);
        });

        if (refresh) {
            this.refreshElement();
        }

        return newSubTabContent;
    }

    setActiveSubTab(subTabId) {
        for (const subTab of this.subTabs) {
            if (subTab.id === subTabId) {
                subTab.setActive();
            } else {
                subTab.setInactive();
            }
        }
    }

    addBox(args) {
        return this.defaultTab.addBox(args);
    }

    addBoxBottom(args) {
        return this.defaultTab.addBoxBottom(args);
    }

    addBoxTop(args) {
        return this.defaultTab.addBoxTop(args);
    }

    addBoxLeft(args) {
        return this.defaultTab.addBoxLeft(args);
    }

    addBoxRight(args) {
        return this.defaultTab.addBoxRight(args);
    }

    addPremiumBox(args) {
        return this.defaultTab.addPremiumBox(args);
    }

    addPremiumBoxLeft(args) {
        return this.defaultTab.addPremiumBoxLeft(args);
    }

    addPremiumBoxRight(args) {
        return this.defaultTab.addPremiumBoxRight(args);
    }

    setActive() {
        this.getElement().removeAttribute('hidden');
    }

    setInactive() {
        this.getElement().setAttribute('hidden', '');
    }

    toString() {
        if (this.content !== null) {
            return this.content;
        }
        const hidden = (this.subTabs.length > 1) ? '' : 'hidden';
        const innerStyle = (this.subTabs.length > 1) ? 'class="tabstyle"' : '';
        return `<table id="${this.id}" hidden class="tabstyle" style="background:url(${PardusOptionsUtility.getImagePackUrl()}bgdark.gif)" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td><div align="center"><h1>${this.heading}</h1></div></td></tr><tr><td><table width="100%" align="center" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td><table cellspacing="0" cellpadding="0" border="0" ${hidden}><tbody>${this.subTabsRow}</tbody></table></td></tr><tr><td><table ${innerStyle} cellspacing="0" cellpadding="0" border="0"><tbody>${this.subTabs.join('')}</tbody></table></td></tr></tbody></table></td></tr>${this.versionRow}</tbody></table>`;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/tabs/tab.js




class Tab {
    constructor({
        id,
        heading,
        content = null,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        refresh = true,
        defaultLabel,
    }) {
        this.id = id;
        this.heading = heading;
        this.content = new TabContent({
            id: `options-content-${this.id}`,
            heading,
            content,
            saveFunction,
            getFunction,
            refresh,
            defaultLabel,
        });
        this.label = new TabLabel({
            id: `${this.id}-label`,
            heading,
        });
        this.active = false;
        this.saveFunction = saveFunction;
        this.getFunction = getFunction;
    }

    addListeners() {
        this.getLabel().addEventListener('click', () => PardusOptionsUtility.setActiveTab(this.id), true);
        window.addEventListener('storage', () => {
            if (window.localStorage.getItem('pardusOptionsOpenTab') === this.id && !this.active) {
                this.setActive();
            }
            if (window.localStorage.getItem('pardusOptionsOpenTab') !== this.id && this.active) {
                this.setInactive();
            }
        });
    }

    setActive() {
        this.label.setActive();
        this.content.setActive();
        this.active = true;
    }

    setInactive() {
        this.label.setInactive();
        this.content.setInactive();
        this.active = false;
    }

    getContent() {
        return this.content;
    }

    getLabel() {
        return this.label;
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/classes/pardus-options.js






/**
 * @module PardusOptions
 */
class PardusOptions {
    /**
     *  @ignore
     */
    static init() {
        if (document.getElementById('options-area')) {
            return;
        }

        // Get the normal Pardus options
        const defaultPardusOptionsContent = document.getElementsByTagName('table')[2];

        // Identify the containing HTML element to house all the options HTML
        const pardusMainElement = defaultPardusOptionsContent.parentNode;

        // Give the Pardus options an appropriate id, and remove it from the DOM
        defaultPardusOptionsContent.setAttribute('id', 'options-content-pardus-default');
        defaultPardusOptionsContent.setAttribute('class', 'tabstyle');
        defaultPardusOptionsContent.remove();

        // Add this object to the DOM within the main containing element
        pardusMainElement.appendChild(this.getPardusOptionsElement());

        const defaultTipBox = this.createDefaultTipBox();
        pardusMainElement.appendChild(defaultTipBox.toElement());

        // Add the Pardus options back in
        this.addTab({
            id: 'pardus-default',
            heading: 'Pardus Options',
            content: defaultPardusOptionsContent.outerHTML,
            refresh: false,
        });

        // Set the Pardus options tab to be active by default
        PardusOptionsUtility.setActiveTab('pardus-default');
    }

    /**
     *  @deprecated Get the version of the Pardus Options Library running
     */
    static version() {
        return 1.6;
    }

    /**
     * @ignore
     */
    static createDefaultTipBox() {
        return new TipBox({
            id: 'options-default-tip-box',
        });
    }

    /**
     * @ignore
     */
    static getDefaultTipBox() {
        const defaultTipBox = this.createDefaultTipBox();
        defaultTipBox.refreshElement();
        return defaultTipBox;
    }

    /**
     * @ignore
     */
    static getTabsElement() {
        return new TabsElement({
            id: 'options-tabs',
        });
    }

    /**
     * @ignore
     */
    static getContentElement() {
        return new ContentsArea({
            id: 'options-content',
        });
    }

    /**
     * @ignore
     */
    static getPardusOptionsElement() {
        const template = document.createElement('template');
        template.innerHTML = `<table id="options-area" cellspacing="0" cellpadding="0" border="0"><tbody><tr cellspacing="0" cellpadding="0" border="0"><td>${this.getTabsElement()}</td></tr>${this.getContentElement()}</tbody></table>`;
        return template.content.firstChild;
    }

    /**
     * Add a tab on the Options page on Pardus to show your options
     * @param {Object} params An object containing parameter values
     * @param {string} params.id A namespace identifier to identify the tab from other tabs. Must be globally unique.
     * @param {string} params.heading Text to display in the tab
     * @param {string} params.content HTML to embed within the tab.
     * @returns {TabContent} Tab
     */
    static addTab({
        id,
        heading,
        content = null,
        saveFunction = PardusOptionsUtility.defaultSaveFunction,
        getFunction = PardusOptionsUtility.defaultGetFunction,
        refresh = true,
        defaultLabel,
    }) {
        const newTab = new Tab({
            id,
            heading,
            content,
            saveFunction,
            getFunction,
            refresh,
            defaultLabel,
        });

        // Check for id uniqueness
        if (document.getElementById(newTab.id)) {
            throw new Error(`Tab '${newTab.id}' already exists!`);
        }

        this.getTabsElement().addLabel({
            label: newTab.getLabel(),
        });

        this.getContentElement().addContent({
            content: newTab.getContent(),
        });

        newTab.addListeners();

        return newTab.getContent();
    }
}

;// CONCATENATED MODULE: ./node_modules/pardus-options-library/src/index.js



/**
  *  Add the Options object to the page for all scripts to use
  */
if (document.location.pathname === '/options.php') {
    PardusOptions.init();
}

PardusOptionsUtility.addGlobalListeners();



;// CONCATENATED MODULE: ./src/classes/main/navigation-favourite.js


class NavigationFavourite {
    constructor(favouriteNumber) {
        const prefix = 'navigation-favourite-';

        this.number = favouriteNumber;
        this.id = `${prefix}${favouriteNumber}`;

        const existingValue = PardusOptionsUtility.getVariableValue(this.id);

        if (existingValue) {
            this.name = existingValue.name;
            this.value = existingValue.value;
        }
    }

    save() {
        this.name = document.getElementById(`${this.id}-name`).value;
        this.value = {
            sector: document.getElementById('select-sector').value,
            x: document.getElementById('target-x').value,
            y: document.getElementById('target-y').value,
        };

        PardusOptionsUtility.setVariableValue(this.id, {
            name: this.name,
            value: this.value,
        });
    }

    load() {
        document.getElementById('select-sector').value = this.value.sector;
        document.getElementById('target-x').value = this.value.x;
        document.getElementById('target-y').value = this.value.y;
    }

    addEventListeners() {
        document.getElementById(`${this.id}-save`).addEventListener('click', () => {
            this.save();
            document.getElementById(`${this.id}-save`).setAttribute('disabled', 'true');
            document.getElementById(`${this.id}-save`).value = 'Saved';
            document.getElementById(`${this.id}-save`).setAttribute('style', 'color:green;background-color:silver');
            setTimeout(() => {
                document.getElementById(`${this.id}-save`).removeAttribute('disabled');
                document.getElementById(`${this.id}-save`).value = 'Save';
                document.getElementById(`${this.id}-save`).setAttribute('style', 'color:#D0D1D9;background-color:#00001C;');
            }, 2000);
        });

        document.getElementById(`${this.id}-load`).addEventListener('click', () => {
            this.load();
            document.getElementById(`${this.id}-load`).setAttribute('disabled', 'true');
            document.getElementById(`${this.id}-load`).value = 'Loaded';
            document.getElementById(`${this.id}-load`).setAttribute('style', 'color:green;background-color:silver');
            setTimeout(() => {
                document.getElementById(`${this.id}-load`).removeAttribute('disabled');
                document.getElementById(`${this.id}-load`).value = 'Load';
                document.getElementById(`${this.id}-load`).setAttribute('style', 'color:#D0D1D9;background-color:#00001C;');
            }, 2000);
        });
    }

    #saveButton() {
        return `<input value="Save" id="${this.id}-save" tabindex='-1' type="button" style="color:#D0D1D9;background-color:#00001C;"/>`;
    }

    #loadButton() {
        return `<input value="Load" id="${this.id}-load" tabindex='-1' type="button" style="color:#D0D1D9;background-color:#00001C;"/>`;
    }

    #input() {
        let valueOrPlaceholder = `placeholder='Favourite ${this.number}'`;

        if ('value' in this) {
            valueOrPlaceholder = `value='${this.name}'`;
        }

        return `<input id='${this.id}-name' type='text' tabindex='-1' ${valueOrPlaceholder} style='color:#D0D1D9; background-color:#00001C;width:120px;'></input>`;
    }

    toString() {
        return `<tr><td align='left'>${this.#input()}</td><td align='right'>${this.#loadButton()} ${this.#saveButton()}</td></tr>`;
    }
}

;// CONCATENATED MODULE: ./src/classes/main/navigation-favourites.js



class NavigationFavourites {
    constructor() {
        this.id = 'pardus-flight-computer-navigation-calculator-favourites';
        this.numberOfFavourites = PardusOptionsUtility.getVariableValue('navigation_number_of_favourites', 4);
        this.favourites = [];
        this.setupFavourites();
    }

    setupFavourites() {
        for (let i = 1; i <= this.numberOfFavourites; i += 1) {
            this.favourites.push(new NavigationFavourite(i));
        }
    }

    addEventListeners() {
        for (const favourite of this.favourites) {
            favourite.addEventListeners();
        }
    }

    toString() {
        return this.getHtml();
    }

    getInnerHtml() {
        let html = '';

        for (const favourite of this.favourites) {
            html += favourite;
        }

        return html;
    }

    getHtml() {
        return `<table id='${this.id}' style='width: 100%;'><tbody>${this.getInnerHtml()}</tbody></table>`;
    }
}

;// CONCATENATED MODULE: ./src/static/helpers.js


function mapperUrlsFromRoute(route = []) {
    const sectorRoutes = new Map();

    for (let index = 0; index < route.length; index += 1) {
        const tileObj = Sectors.getSectorForTile(route[index]).getTile(route[index]);

        if (!tileObj) {
            console.log(`No tile object for ${route[index]}`);
        } else {
            const tilesInSector = [];

            if (sectorRoutes.has(tileObj.sector)) {
                tilesInSector.push(...sectorRoutes.get(tileObj.sector));
            }

            tilesInSector.push(`${tileObj.x},${tileObj.y}`);

            sectorRoutes.set(tileObj.sector, tilesInSector);
        }
    }

    const mapperUrls = new Map();

    for (const sectorRouteIndex of sectorRoutes) {
        mapperUrls.set(sectorRouteIndex[0], mapperUrlFromValues(sectorRouteIndex[0], sectorRouteIndex[1]));
    }

    return mapperUrls;
}

function mapperUrlFromValues(sector, coords) {
    return `http://map.xcom-alliance.info/${encodeURI(sector)}.html?hilite=${coords.join('|')}`;
}

function estimateXYHoleAPCost(maneuver) {
    if (maneuver <= 10) {
        return 2500;
    }

    if (maneuver >= 85.9) {
        return 1000;
    }

    const adjManeuver = maneuver - 10;

    // This is not the true formula, but is within 20aps of the jump cost for all maneuver
    return 1000 + (10 * Math.floor(150 * (10 ** (-0.019 * adjManeuver)) - adjManeuver ** (1 / 3)));
}

;// CONCATENATED MODULE: ./src/classes/main/navigation-options.js



class NavigationOptions {
    constructor(options = {
        squad: false,
    }) {
        this.isSquad = options.squad;
        this.id = 'pardus-flight-computer-navigation-calculator-configuration';
        this.configuration = PardusOptionsUtility.getVariableValue('navigation-configuration', {});
        this.#initDriveMap();
    }

    saveConfiguration() {
        PardusOptionsUtility.setVariableValue('navigation-configuration', this.configuration);
    }

    getOptions() {
        const options = {
            drive_speed: 1,
            navigation_level: 0,
            amber_stim: false,
            pathfinder: null,
            wormhole_cost: 10,
            x_hole_cost: 1000,
            exocrab: false,
            boost_active: false,
            gas_flux_capacitor: null,
            energy_flux_capacitor: null,
            wormhole_seals: {
                enif: true,
                nhandu: true,
                procyon: true,
                quaack: true,
            },
        };

        /**
         *  Credit to Asdwolf for the logic from his script
         */
        const epoch = 1449120361000; //December 3, 2015 05:26:01 GMT
        const days = (Date.now() - epoch) / 1000 / 60 / 60 / 24;
        const wormholeCycle = ['procyon', 'nhandu', 'enif', 'quaack'];

        switch (PardusOptionsUtility.getUniverse()) {
            case 'artemis':
            case 'orion':
                options.wormhole_seals[wormholeCycle[Math.floor(days / 2) % 4]] = false;
                break;
            case 'pegasus':
                options.wormhole_seals[wormholeCycle[Math.floor((days + 3) / 2) % 4]] = false;
                break;
            default:
                throw new Error('Unable to determine universe');
        }

        if (this.isSquad) {
            options.drive_speed = 2;
            options.x_hole_cost = Infinity;
            return options;
        }

        if ('drive' in this.configuration) {
            options.drive_speed = this.configuration.drive.speed;
        }

        if ('navigation_level' in this.configuration) {
            options.navigation_level = this.configuration.navigation_level;
        }

        if ('gyro' in this.configuration) {
            options.wormhole_cost = this.configuration.gyro.wormhole_cost;
        }

        if ('gas_flux_capacitor' in this.configuration) {
            options.gas_flux_capacitor = this.configuration.gas_flux_capacitor.strength;
        }

        if ('energy_flux_capacitor' in this.configuration) {
            options.energy_flux_capacitor = this.configuration.energy_flux_capacitor.strength;
        }

        if ('effective_maneuver' in this.configuration) {
            options.x_hole_cost = estimateXYHoleAPCost(this.configuration.effective_maneuver);
        }

        if ('pathfinder' in this.configuration) {
            options.pathfinder = this.configuration.pathfinder;
        }

        return options;
    }

    refreshOptions() {
        return Promise.all([
            this.#refreshShipEquipment(),
            this.#refreshAdvancedSkills(),
            this.#refreshSkills(),
            this.#refreshCrew(),
        ]).then(() => {
            this.saveConfiguration();
        }).then(() => {
            this.reloadHtml();
        });
    }

    #refreshSkills() {
        return this.#fetchPardusPage('overview_stats.php').then((dom) => {
            const maneuver = Number(dom.getElementById('maneuver_actual').childNodes[0].textContent);
            this.configuration.effective_maneuver = maneuver;
        });
    }

    #refreshCrew() {
        return this.#fetchPardusPage('inspect_crew.php').then((dom) => {
            const tables = dom.querySelectorAll('.messagestyle');

            let foundPathfinder = false;

            for (const table of tables) {
                // Primary pathfinder
                if (table.innerText.search(/Primary ability:\s*Pathfinder/) !== -1) {
                    this.configuration.pathfinder = 'primary';
                    foundPathfinder = true;
                    break;
                }

                // Secondary pathfinder
                if (table.innerText.search(/Secondary ability:\s*Pathfinder/) !== -1) {
                    this.configuration.pathfinder = 'secondary';
                    foundPathfinder = true;
                    break;
                }
            }

            if (!foundPathfinder) {
                this.configuration.pathfinder = null;
            }
        });
    }

    #refreshAdvancedSkills() {
        return this.#fetchPardusPage('overview_advanced_skills.php').then((dom) => {
            const tables = dom.querySelectorAll('.messagestyle');
            const lastTable = tables[tables.length - 1];
            const lastRow = lastTable.rows[lastTable.rows.length - 1];
            const navigationLevel = Number(lastRow.cells[2].innerText.split(' ')[1].split('/')[0]);
            this.configuration.navigation_level = navigationLevel;
        });
    }

    #refreshShipEquipment() {
        return this.#fetchPardusPage('overview_ship.php').then((dom) => {
            const tables = dom.querySelectorAll('.messagestyle');
            const shipTable = tables[0];

            let driveRow;

            for (const shipRow of shipTable.rows) {
                if (shipRow.cells[0].innerText === 'Drive:') {
                    driveRow = shipRow;
                }
            }

            if (!driveRow) {
                throw new Error('Failed to identify the row of the ship\'s drive.');
            }

            const driveTd = driveRow.querySelector('td:nth-of-type(2)');
            const driveImage = driveTd.children[0].src.split('/')[driveTd.children[0].src.split('/').length - 1];
            this.configuration.drive = this.driveMap.get(driveImage);

            const specialEquipmentImages = tables[1].querySelectorAll('img');

            delete this.configuration.gyro;
            delete this.configuration.gas_flux_capacitor;
            delete this.configuration.energy_flux_capacitor;

            for (const equipmentImage of specialEquipmentImages) {
                const imageName = equipmentImage.src.split('/')[equipmentImage.src.split('/').length - 1];

                switch (imageName) {
                    case 'gyro_stabilizer_1.png':
                        this.configuration.gyro = {
                            name: 'I',
                            image: 'gyro_stabilizer_1.png',
                            wormhole_cost: 6,
                        };
                        break;
                    case 'gyro_stabilizer_2.png':
                        this.configuration.gyro = {
                            name: 'II',
                            image: 'gyro_stabilizer_2.png',
                            wormhole_cost: 1,
                        };
                        break;
                    case 'flux_capacitor_gas.png':
                        this.configuration.gas_flux_capacitor = {
                            name: 'Weak',
                            image: 'flux_capacitor_gas.png',
                            strength: 'weak',
                        };
                        break;
                    case 'flux_capacitor_gas_strong.png':
                        this.configuration.gas_flux_capacitor = {
                            name: 'Strong',
                            image: 'flux_capacitor_gas_strong.png',
                            strength: 'strong',
                        };
                        break;
                    case 'flux_capacitor_energy.png':
                        this.configuration.energy_flux_capacitor = {
                            name: 'Weak',
                            image: 'flux_capacitor_energy.png',
                            strength: 'weak',
                        };
                        break;
                    case 'flux_capacitor_energy_strong.png':
                        this.configuration.energy_flux_capacitor = {
                            name: 'Strong',
                            image: 'flux_capacitor_energy_strong.png',
                            strength: 'strong',
                        };
                        break;
                    default:
                        // This will trigger for literally all other equipment
                        // throw new Error(`Unexpected equipment '${imageName}'!`);
                }
            }
        });
    }

    #initDriveMap() {
        this.driveMap = new Map();

        this.driveMap.set('drive_nuclear.png', {
            name: 'Nuclear',
            image: 'drive_nuclear.png',
            speed: 1,
        });

        this.driveMap.set('drive_fusion.png', {
            name: 'Fusion',
            image: 'drive_fusion.png',
            speed: 2,
        });

        this.driveMap.set('drive_fusion_enhanced.png', {
            name: 'Enhanced Fusion',
            image: 'drive_fusion_enhanced.png',
            speed: 2,
        });

        this.driveMap.set('drive_ion.png', {
            name: 'Ion',
            image: 'drive_ion.png',
            speed: 3,
        });

        this.driveMap.set('drive_ion_z.png', {
            name: 'Z Series Ion',
            image: 'drive_ion_z.png',
            speed: 3,
        });

        this.driveMap.set('drive_antimatter.png', {
            name: 'Anti-Matter',
            image: 'drive_antimatter.png',
            speed: 4,
        });

        this.driveMap.set('drive_antimatter_enhanced.png', {
            name: 'Enhanced Anti-Matter',
            image: 'drive_antimatter_enhanced.png',
            speed: 4,
        });

        this.driveMap.set('drive_hyper.png', {
            name: 'Hyper',
            image: 'drive_hyper.png',
            speed: 5,
        });

        this.driveMap.set('drive_hyper_z.png', {
            name: 'Z Series Hyper',
            image: 'drive_hyper_z.png',
            speed: 5,
        });

        this.driveMap.set('drive_interphased.png', {
            name: 'Interphased',
            image: 'drive_interphased.png',
            speed: 6,
        });

        this.driveMap.set('drive_interphased_enhanced.png', {
            name: 'Enhanced Interphased',
            image: 'drive_interphased_enhanced.png',
            speed: 6,
        });

        this.driveMap.set('fer_drive_1.png', {
            name: 'Feral Spin Apparatus',
            image: 'fer_drive_1.png',
            speed: 6,
        });
    }

    reloadHtml() {
        if (this.isSquad) {
            document.getElementById(this.id).innerHTML = this.getSquadInnerHtml();
            return;
        }

        document.getElementById(this.id).innerHTML = this.getInnerHtml();
        this.addRefreshListener();
    }

    #fetchPardusPage(page) {
        return fetch(page).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }

            return response.text();
        }).then((html) => {
            const parser = new DOMParser();
            return parser.parseFromString(html, 'text/html');
        });
    }

    getSquadInnerHtml() {
        const driveHtml = `<img src='${PardusOptionsUtility.getImagePackUrl()}squadrons/bomber_squad_3.png' width='32' height='10'/> Bomber squad`;

        return `<tbody><tr><td>Drive:</td><td id='navigation-options-drive'>${driveHtml}</td></tr></tbody>`;
    }

    getInnerHtml() {
        const driveHtml = 'drive' in this.configuration ? `<img src='${PardusOptionsUtility.getImagePackUrl()}equipment/${this.configuration.drive.image}' width='32' height='10'/> ${this.configuration.drive.name}` : 'None';
        const navigationHtml = 'navigation_level' in this.configuration ? `Level ${this.configuration.navigation_level}/3` : 'Level 0/3';
        const gyroHtml = 'gyro' in this.configuration ? `<img src='${PardusOptionsUtility.getImagePackUrl()}equipment/${this.configuration.gyro.image}' width='32' height='10'/> ${this.configuration.gyro.name}` : 'None';
        const gasFluxCapacitorHtml = 'gas_flux_capacitor' in this.configuration ? `<img src='${PardusOptionsUtility.getImagePackUrl()}equipment/${this.configuration.gas_flux_capacitor.image}' width='32' height='10'/> ${this.configuration.gas_flux_capacitor.name}` : 'None';
        const energyFluxCapacitorHtml = 'energy_flux_capacitor' in this.configuration ? `<img src='${PardusOptionsUtility.getImagePackUrl()}equipment/${this.configuration.energy_flux_capacitor.image}' width='32' height='10'/> ${this.configuration.energy_flux_capacitor.name}` : 'None';
        const xYHoleAPCost = 'effective_maneuver' in this.configuration ? `${estimateXYHoleAPCost(this.configuration.effective_maneuver)} <img src='${PardusOptionsUtility.getImagePackUrl()}turns.png' width='9.5'/>` : `2,500 <img src='${PardusOptionsUtility.getImagePackUrl()}turns.png' width='9.5'/>`;
        const pathfinderHtml = 'pathfinder' in this.configuration && this.configuration.pathfinder ? `${this.configuration.pathfinder}` : 'None';

        return `<tbody><tr><td>Drive: </td><td id='navigation-options-drive'>${driveHtml}</td></tr><tr><td>Navigation skill: </td><td id='navigation-options-skill'>${navigationHtml}</td></tr><tr><td>Gyro Stabilizer: </td><td id='navigation-options-gyro'>${gyroHtml}</td></tr><tr><td>Gas Flux Capacitor: </td><td id='navigation-options-gas'>${gasFluxCapacitorHtml}</td></tr><tr><td>Energy Flux Capacitor: </td><td id='navigation-options-energy'>${energyFluxCapacitorHtml}</td></tr><tr><td>X/Y-hole jump cost: </td><td id='navigation-options-xyhole'>${xYHoleAPCost}</td></tr><tr><td>Pathfinder: </td><td id='navigation-options-pathfinder'>${pathfinderHtml}</td></tr><tr><td colspan='2' align='center'><input id='refresh-navigation-options' type='submit' tabindex='-1' value='Refresh'/></td></tr></tbody>`;
    }

    addRefreshListener() {
        const button = document.getElementById('refresh-navigation-options');

        if (!button) {
            return;
        }

        button.addEventListener('click', () => {
            button.setAttribute('disabled', 'true');
            button.value = 'Refreshing...';
            button.setAttribute('style', 'text-align: center; color: green; background-color: silver');
            this.refreshOptions().finally(() => {
                button.removeAttribute('disabled');
                button.value = 'Plot route';
                button.setAttribute('style', 'text-align: center;');
            });
        });
    }

    toString() {
        return this.getHtml();
    }

    getHtml() {
        if (this.isSquad) {
            return `<table id='${this.id}' style='width: 100%;'>${this.getSquadInnerHtml()}</table>`;
        }

        return `<table id='${this.id}' style='width: 100%;'>${this.getInnerHtml()}</table>`;
    }
}

;// CONCATENATED MODULE: ./src/classes/main/navigation-calculator-popup.js




class NavigationCalculatorPopup {
    constructor(options = {
        squad: false,
    }) {
        this.isSquad = options.squad;
        this.id = 'pardus-flight-computer-navigation-calculator-popup';
        this.navigationOptions = new NavigationOptions(options);
        this.navigationFavourites = new NavigationFavourites();

        if (document.getElementById(this.id)) {
            this.element = document.getElementById(this.id);
        } else {
            this.#create();
        }
    }

    isVisible() {
        return !this.element.style.display;
    }

    show() {
        this.element.style.display = '';
        document.getElementById('select-sector').focus();
    }

    hide() {
        this.element.style.display = 'none';
        document.getElementById('select-sector').blur();
    }

    #getSectorSelectHtml(id) {
        let html = `<select id='select-${id}'><option value='' disabled selected>-- Target Sector --</option>`;

        for (const sector of Sectors) {
            html += `<option value="${sector[0]}">${sector[0]}</option>`;
        }

        html += '</select>';

        return html;
    }

    /**
     * Prevents keypresses from interacting with other parts of this script or other scripts
     */
    #addKeyDownListener() {
        this.element.addEventListener('keydown', (event) => {
            event.stopPropagation();
        });
    }

    getRouteFrom(startTileId) {
        const targetSector = document.getElementById('select-sector').value;
        const targetX = Number(document.getElementById('target-x').value);
        const targetY = Number(document.getElementById('target-y').value);

        const targetTileId = Sectors.getTileIdFromSectorAndCoords(targetSector, targetX, targetY);

        return this.#getRouteTo([startTileId, targetTileId]);
    }

    #getRouteTo(waypoints = []) {
        const url = 'https://pardusapcalculator.uk';
        const options = this.navigationOptions.getOptions();

        return fetch(`${url}/route?${new URLSearchParams({
            waypoints: waypoints.join(','),
            options: encodeURIComponent(JSON.stringify(options)),
        })}`).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }

            return response.json();
        }).then((json) => json.path);
    }

    // Credit to Victoria Axworthy (Orion), and Math (Orion)
    #create() {
        this.element = document.createElement('div');
        this.element.id = this.id;
        const width = 520;

        Object.assign(this.element.style, {
            backgroundColor: '#00002C',
            border: '2px outset #335',
            left: '50%',
            top: '35%',
            width: `${width}px`,
            marginLeft: `${-width / 2}px`,
            marginTop: `${-175 / 2}px`,
            position: 'fixed',
            zIndex: 9,
            display: 'none',
        });

        this.element.innerHTML = `<table style='width: inherit;'><tbody><tr><th colspan='2'>Navigate to destination</th></tr><tr style='height: 50px;'><td style='text-align: center;'><label for='select-sector'>Sector: </label>${this.#getSectorSelectHtml('sector')}</td><td style='text-align: center;'><label for='target-x'>x: <input id='target-x' type='number' min=0 max=100 maxlength=3 size=3/> <label for='target-y'>y: <input id='target-y' type='number' min=0 max=100 maxlength=3 size=3/></td></tr><tr><td id='destination-favourites' style='width: 50%;padding: 5px;border-style: dotted;border-color: gray;border-width: thin;'>${this.navigationFavourites}</td><td id='navigation-ship-equipment' style='width: 50%;padding: 5px;border-style: dotted;border-color: gray;border-width: thin;'>${this.navigationOptions.getHtml()}</td></tr><tr><td colspan='2' style='text-align: center;padding-top:20px;'><input type='submit' id='navigate-to-destination' value='Plot route'/></td></tr><tr><td colspan='2' style='text-align: right;'><input type='submit' id='close-navigation-calculator-popup' value='Cancel'/></td></tr></tbody></table>`;

        document.body.appendChild(this.element);
        document.getElementById('close-navigation-calculator-popup').addEventListener('click', () => {
            this.hide();
        });

        this.#addKeyDownListener();
        this.navigationOptions.addRefreshListener();
        this.navigationFavourites.addEventListeners();
    }

    getCalculateButtonElement() {
        return document.getElementById('navigate-to-destination');
    }
}

;// CONCATENATED MODULE: ./src/classes/main/nav.js





/* global userloc */

class Nav {
    #recordingListeners = new Map();

    constructor(navArea, optionsPrefix, isSquad) {
        this.navArea = navArea;
        this.optionsPrefix = optionsPrefix;
        this.isSquad = isSquad;

        this.tileString = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}tiles_to_highlight`, '');
        this.defaultColour = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}default_colour`, 'g');
        this.tileMap = new Map();

        // Initialise the tile set
        for (const tileStr of this.tileString.split(',')) {
            const tileIdAndColour = tileStr.split('|');

            if (tileIdAndColour.length === 1) {
                this.tileMap.set(tileIdAndColour[0], this.defaultColour);
            } else {
                this.tileMap.set(tileIdAndColour[0], tileIdAndColour[1]);
            }
        }

        this.#addAutopilot();
        this.#addNavigationCalculatorPopup(optionsPrefix);

        document.addPardusKeyDownListener('toggle_recording_keypress', { code: 82 }, this.#addRecordingToggleHander);

        this.#partialRefresh();
        this.navArea.addAfterRefreshHook(() => { this.#partialRefresh(); });
    }

    #partialRefresh() {
        this.navArea.addTilesHighlight(this.tileMap);
        if (!this.isSquad) {
            this.#addRecording();
            this.#highlightRecordedTiles();
        }
        this.#addPathFinding();
    }

    #highlightRecordedTiles() {
        if (this.isSquad) {
            return;
        }

        const highlightTiles = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}highlight_tiles`, true);

        if (!highlightTiles) {
            return;
        }

        const recordedTileColour = PardusOptionsUtility.getVariableValue('recorded_tile_colour', 'c');
        const badRecordedTileColour = PardusOptionsUtility.getVariableValue('bad_recorded_tile_colour', 'r');
        const recordedTiles = new Map(PardusOptionsUtility.getVariableValue('recorded_tiles', []).map((x) => [x, recordedTileColour]));
        const badRecordedTiles = new Map(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []).map((x) => [x, badRecordedTileColour]));

        this.navArea.addTilesHighlight(recordedTiles);
        this.navArea.addTilesHighlight(badRecordedTiles);
    }

    #addPathFinding() {
        for (const tile of this.navArea.navigatableTiles()) {
            const path = this.navArea.getPathTo(tile);

            tile.addEventListener('mouseenter', () => {
                for (const pathTile of path) {
                    if (!pathTile.path_highlighted) {
                        pathTile.path_highlighted = true;
                        if (pathTile.isHighlighted()) {
                            pathTile.emphasiseHighlight();
                        } else {
                            pathTile.addHighlight(PardusOptionsUtility.getVariableValue('default_path_colour', 'y'));
                        }
                    }
                }
            }, {
                nonce: `path_finding_mouseenter_${tile.id}`,
            });

            tile.addEventListener('mouseleave', () => {
                for (const pathTile of path) {
                    if (pathTile.isEmphasised()) {
                        pathTile.removeEmphasis();
                    } else {
                        pathTile.removeHighlight(PardusOptionsUtility.getVariableValue('default_path_colour', 'y'));
                    }
                    pathTile.path_highlighted = false;
                }
            }, {
                nonce: `path_finding_mouseleave_${tile.id}`,
            });

            if (tile.element.querySelector(':hover')) {
                for (const pathTile of path) {
                    if (!pathTile.path_highlighted) {
                        pathTile.path_highlighted = true;
                        if (pathTile.isHighlighted()) {
                            pathTile.emphasiseHighlight();
                        } else {
                            pathTile.addHighlight(PardusOptionsUtility.getVariableValue('default_path_colour', 'y'));
                        }
                    }
                }
            }
        }
    }

    #addRecordingToggleHander() {
        const recording = PardusOptionsUtility.getVariableValue('recording', false);

        if (recording) {
            Msgframe.sendMessage('Recording stopped', 'info');
            PardusOptionsUtility.setVariableValue('expected_route', []);
        } else {
            Msgframe.sendMessage('Recording started', 'info');
        }

        PardusOptionsUtility.setVariableValue('recording', !recording);
    }

    #addRecording() {
        const currentPosition = userloc.toString();
        const expectedRoute = PardusOptionsUtility.getVariableValue('expected_route', []);

        const recordingMode = PardusOptionsUtility.getVariableValue('recording_mode', 'all');
        const recording = PardusOptionsUtility.getVariableValue('recording', false);
        const modifyRouteRecording = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false);

        if (recording || modifyRouteRecording) {
            const recordedTiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));
            const badRecordedTiles = new Set(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []));
            const modifiedRoute = PardusOptionsUtility.getVariableValue('modified_route', []);

            if (expectedRoute.includes(currentPosition)) {
                for (const flownTile of expectedRoute) {
                    if (recording && (recordingMode === 'all' || recordingMode === 'good')) {
                        recordedTiles.add(flownTile);
                    }

                    if (modifyRouteRecording) {
                        if (modifiedRoute.indexOf(flownTile) < 0) {
                            modifiedRoute.push(flownTile);
                        }
                    }

                    badRecordedTiles.delete(flownTile);

                    if (flownTile === currentPosition) {
                        break;
                    }
                }
            }

            PardusOptionsUtility.setVariableValue('recorded_tiles', Array.from(recordedTiles));
            PardusOptionsUtility.setVariableValue('bad_recorded_tiles', Array.from(badRecordedTiles));
            PardusOptionsUtility.setVariableValue('modified_route', modifiedRoute);
            // PardusOptionsUtility.setVariableValue('expected_route', []);
        }

        this.#addRecordingListener();
    }

    #addRecordingListener() {
        for (const tile of this.navArea.navigatableTiles()) {
            const path = this.navArea.getPathTo(tile);
            const pathTileIds = path.map((x) => x.id);

            const listener = () => {
                const currentPosition = userloc.toString();
                const recording = PardusOptionsUtility.getVariableValue('recording', false);
                const modifyRouteRecording = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false);

                if (recording || modifyRouteRecording) {
                    // console.log(`pathTileIds: ${pathTileIds}`);
                    PardusOptionsUtility.setVariableValue('expected_route', pathTileIds);

                    if (currentPosition) {
                        PardusOptionsUtility.setVariableValue('last_tile_id', currentPosition);
                    }

                    // console.log(`expectedRoute: ${PardusOptionsUtility.getVariableValue('expected_route', [])}`);
                }
            };

            tile.addEventListener('click', listener, {
                nonce: `recording_${tile.id}`,
            });
        }
    }

    fly() {
        if (PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false)) {
            Msgframe.sendMessage('Modifying route, cannot use autopilot', 'error');
            return false;
        }

        const tileString = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}tiles_to_highlight`, '');
        const path = [];

        const checkForNpcs = PardusOptionsUtility.getVariableValue('autopilot_check_for_npcs', true);

        // Initialise the tile set
        for (const tileStr of tileString.split(',')) {
            path.push(tileStr.split('|')[0]);
        }

        if (path.length === 0) {
            Msgframe.sendMessage('No autopilot path programmed', 'error');
            return false;
        }

        const forwardDirection = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_forward`, true);
        const maxSteps = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_max_steps`, 10);

        const pathToFly = path;

        if (!forwardDirection) {
            pathToFly.reverse();
        }

        const currentLocation = this.navArea.centreTile.id;
        const currentIndexOnPath = pathToFly.indexOf(currentLocation);

        // Do not fly if we are not currently on the path
        if (currentIndexOnPath < 0) {
            Msgframe.sendMessage('You are not on the autopilot path', 'error');
            return false;
        }

        // Are we at the end of the path?
        if (currentIndexOnPath === pathToFly.length - 1) {
            Msgframe.sendMessage('Autopilot has reached the end of the path', 'info');
            return false;
        }

        // By default, do not move
        let indexToFlyTo = 0;

        // Now try to see if we can move further along the path in a single click
        for (let step = 1; step <= maxSteps; step += 1) {
            if (currentIndexOnPath + step > pathToFly.length - 1) {
                break;
            }

            const targetTile = this.navArea.getTileOnNav(pathToFly[currentIndexOnPath + step]);

            // If the tile is not on the nav screen
            if (!targetTile) {
                break;
            }

            // If the tile has an NPC, we want to stop on the tile before it
            if (checkForNpcs && targetTile.hasNpc()) {
                break;
            }

            const directRoute = this.navArea.getPathTo(targetTile);

            // Can we even get to the target tile?
            if (directRoute.length <= 1) {
                break;
            }

            const desiredDirectRoute = pathToFly.slice(currentIndexOnPath, currentIndexOnPath + 1 + step);

            if (JSON.stringify(directRoute.map((i) => i.id)) === JSON.stringify(desiredDirectRoute)) {
                indexToFlyTo = step;
            } else {
                break;
            }
        }

        if (indexToFlyTo > 0) {
            PardusOptionsUtility.setVariableValue('expected_route', pathToFly.slice(currentIndexOnPath, currentIndexOnPath + indexToFlyTo + 1));
            return this.navArea.nav(pathToFly[currentIndexOnPath + indexToFlyTo]);
        } if (checkForNpcs && currentIndexOnPath + indexToFlyTo < pathToFly.length - 1 && this.navArea.getTileOnNav(pathToFly[currentIndexOnPath + indexToFlyTo + 1])?.hasNpc()) {
            Msgframe.sendMessage('NPC is in the way, please fly around', 'error');
            return false;
        } if (this.navArea.centreTile.isWormhole()) {
            return this.navArea.warp(pathToFly[currentIndexOnPath]);
        } if (this.navArea.centreTile.isXHole() || this.navArea.centreTile.isYHole()) {
            return this.navArea.xhole(pathToFly[currentIndexOnPath + 1]);
        }

        Msgframe.sendMessage(`Unable to fly to ${Sectors.getSectorAndCoordsForTile(pathToFly[currentIndexOnPath + 1])}, please make sure the route is continuous.`, 'error');
        return false;
    }

    #addAutopilot() {
        if (!PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}enable_autopilot`, true)) {
            return;
        }

        document.addPardusKeyDownListener('move_along_path_key', { code: 70 }, () => {
            this.fly();
        });

        document.addPardusKeyDownListener('modify_autopilot_route', { code: 77 }, () => {
            const modifyRoute = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false);
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}modify_route`, !modifyRoute);

            if (!modifyRoute) {
                Msgframe.sendMessage('Modifying route', 'info');
                PardusOptionsUtility.setVariableValue('modified_route', [this.navArea.centreTile.id]);
            } else {
                const modifiedRoute = PardusOptionsUtility.getVariableValue('modified_route', []);

                if (modifiedRoute.length < 2) {
                    Msgframe.sendMessage('Cancelling route modification', 'info');
                    return;
                }

                const forward = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_forward`, true);
                const tileString = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}tiles_to_highlight`, '');
                const routeArray = [];

                for (const tileStr of tileString.split(',')) {
                    routeArray.push(tileStr.split('|')[0]);
                }

                if (!forward) {
                    routeArray.reverse();
                }

                const startIndex = routeArray.indexOf(modifiedRoute[0]);
                const endIndex = routeArray.indexOf(modifiedRoute[modifiedRoute.length - 1]);

                if (startIndex < 0 || endIndex < 0) {
                    Msgframe.sendMessage('Route modification must start and end on the existing route', 'error');
                    return;
                }

                if (startIndex > endIndex) {
                    routeArray.splice(endIndex, startIndex + 1 - endIndex, ...modifiedRoute.reverse());
                } else {
                    routeArray.splice(startIndex, endIndex + 1 - startIndex, ...modifiedRoute);
                }

                if (!forward) {
                    routeArray.reverse();
                }

                PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}tiles_to_highlight`, routeArray.join(','));
                this.tileMap = new Map();

                // Initialise the tile set
                for (const tileStr of routeArray) {
                    this.tileMap.set(tileStr.toString(), this.defaultColour);
                }

                this.navArea.clearTilesHighlights();
                this.navArea.addTilesHighlight(this.tileMap);
                this.#highlightRecordedTiles();

                Msgframe.sendMessage('Saving route', 'info');
            }
        });

        document.addPardusKeyDownListener('toggle_autopilot_direction', { code: 67 }, () => {
            if (PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}modify_route`, false)) {
                Msgframe.sendMessage('Cannot change autopilot direction whilst modifying path', 'error');
                return;
            }

            const forward = PardusOptionsUtility.getVariableValue(`${this.optionsPrefix}autopilot_forward`, false);

            if (forward) {
                Msgframe.sendMessage('Autopilot heading backwards', 'info');
            } else {
                Msgframe.sendMessage('Autopilot heading forward', 'info');
            }

            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}autopilot_forward`, !forward);
        });
    }

    #plotPath(event) {
        if (!this.navigationCalculatorPopup.isVisible()) {
            return;
        }

        event.preventDefault();

        this.navigationCalculatorPopup.getCalculateButtonElement().setAttribute('disabled', 'true');
        this.navigationCalculatorPopup.getCalculateButtonElement().value = 'Plotting...';
        this.navigationCalculatorPopup.getCalculateButtonElement().setAttribute('style', 'text-align: center; color: green; background-color: silver');
        this.navigationCalculatorPopup.getRouteFrom(this.navArea.centreTile.id).then((route) => {
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}tiles_to_highlight`, route.join(','));
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}autopilot_forward`, true);
            PardusOptionsUtility.setVariableValue(`${this.optionsPrefix}modify_route`, false);
            this.navigationCalculatorPopup.hide();
            Msgframe.sendMessage('Plotted route to destination', 'info');

            this.tileMap = new Map();

            // Initialise the tile set
            for (const tileStr of route) {
                this.tileMap.set(tileStr.toString(), this.defaultColour);
            }

            this.navArea.clearTilesHighlights();
            this.navArea.addTilesHighlight(this.tileMap);
            this.#highlightRecordedTiles();
        }).catch(() => {
            Msgframe.sendMessage('Unable to get route to destination', 'error');
        }).finally(() => {
            this.navigationCalculatorPopup.getCalculateButtonElement().removeAttribute('disabled');
            this.navigationCalculatorPopup.getCalculateButtonElement().value = 'Plot route';
            this.navigationCalculatorPopup.getCalculateButtonElement().setAttribute('style', 'text-align: center;');
        });
    }

    #addNavigationCalculatorPopup() {
        this.navigationCalculatorPopup = new NavigationCalculatorPopup({ squad: this.isSquad });

        document.addPardusKeyDownListener('open_navigation_key', { code: 68 }, (keyEvent) => {
            if (!this.navigationCalculatorPopup.isVisible()) {
                this.navigationCalculatorPopup.show();
                keyEvent.preventDefault();
            }
        });

        document.addPardusKeyDownListener('close_navigation_key', { code: 27 }, (keyEvent) => {
            if (this.navigationCalculatorPopup.isVisible()) {
                this.navigationCalculatorPopup.hide();
                keyEvent.preventDefault();
            }
        });

        this.navigationCalculatorPopup.element.addPardusKeyDownListener('close_navigation_key', { code: 27 }, (keyEvent) => {
            if (this.navigationCalculatorPopup.isVisible()) {
                this.navigationCalculatorPopup.hide();
                keyEvent.preventDefault();
            }
        });

        this.navigationCalculatorPopup.element.addPardusKeyDownListener('plot_key', { code: 13 }, (keyEvent) => { this.#plotPath(keyEvent); });
        this.navigationCalculatorPopup.getCalculateButtonElement().addEventListener('click', (keyEvent) => { this.#plotPath(keyEvent); });
    }
}

;// CONCATENATED MODULE: ./src/classes/pages/main.js


class main_Main {
    constructor(main) {
        this.squad = main.squad;
        this.optionsPrefix = this.squad ? 'squads_' : '';
        this.nav = new Nav(main.nav, this.optionsPrefix, this.squad);
    }
}

;// CONCATENATED MODULE: ./src/classes/pages/msgframe.js


class Msgframe {
    constructor() {
        this.centreTd = document.querySelector('td[align="center"]');

        if (window.parent) {
            window.parent.window.addEventListener('pardus-message', (event) => {
                this.addMessage(event.detail.msg, event.detail.type);
            });
        }
    }

    hasMessage() {
        if (this.centreTd.querySelector('table')) {
            return true;
        }

        return false;
    }

    addMessage(msg, type) {
        let icon; let
            colour;

        switch (type) {
            case 'error':
                icon = 'gnome-error';
                colour = '#FF3300';
                break;
            default:
                icon = 'gnome-info';
                colour = '#CCCCCC';
        }

        this.#setMessage(msg, icon, colour);
    }

    #setMessage(msg, icon, colour) {
        const str = `<table style="background-image:url(${PardusOptionsUtility.getImagePackUrl()}bgmedium.gif);border-style:ridge;border-color:#2b2b51;border-width:2px;" cellspacing="0" cellpadding="0" align="center"><tbody><tr><td><img src="${PardusOptionsUtility.getImagePackUrl()}${icon}.png" alt="" width="32" height="32"></td><td style="padding-left:2px;padding-right:4px;"><font style="font-weight:bold;font-size:13px;" color="${colour}"> ${msg}</font></td></tr></tbody></table>`;
        this.centreTd.innerHTML = str;
    }

    addErrorMessage(msg) {
        this.addMessage(msg, 'error');
    }

    static sendMessage(msg, type) {
        if (window.parent) {
            return window.parent.window.dispatchEvent(new CustomEvent('pardus-message', {
                detail: {
                    msg, type,
                },
            }));
        }

        return window.dispatchEvent(new CustomEvent('pardus-message', { detail: { msg, type } }));
    }
}

;// CONCATENATED MODULE: ./src/classes/pages/options.js




class OptionsPage {
    constructor() {
        this.pardusFlightComputerTab = PardusOptions.addTab({
            heading: 'Flight Computer',
            id: 'flight-computer',
            defaultLabel: 'Route Highlight',
        });

        this.pathHighlightingSubtab = this.pardusFlightComputerTab.addSubTab({
            label: 'Path Highlight',
        });

        this.recordingSubtab = this.pardusFlightComputerTab.addSubTab({
            label: 'Recording',
        });

        this.routeCalculatorSubtab = this.pardusFlightComputerTab.addSubTab({
            label: 'Route Calculator',
        });

        this.squadsSubtab = this.pardusFlightComputerTab.addSubTab({
            label: 'Squads',
        });

        this.coloursSelection = [];
        for (const colour of Tile.colours) {
            this.coloursSelection.push({
                value: colour[1].short_code,
                text: colour[0],
                style: `background-color:rgb(${colour[1].red},${colour[1].green},${colour[1].blue})`,
            });
        }

        this.routeHighlightingOptions(this.pardusFlightComputerTab);
        this.pathHighlightingOptions(this.pathHighlightingSubtab);
        this.recordingOptions(this.recordingSubtab);
        this.routeCalculatorOptions(this.routeCalculatorSubtab);
        this.squadsOptions(this.squadsSubtab);

        this.pardusFlightComputerTab.refreshElement();
    }

    pathHighlightingOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Path Highlighting',
            description: 'Path highlighting shows the path your ship will fly to a particular tile.',
        });

        const pathHighlightingGeneralOptions = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for path highlighting.',
        });

        pathHighlightingGeneralOptions.addBooleanOption({
            variable: 'show_pathing',
            description: 'Enable path highlighting',
            defaultValue: true,
        });

        pathHighlightingGeneralOptions.addSelectOption({
            variable: 'default_path_colour',
            description: 'Colour for path highlighting',
            options: this.coloursSelection,
            inheritStyle: true,
            defaultValue: 'y',
        });
    }

    routeHighlightingOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Route Highlighting',
            description: 'Route highlighting shows a pre-defined route on the nav screen. The route may consist of multiple disjoint and isolated tiles.',
        });

        const routeHighlightingGeneralOptions = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for route highlighting.',
        });

        routeHighlightingGeneralOptions.addBooleanOption({
            variable: 'highlight_tiles',
            description: 'Enable route highlighting',
            defaultValue: true,
            info: {
                title: 'Route Highlighting',
                description: 'Enabling route highlighting will show the route on the nav screen corresponding to the route in the route tiles box. This option does not enable or disable the autopilot functionality.',
            },
        });

        routeHighlightingGeneralOptions.addSelectOption({
            variable: 'default_colour',
            description: 'Default colour for route highlighting',
            options: this.coloursSelection,
            defaultValue: 'g',
            inheritStyle: true,
            info: {
                title: 'Route Highlighting Colour',
                description: 'This option specifies the colour that is used to highlight tiles on the route when no colour is specified alongside the tile id. The colour of individual tiles may be overriden by specifying <code>{tile_id}|{colour}</code> within the route box, where colours are denoted by one of <code>g</code>, <code>r</code>, <code>b</code>, or <code>y</code>.',
            },
        });

        const tileHighlightBox = subtab.addBox({
            heading: 'Route Tiles',
            description: 'This is the list of tiles forming the route to highlight. If you are using autopilot, please ensure the tiles create a continuous path, and are ordered sequentially from one end to the other.',
            resetButton: true,
            presets: 4,
        });

        tileHighlightBox.addTextAreaOption({
            variable: 'tiles_to_highlight',
            defaultValue: '',
            cols: 64,
            rows: 3,
        });

        const autopilotOptions = subtab.addBoxLeft({
            heading: 'Autopilot Options',
            description: 'These are the general options for autopilot. Autopilot will attempt to fly along the route configured in the route tiles box, ensuring that it only travels over tiles contained in the route. If the route configured is not continuous, autopilot will fly to the end of the current continuous section and stop. Autopilot will only work when you are somewhere along the route; one tile off and autopilot will not move.',
        });

        autopilotOptions.addBooleanOption({
            variable: 'enable_autopilot',
            description: 'Enable autopilot',
            defaultValue: true,
            info: {
                title: 'Autopilot',
                description: 'Enabling autopilot will allow you to fly along the route configured in the route tiles box using the key configured for flying. It is recommended to enable route highlighting with the autopilot, so you can visually see the route the autopilot will fly. This option does not enable or disable the route highlighting functionality.',
            },
        });

        autopilotOptions.addBooleanOption({
            variable: 'autopilot_forward',
            description: 'Forward direction',
            defaultValue: true,
            info: {
                title: 'Autopilot Direction',
                description: 'This setting determines the direction autopilot will fly in for the configured route in the route tiles box. Forwards will fly from the first tile to the last tile in the route tiles box, and backwards will fly from the last to the first. This setting can be changed using the configured key to change direction.',
            },
        });

        autopilotOptions.addBooleanOption({
            variable: 'autopilot_check_for_npcs',
            description: 'Check for NPCs',
            defaultValue: true,
            info: {
                title: 'Check for NPCs',
                description: 'This setting determines whether autopilot will check for NPCs on the route, and stop before landing on them. Disabling this option will make the autopilot attempt to fly through NPCs.',
            },
        });

        autopilotOptions.addNumericOption({
            variable: 'autopilot_max_steps',
            description: 'Maximum steps',
            defaultValue: 8,
            min: 1,
            max: 8,
            info: {
                title: 'Autopilot Steps',
                description: 'The maximum number of tiles autopilot will fly over every keypress. The maximum achievable is 8 tiles, allowing you to fly as far as you can see on your nav. The minimum is 1, and will allow you to fly one tile at a time.',
            },
        });

        autopilotOptions.addKeyDownOption({
            variable: 'move_along_path_key',
            description: 'Fly to the next tile',
            defaultValue: {
                code: 70,
                key: 'KeyF',
                description: 'f',
            },
            info: {
                title: 'Autopilot Fly Key',
                description: 'Every press, autopilot will fly along the route configured. Disabling this option will prevent autopilot from working. It is recommended to check this key does not conflict with any other scripts.',
            },
        });

        autopilotOptions.addKeyDownOption({
            variable: 'toggle_autopilot_direction',
            description: 'Change direction',
            defaultValue: {
                code: 67,
                key: 'KeyC',
                description: 'c',
            },
            info: {
                title: 'Change Direction Key',
                description: 'Changes the direction autopilot will fly in from the nav screen. Disabling this option will require you to come into this settings page and change the direction setting manually. It is recommended to check this key does not conflict with any other scripts.',
            },
        });

        autopilotOptions.addKeyDownOption({
            variable: 'modify_autopilot_route',
            description: 'Modify route',
            defaultValue: {
                code: 77,
                key: 'KeyM',
                description: 'm',
            },
            info: {
                title: 'Modify Route Key',
                description: 'Temporarily adjust the route, and press the key a second time to stop.',
            },
        });

        const mapperBox = subtab.addBoxBottom({
            heading: 'Mapper',
            description: 'The links below let you view the currently-stored route.',
        });

        mapperBox.innerHtml = OptionsPage.getMapperBoxHtml();

        tileHighlightBox.addEventListener('save', () => {
            mapperBox.innerHtml = OptionsPage.getMapperBoxHtml();
            mapperBox.refreshElement();
        });

        tileHighlightBox.addEventListener('preset-load', () => {
            mapperBox.innerHtml = OptionsPage.getMapperBoxHtml();
            mapperBox.refreshElement();
        });

        tileHighlightBox.addEventListener('reset', () => {
            mapperBox.innerHtml = OptionsPage.getMapperBoxHtml();
            mapperBox.refreshElement();
        });
    }

    routeCalculatorOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Route Highlighting',
            description: 'Route calculator will calculator an AP-efficient route from your current location to your target destination. Using the calculator will require the script accessing non-Pardus websites, which perform the calculations remotely. For more fine-grained control, please use <a href="https://tro.xcom-alliance.info/path_calculator.html" target="_blank">https://tro.xcom-alliance.info/path_calculator.html</a>.',
        });

        const routeCalculatorGeneralOptions = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for the route calculator.',
        });

        routeCalculatorGeneralOptions.addKeyDownOption({
            variable: 'open_navigation_key',
            description: 'Open navigation box',
            defaultValue: {
                code: 68,
                key: 'KeyD',
                description: 'd',
            },
            info: {
                title: 'Navigation Box',
                description: 'This button opens the navigation box. It can be closed by pressing the escape key, or by clicking the cancel button. Disabling this option effectively disables the nagivation calculator.',
            },
        });

        routeCalculatorGeneralOptions.addNumericOption({
            variable: 'navigation_number_of_favourites',
            description: 'Number of favourites',
            defaultValue: 4,
            min: 1,
            max: 10,
        });
    }

    squadsOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Sqauds Route Highlighting',
            description: 'Squads route highlighting shows a pre-defined route on the nav screen for squads. The route may consist of multiple disjoint and isolated tiles.',
        });

        const routeHighlightingGeneralOptions = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for route highlighting.',
        });

        routeHighlightingGeneralOptions.addBooleanOption({
            variable: 'squads_highlight_tiles',
            description: 'Enable sqauds route highlighting',
            defaultValue: true,
        });

        routeHighlightingGeneralOptions.addSelectOption({
            variable: 'sqauds_default_colour',
            description: 'Default colour for sqauds route highlighting',
            options: this.coloursSelection,
            defaultValue: 'g',
            inheritStyle: true,
            info: {
                title: 'Route Highlighting Colour',
                description: 'This option specifies the colour that is used to highlight tiles on the route when no colour is specified alongside the tile id. The colour of individual tiles may be overriden by specifying <code>{tile_id}|{colour}</code> within the route box, where colours are denoted by one of <code>g</code>, <code>r</code>, <code>b</code>, or <code>y</code>.',
            },
        });

        const tileHighlightBox = subtab.addBox({
            heading: 'Route Tiles',
            description: 'This is the list of tiles forming the route to highlight.',
            resetButton: true,
            presets: 4,
        });

        tileHighlightBox.addTextAreaOption({
            variable: 'squads_tiles_to_highlight',
            defaultValue: '',
            cols: 64,
            rows: 3,
        });

        const autopilotOptions = subtab.addBoxLeft({
            heading: 'Autopilot Options',
            description: 'These are the general options for autopilot. Autopilot will attempt to fly along the route configured in the route tiles box, ensuring that it only travels over tiles contained in the route. If the route configured is not continuous, autopilot will fly to the end of the current continuous section and stop. Autopilot will only work when you are somewhere along the route; one tile off and autopilot will not move.',
        });

        autopilotOptions.addBooleanOption({
            variable: 'squads_enable_autopilot',
            description: 'Enable autopilot',
            defaultValue: true,
            info: {
                title: 'Autopilot',
                description: 'Enabling autopilot will allow you to fly along the route configured in the route tiles box using the key configured for flying. It is recommended to enable route highlighting with the autopilot, so you can visually see the route the autopilot will fly. This option does not enable or disable the route highlighting functionality.',
            },
        });

        autopilotOptions.addBooleanOption({
            variable: 'squads_autopilot_forward',
            description: 'Forward direction',
            defaultValue: true,
            info: {
                title: 'Autopilot Direction',
                description: 'This setting determines the direction autopilot will fly in for the configured route in the route tiles box. Forwards will fly from the first tile to the last tile in the route tiles box, and backwards will fly from the last to the first. This setting can be changed using the configured key to change direction.',
            },
        });

        autopilotOptions.addNumericOption({
            variable: 'squads_autopilot_max_steps',
            description: 'Maximum steps',
            defaultValue: 8,
            min: 1,
            max: 8,
            info: {
                title: 'Autopilot Steps',
                description: 'The maximum number of tiles autopilot will fly over every keypress. The maximum achievable is 8 tiles, allowing you to fly as far as you can see on your nav. The minimum is 1, and will allow you to fly one tile at a time.',
            },
        });

        const mapperBox = subtab.addBoxBottom({
            heading: 'Mapper',
            description: 'The links below let you view the currently-stored route.',
        });

        mapperBox.innerHtml = OptionsPage.getMapperBoxHtml(true);

        tileHighlightBox.addEventListener('save', () => {
            mapperBox.innerHtml = OptionsPage.getMapperBoxHtml(true);
            mapperBox.refreshElement();
        });

        tileHighlightBox.addEventListener('reset', () => {
            mapperBox.innerHtml = OptionsPage.getMapperBoxHtml(true);
            mapperBox.refreshElement();
        });
    }

    recordingOptions(subtab) {
        subtab.addBoxTop({
            heading: 'Recording',
            description: 'Recording allows you to record the all the tiles you fly on and over, and provides the list of tile ids for sharing with others.',
        });

        const recordingGeneralOptions = subtab.addBox({
            heading: 'General Options',
            description: 'These are the general options for recording routes.',
        });

        recordingGeneralOptions.addBooleanOption({
            variable: 'colour_recorded_tiles',
            description: 'Highlight recorded tiles as you fly',
            defaultValue: true,
        });

        recordingGeneralOptions.addSelectOption({
            variable: 'recording_mode',
            description: 'Record tiles',
            options: [
                {
                    value: 'all',
                    text: 'All tiles',
                    default: true,
                },
                {
                    value: 'bad',
                    text: 'Bad tiles only',
                },
                {
                    value: 'good',
                    text: 'Good tiles only',
                },
            ],
        });

        recordingGeneralOptions.addSelectOption({
            variable: 'recorded_tile_colour',
            description: 'Colour to highlight recorded tiles',
            options: this.coloursSelection,
            defaultValue: 'c',
            inheritStyle: true,
        });

        recordingGeneralOptions.addSelectOption({
            variable: 'bad_recorded_tile_colour',
            description: 'Colour to highlight bad tiles',
            options: this.coloursSelection,
            defaultValue: 'r',
            inheritStyle: true,
            info: {
                title: 'Bad Tile Recording and Highlighting',
                description: 'This option enables recording of tiles when you encounter an NPC, colouring them differently to normal recorded tiles, and saving them separately.',
            },
        });

        recordingGeneralOptions.addKeyDownOption({
            variable: 'toggle_recording_keypress',
            description: 'Start/stop recording',
            defaultValue: {
                code: 82,
                key: 'KeyR',
                description: 'r',
            },
        });

        const recordedOutputBox = subtab.addBox({
            heading: 'Recorded Tiles',
            description: 'The tiles that have been recorded.',
        });

        recordedOutputBox.setHTML(OptionsPage.getRecordedOutputBoxHtml());
        recordedOutputBox.addAfterRefreshHook(() => { this.recordedOutputAfterRefresh(recordedOutputBox); });

        recordingGeneralOptions.addEventListener('save', () => {
            recordedOutputBox.setHTML(OptionsPage.getRecordedOutputBoxHtml());
            recordedOutputBox.refreshElement();
        });

        const recordingToggleBox = subtab.addBox({
            heading: 'Record',
            description: 'Start and stop recording.',
        });

        recordingToggleBox.setHTML(OptionsPage.getRecordingToggleBoxHtml());
        recordingToggleBox.addAfterRefreshHook(() => { this.recordingToggleAfterRefresh(recordingToggleBox); });
    }

    static getRecordingToggleBoxHtml() {
        const offset = '-2px';
        const offBlob = `<img src="data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0B%00%00%00%0D%08%03%00%00%00H%2Bd%09%00%00%00lPLTE%FF%FF%FF%D3%D3%D3%BB%BB%BB%9B%9B%9B%91%91%91%90%90%90%82%82%82%80%80%80~~~%7D%7D%7DuuullljjjgggbbbaaaUUUSSSMMMGGGDDD%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%2F%E3%EE%3C%00%00%00%16tRNS%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%00%01%D2%C0%E4%00%00%00_IDATx%DAT%8DI%0E%C0%20%0C%03%034%10%F6%00%E1%FF_-%B4%87R%9F%AC%915%86%F9%05%FE%5Dz%E3%D6e%F7%C1%25%C5TxL%10%CE%81%9C%0F%99%05z%0D%16%0D%DAP%3A%B4D%A8%95FJ%0D8%3A%A3%40%19%17yq%BF%F9%B5%F9%B9%7F%3D%F4x%96%BF.%7F%DD%FE%E3%F7%16%60%00%8E%9C%07%C8%8B%B1%7B%ED%00%00%00%00IEND%AEB%60%82" style="vertical-align:${offset};" alt="Off bloc created by Takius Stargazer" border="0">`;
        const onBlob = `<img src="data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0B%00%00%00%0D%08%03%00%00%00H%2Bd%09%00%00%00%7BPLTE%EF%00%01%DD%00%01%C5%00%01%B4%00%01%9A%00%01%95%00%01%88%00%01%7D%00%01%F9%00%00%F4%00%00%F4%01%00%EF%01%00%EE%00%00%DD%00%00%DD%01%00%CB%00%00%CB%01%00%C5%00%00%C5%01%00%BF%00%00%B4%00%00%B4%01%00%B3%00%00%9A%00%00%9A%01%00%99%00%00%95%00%00%88%00%00%88%01%00%7D%00%00%7D%01%00w%00%00v%00%00%FF%17%17%FF%18%18%FF--%FFpp%FFqq%FF%A3%A3%FF%FF%FF%FF%FF%FF%D1%8Fv%E3%00%00%00)tRNS%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%FF%00R%F4%20%87%00%00%00wIDATx%DAT%8D%D1%0E%C2%20%14C%AB%E2%1C2D%C0%E1%B8%E8%04%99%C8%FF%7F%A1%98%18%8D%7D%3Ai%9A%1E%D4_%F0%CF1%D0%99.%F1%CDW%B6Y%2B%7D%F2%BB%8A%C8%AC%04%1F%A4%9Dn%08N%F6)%A7%FE0v%20%23%D2R%96%24%0C%C1%1Fy.%CF%92%F7j%02%E9%A1%F5%8F%BB%D0%F4%DD%CB1%20z%BB%12%1C%ED'%A2%CE%DE%19%A5%9D%9F%3F%5E%B6%ED%9A%F7%25%C0%00%C0~%0Ek%A4Y%8A%96%00%00%00%00IEND%AEB%60%82" style="vertical-align:${offset};" alt="On blob created by Takius Stargazer" border="0">`;

        const recordButtonId = 'pardus-flight-computer-record-button';

        const recording = PardusOptionsUtility.getVariableValue('recording', false);

        let recordingStatus = `${offBlob}&nbsp;Not recording`;
        let buttonText = 'Start recording';

        if (recording) {
            recordingStatus = `${onBlob}&nbsp;<font color='red'>Recording</font>`;
            buttonText = 'Stop recording';
        }

        return `<tr><td><div><table width="100%"><tbody><tr><td width="1%" style="white-space: nowrap;">Recording status:</td><td><div id="pardus-flight-computer-recording-status">${recordingStatus}</div></td><td align="right"><input type="button" value="${buttonText}" id="${recordButtonId}"></td></tr></tbody></table></div></td></tr>`;
    }

    static getRecordedOutputBoxHtml() {
        let recordingOutput = PardusOptionsUtility.getVariableValue('recorded_tiles', []).concat(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []).map((x) => `${x}|${PardusOptionsUtility.getVariableValue('bad_recorded_tile_colour', 'r')}`)).join(',');

        if (recordingOutput === '') {
            recordingOutput = 'No tiles recorded';
        }

        return `<tr><td><div><table width="100%"><tbody><tr><td colspan="3"><pre id="pardus-flight-computer-recording-output" style="padding: 5px; border-style: dashed; border-color: yellow; border-width: thin; white-space: pre-wrap; word-wrap: anywhere;">${recordingOutput}</pre></td></tr><tr><td align="right" colspan="3"><input value="Clear" id="pardus-flight-computer-clear-recording-output" type="button"></td></tr></tbody></table></div></td></tr>`;
    }

    recordingToggleAfterRefresh(recordingToggleBox) {
        const recordButton = document.getElementById('pardus-flight-computer-record-button');

        recordButton.addEventListener('click', () => {
            const recording = PardusOptionsUtility.getVariableValue('recording', false);
            PardusOptionsUtility.setVariableValue('recording', !recording);
            recordingToggleBox.setHTML(OptionsPage.getRecordingToggleBoxHtml());
            recordingToggleBox.refreshElement();
        });
    }

    recordedOutputAfterRefresh(recordedOutputBox) {
        const clearButton = document.getElementById('pardus-flight-computer-clear-recording-output');

        clearButton.addEventListener('click', () => {
            PardusOptionsUtility.setVariableValue('recorded_tiles', []);
            PardusOptionsUtility.setVariableValue('bad_recorded_tiles', []);
            PardusOptionsUtility.setVariableValue('expected_route', []);
            recordedOutputBox.setHTML(OptionsPage.getRecordedOutputBoxHtml());
            recordedOutputBox.refreshElement();
        });
    }

    static getMapperBoxHtml(squads = false) {
        const colouredTilesToHighlight = PardusOptionsUtility.getVariableValue(squads ? 'squads_tiles_to_highlight' : 'tiles_to_highlight', '').split(',');
        const tilesToHighlight = [];

        for (const tile of colouredTilesToHighlight) {
            if (tile) {
                tilesToHighlight.push(tile.split('|')[0]);
            }
        }

        const mapperUrls = mapperUrlsFromRoute(tilesToHighlight);

        let html = '<tr><td><div><table width="100%"><tbody>';

        for (const sector of mapperUrls) {
            html += `<tr><td>${sector[0]}</td><td style="word-wrap: anywhere;"><a href="${sector[1]}" target="_blank">${sector[1]}</a></td></tr>`;
        }

        if (mapperUrls.size === 0) {
            html += '<tr><td>No sectors detected in the currently-stored route.</td></tr>';
        }

        html += '</tbody></table></div></td></tr>';

        return html;
    }
}

;// CONCATENATED MODULE: ./src/classes/pages/ship2opponent-combat.js



/* global userloc */

class Ship2OpponentCombat {
    #extractRegex = /([\w\-\d\s]*)\s\[(\d{1,3}),(\d{1,3})\]/;

    constructor() {
        const currentLocation = document.querySelector('b').innerText;

        const match = currentLocation.match(this.#extractRegex);
        const matchedTileId = Sectors.getTileIdFromSectorAndCoords(match[1], match[2], match[3]);

        this.tileId = matchedTileId;
        this.#addRecording();
        this.#addRetreatHandler();
    }

    #addRetreatHandler() {
        document.getElementsByName('retreat')[0].addEventListener('click', () => { this.#retreatHandler() });
    }

    #retreatHandler() {
        const currentPosition = userloc.toString();
        const modifyRouteRecording = PardusOptionsUtility.getVariableValue(`modify_route`, false);
        const modifiedRoute = PardusOptionsUtility.getVariableValue('modified_route', []);

        if (modifyRouteRecording && (modifiedRoute[modifiedRoute.length - 1] === currentPosition)) {
            modifiedRoute.pop();
            PardusOptionsUtility.setVariableValue('modified_route', modifiedRoute);
        }
    }

    #addRecording() {
        const previousTileId = PardusOptionsUtility.getVariableValue('last_tile_id', -1);
        const expectedRoute = PardusOptionsUtility.getVariableValue('expected_route', []);
        const currentPosition = userloc.toString();

        const recordingMode = PardusOptionsUtility.getVariableValue('recording_mode', 'all');
        const recording = PardusOptionsUtility.getVariableValue('recording', false);
        const modifyRouteRecording = PardusOptionsUtility.getVariableValue(`modify_route`, false);

        // console.log(`previousTileId: ${previousTileId}`);
        // console.log(`expectedRoute: ${expectedRoute}`);
        // console.log(`currentPosition: ${currentPosition}`);
        // console.log(`this.tileId: ${this.tileId}`);

        if (previousTileId !== -1) {
            if (recording || modifyRouteRecording) {
                const recordedTiles = new Set(PardusOptionsUtility.getVariableValue('recorded_tiles', []));
                const badRecordedTiles = new Set(PardusOptionsUtility.getVariableValue('bad_recorded_tiles', []));
                const modifiedRoute = PardusOptionsUtility.getVariableValue('modified_route', []);

                // console.log(`recordedTiles: ${recordedTiles}`);
                // console.log(`badRecordedTiles: ${badRecordedTiles}`);

                if (expectedRoute.includes(currentPosition)) {
                    for (const flownTile of expectedRoute) {
                        if (flownTile === currentPosition) {
                            break;
                        }

                        if (recording && (recordingMode === 'all' || recordingMode === 'good')) {
                            // console.log(`Adding ${flownTile} to recordedTiles`)
                            recordedTiles.add(flownTile);
                        }

                        // If we are modifying the route, check to see if we've already added the tile
                        // (which may happen using partial refresh), and if not, add it.
                        if (modifyRouteRecording && !modifiedRoute.includes(flownTile)) {
                            modifiedRoute.push(flownTile);
                        }
                    }

                    if (recording && (recordingMode === 'all' || recordingMode === 'bad')) {
                        // console.log(`Adding ${currentPosition} to badRecordedTiles`)
                        badRecordedTiles.add(currentPosition);

                        // Make sure it isn't recorded as a good tile at the same time
                        recordedTiles.delete(currentPosition);
                    }
                }
                // console.log(`Setting bad_recorded_tiles to '${Array.from(badRecordedTiles)}'`);
                PardusOptionsUtility.setVariableValue('bad_recorded_tiles', Array.from(badRecordedTiles));
                PardusOptionsUtility.setVariableValue('recorded_tiles', Array.from(recordedTiles));
                PardusOptionsUtility.setVariableValue('modified_route', modifiedRoute);
            }
        }

        PardusOptionsUtility.setVariableValue('expected_route', []);
        PardusOptionsUtility.setVariableValue('last_tile_id', this.tileId);
    }
}

;// CONCATENATED MODULE: ./src/classes/pages/index.js





;// CONCATENATED MODULE: ./src/index.js



class PardusFlightComputer {
    constructor() {
        const pardus = new PardusLibrary();

        switch (document.location.pathname) {
            case '/main.php':
                new main_Main(pardus.currentPage);
                break;
            case '/options.php':
                new OptionsPage();
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

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});