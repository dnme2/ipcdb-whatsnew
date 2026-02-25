'use strict';

import { Block, ClientLocation, Tools } from '@src/classes';

export class Button extends Block {

    private down: boolean = false;

    constructor(attributes?: any, parent?: Block) {
        
        super('button', attributes, parent);

        this.onNative('pointerdown', this.onPointerDown.bind(this));
        
        ClientLocation.get().block.onNative('pointerup', this.onPointerUp.bind(this));
    }

    /*
    **
    **
    */
    private async onPointerDown() : Promise<void> {

        this.down = true;

        this.setData('pressed', 1);
    }

    /*
    **
    **
    */
    private async onPointerUp() : Promise<void> {

        if (!this.down)
            return;

        this.down = false;

        this.setData('pressed', -1);
    }
}