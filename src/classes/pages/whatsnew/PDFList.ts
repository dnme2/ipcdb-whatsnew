'use strict';

import {
    Block,
    Div,
    SpinnerButton,
    Tools
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
                this.select(button);
            });

            this.buttons.push(button);
        }

        await Tools.sleep(10);
        this.setData('displayed', 1);
    }

    /*
    **
    **
    */
    private select(button_: SpinnerButton) : void {

        for (const button of this.buttons) {
            
            if (button.publicData.name === button_.publicData.name) {
                button.setData('selected', 1);
                button.load();
            }

            else {
                button.setData('selected', 0);
            }
        }

        this.emit('url', `/assets/whatsnew-files/${button_.publicData.name}`);
    }

    /*
    **
    **
    */
    public unloadAll() : void {

        for (const button of this.buttons)
            button.unload();
    }
}