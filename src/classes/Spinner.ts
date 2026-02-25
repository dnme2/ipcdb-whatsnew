'use strict';

import {
    Block,
    Div
} from '@src/classes';

export class Spinner extends Div {

    constructor(parent: Block) {

        super('spinner', parent);

        this.html(`
            <svg viewBox="0 0 50 50" aria-hidden="true">
                <circle cx="25" cy="25" r="19" pathLength="100"></circle>
            </svg>`);
    }
}