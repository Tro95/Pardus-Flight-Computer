export default class Tile {
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
            this.element.children[0].addEventListener(event, func, options);

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
