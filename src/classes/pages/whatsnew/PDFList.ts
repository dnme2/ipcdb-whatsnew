'use strict';

import {
    Block,
    Div,
    SpinnerButton,
    Tools
} from '@src/classes';

export class PDFList extends Div {

    private input: Block;

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

        this.input = new Block('input', {
            placeholder: "Search versions..."
        }, this);

        this.input.onNative('input', this.onInput.bind(this));

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

    /*
    **
    **
    */
    private onInput() : void {

        const value = this.input.element.value.trim().toLowerCase();

        for (const button of this.buttons)
            button.setData('search-match', button.publicData.name.toLowerCase().includes(value) ? 1 : 0);
    }
}