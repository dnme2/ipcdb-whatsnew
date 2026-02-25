'use strict';

import {
    Div,
    ClientLocation,
    Tools
} from '@src/classes';

export class Above extends Div {

    protected closeZone: Div;
    protected content: Div;

    constructor(protected x: number, protected y: number) {
        
        super('above', ClientLocation.get().block);

        this.closeZone = new Div('close-zone', this).onNative('click', this.hide.bind(this));

        this.content = new Div('content', this).setStyles({
            left: '0px',
            top: '0px'
        });
    }

    /*
    **
    **
    */
    public async show() : Promise<void> {

        await Tools.sleep(50);
        
        let x = this.x;
        let y = this.y;

        if (x + this.content.element.offsetWidth >= document.body.scrollWidth) {
            x -= this.content.element.offsetWidth;
            if (x < 0)
                x = 20;
        }

        if (y + this.content.element.offsetHeight >= document.body.scrollHeight) {
            y -= this.content.element.offsetHeight;
            if (y < 0)
                y = 20;
        }
    
        this.content.setStyles({
            left: `${x}px`,
            top: `${y}px`
        });

        this.setData('displayed', 1);
    }

    /*
    **
    **
    */
    public async hide() : Promise<void> {

        this.emit('hide');
        
        this.setData('displayed', 0);

        await Tools.sleep(250);
        
        this.delete();
    }

    /*
    **
    **
    */
    public getcontent() : Div {

        return this.content;
    }
}