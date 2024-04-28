(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  PardusLibrary: () => (/* reexport */ PardusLibrary),
  Sectors: () => (/* reexport */ Sectors),
  Tile: () => (/* reexport */ Tile)
});

;// CONCATENATED MODULE: ./src/classes/abstract/abstract-page.js
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

;// CONCATENATED MODULE: ./src/classes/main/tile.js
class Tile {
    #x;
    #y;
    #tile_id;
    #virtual_tile;

    static colours = {
        'Green': {
            'red': 0,
            'green': 128,
            'blue': 0,
            'short_code': 'g'
        },
        'Blue': {
            'red': 0,
            'green': 0,
            'blue': 128,
            'short_code': 'b',
        },
        'Red': {
            'red': 128,
            'green': 0,
            'blue': 0,
            'short_code': 'r'
        },
        'Yellow': {
            'red': 128,
            'green': 128,
            'blue': 0,
            'short_code': 'y'
        },
        'Cyan': {
            'red': 0,
            'green': 128,
            'blue': 128,
            'short_code': 'c'
        },
        'Magenta': {
            'red': 128,
            'green': 0,
            'blue': 128,
            'short_code': 'm'
        },
        'Silver': {
            'red': 128,
            'green': 128,
            'blue': 128,
            'short_code': 's'
        }
    };

