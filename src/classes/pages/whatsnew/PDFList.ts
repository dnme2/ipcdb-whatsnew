'use strict';

import {
    Block,
    Div,
    SpinnerButton
} from '@src/classes';

export class PDFList extends Div {

    private buttons: SpinnerButton[] = [];

    constructor(parent: Block) {

        super('pdf-list', parent);
        
        this.draw();
    }

    /*
    **
    **
    */
    private async draw() : Promise<void> {

        const response = await fetch('/assets/json/whatsnew-files.json');
        const list = await response.json();

        for (const name of list) {

            const button = new SpinnerButton(this);
            button.publicData.name = name;

            button.hasIconAndText();
            button.setIconText('deployed_code_update');
            button.setText(name.replaceAll('_', ' ').replaceAll('.pdf', ''));

            button.onNative('click', () => {
                
                this.select(name);

                this.emit('url', `/assets/whatsnew-files/${name}`);
            });

            this.buttons.push(button);
        }
    }

    /*
    **
    **
    */
    private select(name: string) : void {

        for (const button of this.buttons)
            button.setData('selected', button.publicData.name === name ? 1 : 0);
    }
}