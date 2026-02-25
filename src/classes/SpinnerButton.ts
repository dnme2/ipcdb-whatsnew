'use strict';

import {
    Block,
    Div,
    Button,
    Spinner
} from '@src/classes';

export class SpinnerButton extends Button {

    private label: Div;
    
    private icon: Block;
    private text: Div;

    constructor(parent?: Block) {

        super({
            class: 'spinner-button',
            type: 'button'
        }, parent);
        
        this.label = new Div('label', this);

        this.icon = new Block('span', 'icon', this.label);
        this.text = new Block('span', 'text', this.label);

        new Spinner(this);
    }

    /*
    **
    **
    */
    public setIconText(text: string) : void {
        
        this.icon.write(text);
    }

    /*
    **
    **
    */
    public setText(text: string) : void {

        this.text.write(text);
    }

    /*
    **
    **
    */
    public hasIconAndText() : void {

        this.label.setData('has-icon-and-text', 1);
    }

    /*
    **
    **
    */
    public load() : void {

        this.setData('loading', 1);
    }

    /*
    **
    **
    */
    public unload() : void {

        this.setData('loading', 0);
    }

    /*
    **
    **
    */
    public enable() : void {

        this.setData('enabled', 1);
    }

    /*
    **
    **
    */
    public disable() : void {
        
       this.setData('enabled', 0);
    }
}