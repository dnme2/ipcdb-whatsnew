'use strict';

import {
    Block,
    Div,
    Tools
} from '@src/classes';

export class PDFView extends Div {

    private blobUrl: string | null = null;
    private iframeCleanup: () => void = () => {};

    constructor(parent: Block) {

        super('pdf-view', parent);
    }

    /*
    **
    **
    */
    public async render(pdfUrl: string) : Promise<void> {

        this.dispose();
        
        const response = await fetch(pdfUrl, { credentials: "same-origin" });

        if (!response.ok)
            throw new Error(`PDF download failed: ${response.status} ${response.statusText}`);
        
        const blob = await response.blob();
        this.blobUrl = URL.createObjectURL(blob);

        const viewerUrl = new URL("/assets/pdfjs/web/viewer.html", window.location.href);

        viewerUrl.searchParams.set("file", this.blobUrl);

        const iframe = new Block('iframe', {}, this);
        
        await new Promise<void>((resolve, reject) => {

            const onLoad = async () => {
                this.iframeCleanup();
                await Tools.sleep(250);
                this.emit('loaded');
                iframe.setData('ready', 1);
                resolve();
            };

            const onError = () => {
                this.iframeCleanup();
                reject(new Error("PDF.js viewer iframe failed to load"));
            };
            
            this.iframeCleanup = () => {

                iframe.element.removeEventListener("load", onLoad);
                iframe.element.removeEventListener("error", onError);

                this.iframeCleanup = () => {};
            };

            iframe.element.addEventListener("load", onLoad, { once: true });
            iframe.element.addEventListener("error", onError, { once: true });

            iframe.setAttribute('src', viewerUrl.toString());
        });
    }

    /*
    **
    **
    */
    private dispose() : void {

        this.empty();

        if (this.blobUrl) {

            URL.revokeObjectURL(this.blobUrl);
            this.blobUrl = null;
        }

        this.iframeCleanup();
    }
}