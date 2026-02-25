'use strict';

import {
    AbstractClient,
    WhatsnewPage
} from '@src/classes';

export interface AppData {
    [key: string]: any;
}

export class Client extends AbstractClient {

    public readonly rootPath = '';

    constructor() {

        super({
            fonts: [
                'Google Sans:600'
            ]
        });
    }

    /*
    **
    **
    */
    public async beforeInit() : Promise<void> {
    }

    /*
    **
    **
    */
    public async afterInit() : Promise<void> {
    }

    /*
    **
    **
    */
    public onNotConnected() : void {
    
        this.router.setRoutes({
            '/': WhatsnewPage
        });

        this.router.routeCurrentPath();
        
        this.emit('not-connected');
    }
    
    /*
    **
    **
    */
    public async onConnected() : Promise<void> {

        this.router.setRoutes({
        });

        this.router.routeCurrentPath();

        this.emit('connected');
    }
}