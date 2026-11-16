const ENTRY_SEP = ',';
const SEGMENT_SEP = '|';
const STOP_FLAG = 's';

export default class Tilestring {
    #ids;
    #annotations;
    #defaultColour;

    constructor(input = '', defaultColour = 'g') {
        this.#defaultColour = defaultColour;
        this.#ids = [];
        this.#annotations = new Map();

        if (input === '') {
            return;
        }

        for (const entry of input.split(ENTRY_SEP)) {
            const parts = entry.split(SEGMENT_SEP);
            const id = parts[0];
            const colour = parts[1] !== undefined && parts[1] !== '' ? parts[1] : defaultColour;
            const flags = parts[2] ?? '';
            this.#ids.push(id);
            this.#annotations.set(id, { colour, flags });
        }
    }

    static #from(ids, annotations, defaultColour) {
        const ts = new Tilestring('', defaultColour);
        ts.#ids = [...ids];
        for (const id of ids) {
            if (ts.#annotations.has(id)) {
                continue;
            }
            const a = annotations.get(id) ?? { colour: defaultColour, flags: '' };
            ts.#annotations.set(id, { colour: a.colour, flags: a.flags });
        }
        return ts;
    }

    get length() {
        return this.#ids.length;
    }

    get ids() {
        return [...this.#ids];
    }

    get colourMap() {
        const map = new Map();
        for (const id of this.#ids) {
            map.set(id, this.#annotations.get(id).colour);
        }
        return map;
    }

    get stopIds() {
        const set = new Set();
        for (const id of this.#ids) {
            if (this.#annotations.get(id).flags.includes(STOP_FLAG)) {
                set.add(id);
            }
        }
        return set;
    }

    has(id) {
        return this.#annotations.has(id);
    }

    indexOf(id) {
        return this.#ids.indexOf(id);
    }

    colourFor(id) {
        return this.#annotations.get(id)?.colour;
    }

    isStop(id) {
        return this.#annotations.get(id)?.flags.includes(STOP_FLAG) ?? false;
    }

    toString() {
        return this.#ids.map((id) => {
            const { colour, flags } = this.#annotations.get(id);
            const colourSegment = colour === this.#defaultColour ? '' : colour;
            if (flags) {
                return `${id}|${colourSegment}|${flags}`;
            }
            if (colourSegment) {
                return `${id}|${colourSegment}`;
            }
            return id;
        }).join(ENTRY_SEP);
    }

    reverse() {
        return Tilestring.#from([...this.#ids].reverse(), this.#annotations, this.#defaultColour);
    }

    spliceSegment(startId, endId, newIds) {
        const startIdx = this.#ids.indexOf(startId);
        const endIdx = this.#ids.indexOf(endId);
        if (startIdx < 0 || endIdx < 0) {
            return null;
        }
        const lo = Math.min(startIdx, endIdx);
        const hi = Math.max(startIdx, endIdx);
        const ordered = startIdx <= endIdx ? [...newIds] : [...newIds].reverse();
        const newOrderedIds = [
            ...this.#ids.slice(0, lo),
            ...ordered,
            ...this.#ids.slice(hi + 1),
        ];

        const preserved = new Map();
        for (const id of this.#ids.slice(0, lo)) {
            preserved.set(id, { ...this.#annotations.get(id) });
        }
        for (const id of this.#ids.slice(hi + 1)) {
            preserved.set(id, { ...this.#annotations.get(id) });
        }
        for (const id of ordered) {
            if (!preserved.has(id)) {
                preserved.set(id, { colour: this.#defaultColour, flags: '' });
            }
        }

        return Tilestring.#from(newOrderedIds, preserved, this.#defaultColour);
    }
}
