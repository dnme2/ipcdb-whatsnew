'use strict';

import {
    Router,
    Api,
    FontManager,
    Block,
    Tools,
    Emitter,
    ClientLocation,
    Listener,
    ContentRoot
} from '@src/classes';

export interface ClientConfig {
    title?: string,
    fonts?: string[] 
};

declare const __APP_NAME__: string;

export interface KeydownEventData {
    ctrlKey: boolean,
    altKey: boolean,
    shiftKey: boolean,
    metaKey: boolean,
    key: string
}

export abstract class AbstractClient extends Emitter {
    
    public title: string = __APP_NAME__;
    public fontManager: FontManager;
    public block: Block;
    public launchScreen: Block;
    public contentRoot: ContentRoot;
    public router: Router;
    public api: Api;
    public visibilityChangeListener: any;
    public parameters: any;
    public localURLSCache: any = {};
    public dataCache: any = {};
    public tools: any = Tools;

    constructor(private config: ClientConfig) {

        super();

        let parametersElement = document.getElementById('parameters');
        
        if (parametersElement)
            this.parameters = JSON.parse(parametersElement.innerText);
        else
            this.parameters = {};

        document.addEventListener('deferredResourcesLoaded', this.onDeferredResourcesLoaded.bind(this));
        document.addEventListener('click', this.onDOMClick.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this));

        ClientLocation.set(this);
    }

    /*
    **
    **
    */
    private async onDeferredResourcesLoaded() : Promise<void> {
        
        await this.beforeInit();

        if (this.config.fonts) {

            this.fontManager = new FontManager(this.config.fonts);
            this.fontManager.on('load', this.init.bind(this));
        }
        else
            this.init();
    }

    /*
    **
    **
    */
    private async onDOMClick(event: MouseEvent) : Promise<void> {

        this.emit('document-click', {
            target: event.target,
            x: event.pageX,
            y: event.pageY
        });
    }

    /*
    **
    **
    */
    public async init() : Promise<void> {

        document.addEventListener('scroll', this.onScroll.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
        this.initVisibilityChangeListener();
        this.onResize(new Event('fake-resize'));
    
        this.block = new Block(document.getElementById('app'));
        this.block.setData('mobile', Tools.isMobile() ? 1 : 0);

        this.launchScreen = new Block(document.getElementById('launch-screen'));  
        this.contentRoot = new ContentRoot(this.block);
        
        this.router = new Router();

        this.api = new Api();

        await this.afterInit();

        this.api.on('not-connected', this.onNotConnected.bind(this));
        this.api.on('connected', this.onConnected.bind(this));
        this.api.checkAuth();
    }

    /*
    **
    **
    */
    public ready(value: number = 1) : void {

        if (parseInt(this.block.getData('ready')) === 2)
            return;
        
        this.block.setData('ready', value);
    }

    /*
    **
    **
    */
    abstract onNotConnected(data: any) : void
    
    /*
    **
    **
    */
    abstract onConnected(data: any) : void

    /*
    **
    **
    */
    private initVisibilityChangeListener() : void {

        if (this.visibilityChangeListener)
            return;

        this.visibilityChangeListener = document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this), false);
    }

    /*
    **
    **
    */
    private onVisibilityChange() : void {

        this.emit('visibilityChange', document.visibilityState === "visible");
    }

    /*
    **
    **
    */
    private onScroll(event: Event): void {

        this.emit('scroll', event);
    }

    /*
    **
    **
    */
    private onResize(event: Event) : void {

        this.emit('resize', event);
    }
    
    /*
    **
    **
    */
    abstract beforeInit() : Promise<void>

    /*
    **
    **
    */
    abstract afterInit() : Promise<void>

    
    /*
    **
    **
    */
    private onKeyDown(event: KeyboardEvent) : void {
        
        this.emit('keydown', {
            ctrlKey: event.ctrlKey,
            altKey: event.altKey,
            shiftKey: event.shiftKey,
            metaKey: event.metaKey,
            key: event.key
        });
    }

    public test() {
        console.log('hello');
    }
    /*
    **
    **
    */
    public onShortcut(combination: string, callback: () => void) : Listener {

        const { modifiers, key } = this.parseCombination(combination);
    
        return this.on('keydown', (data: KeydownEventData) => {

            const eventModifiers: string[] = [];

            if (data.ctrlKey) eventModifiers.push('ctrl');
            if (data.altKey) eventModifiers.push('alt');
            if (data.shiftKey) eventModifiers.push('shift');
            if (data.metaKey) eventModifiers.push('meta');
    
            for (const mod of modifiers) {

                if (!eventModifiers.includes(mod))
                    return;
            }
    
            if (eventModifiers.length !== modifiers.length)
                return;
    
            if (key && data.key.toLowerCase() !== key.toLowerCase())
                return;
    
            callback();
        });
    }
    
    /*
    **
    **
    */
    private parseCombination(combination: string): { 
        modifiers: string[]; 
        key: string | null
    } {

        const parts = combination
            .split('+')
            .map(part => part.trim().toLowerCase());

        const modifiers: string[] = [];

        let key: string | null = null;
    
        for (const part of parts) {

            if (part === 'ctrl' || part === 'control')
                modifiers.push('ctrl');
            else if (part === 'alt')
                modifiers.push('alt');
            else if (part === 'shift')
                modifiers.push('shift');
            else if (part === 'meta' || part === 'command' || part === 'cmd')
                modifiers.push('meta');
            else
                key = part;
        }
    
        return { modifiers, key };
    }

    /*
    **
    **
    */
    static u/*npackStoredData*/(input: any) : any {

        const numbers: number[] = input.v.split(" ").map((e: string) => parseInt(e));

        let bytes: number[] = [];

        const step = 31;
        let i = 1;
        for (const byte of numbers) {
            i++;
            if (i > step)
                i=1;
            bytes.push(byte - step - i);
        }

        return JSON.parse(new TextDecoder('utf-8').decode(new Uint8Array(bytes)));
    }

    /*
    **
    **
    */
    public getSettings() : any {

        try {

            const settings = JSON.parse(localStorage.getItem('settings')!);

            if (typeof settings !== 'object' || settings === null)
                throw null;

            return settings;
        }
        catch(exception) {

            this.setSettings({});

            return {};
        }
    }

    /*
    **
    **
    */
    public setSettings(settings: any) : void {
        
        try {
            localStorage.setItem('settings', JSON.stringify(settings));
        }
        catch(exception) {
            
            localStorage.setItem('settings', JSON.stringify({}));
        }
    }

    /*
    **
    **
    */
    public getSetting(key: string) : any {

        const settings = this.getSettings();

        return settings[key];
    }

    /*
    **
    **
    */
    public setSetting(key: string, value: any) : void {

        const settings = this.getSettings();

        settings[key] = value;

        this.setSettings(settings);
    }
}