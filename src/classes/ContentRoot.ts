'use strict';

import {
    Block,
    Div
} from '@src/classes';

export class ContentRoot extends Div {

    constructor(parent: Block) {

        super('content-root', parent);
    }
}