'use strict';

import {
    Div,
    ClientLocation,
    Tools,
    Router,
    Listener
} from '@src/classes';

export class Page extends Div {

    protected router: Router = ClientLocation.get().router;

    constructor() {

        super('page');

        setTimeout(function() {
            this.setData('state', 1);
        }.bind(this), 25);

        ClientLocation.get().ready(1);

        setTimeout(() => {
            ClientLocation.get().ready(2);
        }, 300);
    }

    /*
    **
    **
    */
    static setWindowTitle(title: string) : void {

        let titleTag = document.getElementsByTagName('title')[0];

        if (!titleTag)
            return;
        
        title = title ? `${ClientLocation.get().title} - ${title}` : ClientLocation.get().title;

        titleTag.innerHTML = title;
    }

    /*
    **
    **
    */
    public async onLeave() : Promise<void> {

        return new Promise(async function(resolve) {
            this.setData('state', 2);
            await Tools.sleep(180);
            resolve();
        }.bind(this));
    }
}