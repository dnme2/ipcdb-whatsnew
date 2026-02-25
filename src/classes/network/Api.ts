'use strict';

import {
    Emitter,
    ApiRequest,
    TApiRequestMethod,
    IApiRequestParameters,
    ApiRequestsManager,
    ClientLocation
} from '@src/classes';

export interface IApiAccountData {
    id: number,
    rights: string[],
    [key: string]: any
}

export class Api extends Emitter {

    public accountData: IApiAccountData | null = null;

    constructor() {

        super();
    }

    /*
    **
    **
    */
    static getBaseURL() : URL {

        return new URL(`${location.protocol}//${location.hostname}${ClientLocation.get().rootPath}/api`);
    }

    /*
    **
    **
    */
    static request(method: TApiRequestMethod, endpoint: string, parameters: IApiRequestParameters = {}, binary: boolean = false) : Promise<any> {

        return new Promise((resolve, reject) => {

            const request = new ApiRequest({
                method: method,
                endpoint: endpoint,
                parameters: parameters,
                binary: binary
            });

            request.on('success', resolve);
            request.on('error', reject);
            
            ApiRequestsManager.send(request);
        });
    }

    /*
    **
    **
    */
    static get(endpoint: string, parameters: IApiRequestParameters = {}) : Promise<any> {

        return Api.request('GET', endpoint, parameters);
    }

    /*
    **
    **
    */
    static post(endpoint: string, parameters: IApiRequestParameters = {}) : Promise<any> {

        return Api.request('POST', endpoint, parameters);
    }

    /*
    **
    **
    */
    static getBinary(endpoint: string, parameters: IApiRequestParameters = {}) : Promise<any> {

        return Api.request('GET', endpoint, parameters, true);
    }

    /*
    **
    **
    */
    public async checkAuth() : Promise<boolean> {
        
        if (!!!localStorage.getItem(ApiRequest.LOCAL_STORAGE_TOKEN_NAME)) {
            this.emit('not-connected');
            return false;
        }

        try {

            this.accountData = await Api.get('/me');
            
            this.accountData!.rights = this.accountData!.RIGHT_NAMES ? this.accountData!.RIGHT_NAMES?.split(',') : [];

            console.info(`[Logged in]`);

            this.emit('connected');

            return true;

        } catch(error) {

            console.warn('[Failed authentication check]', error);

            this.accountData = null;
            this.emit('not-connected');
            
            return false;
        }
    }

    /*
    **
    **
    */
    static clearAuth() : void {

        return localStorage.removeItem(ApiRequest.LOCAL_STORAGE_TOKEN_NAME);
    }
}