'use strict';

import { Emitter } from '@src/classes';

import WebFont = require('webfontloader');

export class FontManager extends Emitter {

    constructor(private families: string[]) {

        super();

        this.load();
    }

    /*
    **
    **
    */
    public load() : void {

        WebFont.load({
            google: {
                families: this.families
            },
            custom: {
                families: ['Material Symbols Rounded'],
                urls: [
                    'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:FILL@1'
                ]
            },
            classes: false,
            active: this.onLoad.bind(this),
            inactive: this.onLoad.bind(this)
        });
    }

    /*
    **
    **
    */
    private onLoad() : void {

        this.emit('load');
    }
}