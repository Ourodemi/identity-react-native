import { APIOptions, LoginID, APIResponse, APIRequest } from './types';
import LocalIdentity from './LocalIdentity';

import axios from 'axios';

class IdentityAPI{

    domain: string
    apiVersion: string = 'v1'
    protocol: string = 'https'
    identity: LocalIdentity

    deauthHandler: Function = () => {}
    authHandler: Function = () => {}

    constructor(domain: string, options?: APIOptions){
        this.domain = domain;
        this.identity = new LocalIdentity(this);
        Object.assign(this, options);
    }

    async isAuthenticated(){
        return await this.identity.isAuthenticated();
    }

    /* Authenticate using a Login ID and Password */
    async auth(loginID: LoginID, password: string): Promise<APIResponse> {
        return new Promise(async (resolve, _) => {
            let { status, data, code } = await this.request('auth', {
                data: {...loginID, password},
                method: 'POST'
            });
    
            if ( (status == 200 || status == 201) && data.user ) {
                await this.initializeLocalIdentity(data);
            }

            return resolve({ status, data, code });
        });
    }

    // deauthenticate user from server and destroy local data
    async deauth(){
        await this.request('auth', { useAuth: true, method: 'DELETE' });
        let res = await this.identity.destroy();

        this.deauthHandler();

        return res;
    }

    async initializeLocalIdentity(data: { [key: string]: any }) {
        let { 
            user, 
            access_token, 
            access_token_expiry, 
            refresh_token,
            refresh_token_expiry
        } = data;
        
        this.identity = new LocalIdentity(this, user.user_id, user, {
            access_token, access_token_expiry,
            refresh_token, refresh_token_expiry
        });

        await this.identity.makeActive();
        this.authHandler();
    }

    // SingleSignOnRequest = (loginID: LoginID): Promise<APIResponse> => {
    //     return this.request('sso', {

    //     });
    // }

    // VerifySingleSignOn = (ssoToken: string): Promise<APIResponse> => {
    //     return this.request('sso', {

    //     });
    // }

    /* Make a request to the identity API */
    async request(endpoint: string, options: APIRequest): Promise<APIResponse> {
        return new Promise(async (resolve, _) => {
            // unpack request parameters
            let { 
                method = 'GET', 
                params, 
                data, 
                headers = {}, 
                useAuth = false 
            } = options;

            /* Is authentication needed for this endpoint? */
            if ( useAuth ){
                let refreshToken = this.identity.getRefreshToken();

                // is the token valid?
                if ( !refreshToken ){
                    this.deauthHandler();
                    return resolve({ code: 'forbidden', status: 401, data: {}})
                }

                headers['x-refresh-token'] = refreshToken;
            }

            axios({
                url: this.getURL(endpoint),
                headers,
                params,
                method,
                data
            })
            .then(({ data }) => resolve(this.parseApiResponse(data)))
            .catch(({ response }) => resolve(this.parseApiResponse(response?.data)))
        });
    }

    getURL(endpoint: string): string {
        return `${this.protocol}://${this.domain}/${this.apiVersion}/${endpoint}`
    }

    // parse API response
    parseApiResponse(data: any): APIResponse {
        return {
            code: data?.code || 'network_error',
            status: data?.status || 500,
            data: data?.data || {}
        }
    }
}


export default IdentityAPI