'use strict';

import {
    Emitter,
    Tools
} from '@src/classes';

export class Block extends Emitter {

    public element: any /*HTMLElement*/;
    public uid: string = Tools.uid();
    public publicData: any = {};
    
    constructor(private tag: any,
                private attributes?: any,
                parent?: any /*Block | HTMLElement*/) {

        super();

        this.element = this.tag instanceof HTMLElement || this.tag instanceof DocumentFragment ? this.tag : document.createElement(this.tag);
        
        if (typeof this.attributes === 'string')
            this.attributes = { class: attributes };
        
        if (this.attributes)
            this.setAttributes(this.attributes);
        
        if (parent)
            this.appendTo(parent);
    }

    /*
    **
    **
    */
    public isConnected() : boolean {

        return this.element.isCOnnected;
    }

    /*
    **
    **
    */
    public getAttribute(key: string) : any {

        return this.element.getAttribute(key);
    }

    /*
    **
    **
    */
    public setAttribute(key: any, value: any) : Block {
    
        this.element.setAttribute(key, value);

        return this;
    }

    /*
    **
    **
    */
    public setAttributes(attributes: {[key: string] : string}) : Block {
        
        for (let key in attributes)
            this.setAttribute(key, attributes[key]);

        return this;
    }

    /*
    **
    **
    */
    public removeAttribute(key: string) : Block {

        this.element.removeAttribute(key);

        return this;
    }

    /*
    **
    **
    */
    public setData(key: string, value: string | number) : Block {

        this.setAttribute(`data-${key}`, value);

        return this;
    }

    /*
    **
    **
    */
    public getData(key: string) : any {

        return this.element.getAttribute(`data-${key}`)
    }

    /*
    **
    **
    */
    public getStyle(key: string) : any {

        return getComputedStyle(this.element).getPropertyValue(key);
    }

    /*
    **
    **
    */
    public setStyle(key: string, value: string) : Block {

        this.element.style.setProperty(key, value);
        
        return this;
    }

    /*
    **
    **
    */
    public setStyles(styles: {[key: string]: string}) : Block {

        for (let key in styles)
            this.setStyle(key, styles[key]);

        return this;
    }

    /*
    **
    **
    */
    public html(html: string) : Block {

        this.empty();
        this.element.innerHTML = html;

        return this;
    }

    /*
    **
    **
    */
    public empty() : Block {

        while(this.element.firstChild)
            this.element.removeChild(this.element.firstChild);

        return this;
    }

    /*
    **
    **
    */
    public isEmpty() : boolean {

        return this.element.innerHTML === '';
    }

    /*
    **
    **
    */
    public write(input: any) : Block {

        this.element.innerText = input;

        return this;  
    }

    /*
    **
    **
    */
    public append(child: any /*Block | HTMLElement*/) : Block { 

        if (child instanceof Block)
            this.element.append(child.element);
        else if (child instanceof HTMLElement)
            this.element.append(child);

        this.emit('append');

        return this;
    }

    /*
    **
    **
    */
    public prepend(child: any /*Block | HTMLElement*/) : Block {

        if (child instanceof Block)
            this.element.prepend(child.element);
        else if (child instanceof HTMLElement)
            this.element.prepend(child);

        this.emit('prepend');

        return this;
    }
    
    /*
    **
    **
    */
    public appendTo(parent: any /*Block | HTMLElement*/) : Block { 

        if (parent instanceof Block)
            parent.element.append(this.element);
        else if (parent instanceof HTMLElement)
            parent.append(this.element);

        if (parent instanceof Block)
            parent.emit('append');

        return this;
    }
    
    /*
    **
    **
    */
    public prependTo(parent: any /*Block | HTMLElement*/) : Block {

        if (parent instanceof Block)
            parent.element.prepend(this.element);
        else if (parent instanceof HTMLElement)
            parent.prepend(this.element);
        
        if (parent instanceof Block)
            parent.emit('prepend');
        
        return this;
    }

    /*
    **
    **
    */
    public hasClass(className: string) : boolean {

        return this.element.classList.contains(className);
    }

    /*
    **
    **
    */
    public addClass(className: string) : Block {
        
        if (className.trim() === '')
            return this;
        
        let classes = className.split(' ');

        for (let className_ of classes)
            this.element.classList.add(className_);

        return this;
    }

    /*
    **
    **
    */
    public removeClass(className: string) : Block {

        this.element.classList.remove(className);

        return this;
    }

    /*
    **
    **
    */
    public onBeforeDelete(): void {}

    /*
    **
    **
    */
    public delete() : void {

        if (!this.element)
            return;
        
        if (typeof this.onBeforeDelete === 'function')
            this.onBeforeDelete();
        
        if (this.element.parentNode)
            this.element.parentNode.removeChild(this.element);
        
        this.clearListeners();
    }

    /*
    **
    **
    */
    public isMounted() : boolean {

        return document.contains(this.element);
    }

    /*
    **
    **
    */
    public onNative(key: string, callback: any) {

        this.element.addEventListener(key, callback);

        return this;
    }

    /*
    **
    **
    */
    static createFragment() : Block {

        return new Block(document.createDocumentFragment());
    }

    /*
    **
    **
    */
    public async nextFrameDisplay() : Promise<void> {

        await Tools.nextFrame();

        this.setData('display', 1);
    }
}