    constructor(element, x, y, tile_id = null, virtual_tile = false) {
        this.#x = x;
        this.#y = y;
        this.highlight_string = '';
        this.highlights = [];
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

            // Get the tile id
            if (this.element.classList.contains('navShip') && this.element.querySelector('#thisShip')) {
                this.#tile_id = this.getUserloc();
            } else if (this.element.children.length > 0 && this.element.children[0].tagName === 'A') {

                const child_element = this.element.children[0];

                // Can we navigate to the tile?
                if ((!child_element.hasAttribute('onclick') || child_element.getAttribute('onclick').startsWith('warp')) && (!child_element.hasAttribute('_onclick') || child_element.getAttribute('_onclick').startsWith('warp'))) {
                    this.#tile_id = this.getUserloc();

                    if ((child_element.hasAttribute('onclick') && child_element.getAttribute('onclick').startsWith('warp')) || (child_element.hasAttribute('_onclick') && child_element.getAttribute('_onclick').startsWith('warp'))) {
                        this.type = 'wormhole';
                    }
                } else if (child_element.hasAttribute('onclick') && child_element.getAttribute('onclick').startsWith('nav')) {
                    this.#tile_id = child_element.getAttribute('onclick').match(/^[^\d]*(\d*)[^\d]*$/)[1];

                    if (this.element.classList.contains('navYhole')) {
                        this.type = 'y-hole';
                    }

                    if (this.element.classList.contains('navXhole')) {
                        this.type = 'x-hole';
                    }
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
        if (!this.isVirtualTile() && this.element && this.element.children.length > 0 && this.element.children[0].getAttribute('onclick') && this.element.children[0].getAttribute('onclick').startsWith('nav') && this.isClickable()) {
            return true;
        }

        if (!this.isVirtualTile() && this.element && this.element.children.length > 0 && this.element.children[0].getAttribute('_onclick') && this.element.children[0].getAttribute('_onclick').startsWith('nav') && this.isClickable()) {
            return true;
        }

        return false;
    }

    isCentreTile() {
        return this.is_centre_tile;
    }

    isHighlighted() {
        if (this.highlights.length > 0) {
            return true;
        }

        return false;
    }

    addEventListener(event, func) {
        if (this.isNavigatable()) {
            this.element.children[0].addEventListener(event, func);
        }
    }

    highlight(highlight_colour = 'g') {
        if (this.isVirtualTile()) {
            return false;
        }

        for (const colour in this.constructor.colours) {
            if (this.constructor.colours[colour].short_code === highlight_colour) {
                this.highlights.push({
                    red: this.constructor.colours[colour].red,
                    green: this.constructor.colours[colour].green,
                    blue: this.constructor.colours[colour].blue
                });
                break;
            }
        }

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

    removeHighlight(highlight_colour = 'g') {
        if (this.isVirtualTile()) {
            return false;
        }

        const colour_to_remove = {
            red: 0,
            green: 0,
            blue: 0
        }

        for (const colour in this.constructor.colours) {
            if (this.constructor.colours[colour].short_code === highlight_colour) {
                colour_to_remove.red = this.constructor.colours[colour].red;
                colour_to_remove.green = this.constructor.colours[colour].green;
                colour_to_remove.blue = this.constructor.colours[colour].blue;
                break;
            }
        }

        for (const index in this.highlights) {
            if (this.highlights[index].red === colour_to_remove.red && this.highlights[index].green === colour_to_remove.green && this.highlights[index].blue === colour_to_remove.blue) {
                this.highlights.splice(index, 1);
            }
        }

        this.#refreshHighlightStatus();
    }

    clearHighlight() {
        this.#clearAllHighlighting();
    }

    #refreshHighlightStatus() {
        if (this.isVirtualTile()) {
            return false;
        }

        if (this.highlights.length === 0) {
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

        if (this.background_image) {
            this.element.style.backgroundImage = this.background_image;
        } else {
            this.element.style.backgroundColor = ''
            this.element.firstElementChild.style.opacity = 1;
        }

        return true;
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

        for (const colour of this.highlights) {
            total_red += colour.red;
            total_green += colour.green;
            total_blue += colour.blue;

            if (colour.red > 0) {
                number_red += 1;
            }

            if (colour.green > 0) {
                number_green += 1;
            }

            if (colour.blue > 0) {
                number_blue += 1;
            }
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

;// CONCATENATED MODULE: ./src/classes/pardus/sector.js
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

    getTileByCoords(x, y) {
        if (Number(x) < 0 || Number(y) < 0 || Number(x) >= this.#columns || Number(y) >= this.#rows) {
            return -1;
        }

        return Number(this.#id_start) + Number(x) * Number(this.#rows) + Number(y);
    }
}

;// CONCATENATED MODULE: ./src/data/sectors.js
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

;// CONCATENATED MODULE: ./src/classes/static/sectors.js



const Sectors = new Map();

for (const sector of Object.keys(sectorMapDataObj)) {
    Sectors.set(sector, new Sector(sector, sectorMapDataObj[sector].start, sectorMapDataObj[sector].cols, sectorMapDataObj[sector].rows));
}

Sectors.getSectorForTile = function(tile_id) { 
    for (const sector of this) {
        if (sector.has(tile_id)) {
            return sector;
        }
    }
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

;// CONCATENATED MODULE: ./src/classes/main/nav.js



class NavArea {

    #squad = false;
    #navElement;
    #height;
    #width;
    #grid = [];
    #centreTile;
    #tileHighlights = new Map();

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

    set tileHighlights(tiles_to_highlight) {
        this.#tileHighlights = tiles_to_highlight;
        this.#refreshHighlightedTiles();
    }

    #clearHighlightedTiles() {
        for (const tile of this.clickableTiles()) {
            tile.clearHighlight();
        }
    }

    #refreshHighlightedTiles() {
        for (const tile of this.clickableTiles()) {
            if (this.#tileHighlights.has(tile.id)) {
                tile.highlight(this.#tileHighlights.get(tile.id));
            } else {
                tile.clearHighlight();
            }
        }
    }

    refresh() {
        this.#beforeRefresh();
        this.#reload();
        this.#refreshHighlightedTiles();
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
            const sector_obj = Sectors.getSectorForTile(reference.id);
            return new Tile(null, x, y, Number(reference.id) + (x - reference.x) + ((y - reference.y) * sector_obj.cols), true);
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

;// CONCATENATED MODULE: ./src/classes/pages/main.js



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
        const navElement = mainElement ? document.getElementById('tdSpaceChart').getElementsByTagName('table')[0] : document.querySelectorAll('table td[valign="top"]')[1];

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

;// CONCATENATED MODULE: ./src/classes/pages/logout.js


class Logout extends AbstractPage {
    constructor() {
        super('/logout.php');
    }
}

;// CONCATENATED MODULE: ./src/classes/pages/index.js


;// CONCATENATED MODULE: ./src/classes/pardus-library.js


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
;// CONCATENATED MODULE: ./src/index.js



/******/ 	return __webpack_exports__;
/******/ })()
;
});