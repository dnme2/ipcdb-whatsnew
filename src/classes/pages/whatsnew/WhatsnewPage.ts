'use strict';

import {
    Page,
    PDFList,
    PDFView
} from "@src/classes";

export class WhatsnewPage extends Page {
    
    private list: PDFList;
    private view: PDFView;

    constructor() {

        super();
        
        this.addClass('whatsnew');

        this.list = new PDFList(this);
        this.view = new PDFView(this);

        this.list.on('url', (url: string) => {
            this.view.render(url);
        });
    }
}