'use strict';

import {
    Block,
    Div
} from '@src/classes';

export class Logo extends Div {

    constructor(parent: Block) {

        super('logo', parent);

        new Div('k', this);
        new Div('a1', this);
        new Div('n', this);
        new Div('s', this);
        new Div('o', this);
        new Div('a2', this);
    }
}