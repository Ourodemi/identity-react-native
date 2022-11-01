import * as LocalStorage from './LocalStorage';
import IdentityAPI from './IdentityAPI';

import { AuthenticationTokens, UserProps } from './types';

 /**
  * Manages local user profiles
  */
class LocalIdentity {
    api: IdentityAPI

    user_id: string | undefined = undefined

    props: UserProps = {}
    tokens: AuthenticationTokens = {}

    isRefreshing: boolean = false
    isLoading = false

    constructor(api: IdentityAPI, user_id?: string, props?: UserProps, tokens?: AuthenticationTokens){
        this.user_id = user_id;
        this.api = api;

        if ( user_id && props && tokens ){
            this.props = props;
            this.tokens = tokens;
            this.isLoading = false;
            this.save();
        }else{
            this.loadIdentity();
        }
    }

    // Currently loaded profile's authentication status
    async isAuthenticated(){
        await this.hasLoaded();

        if ( await this.getAccessToken() ){
            return true;
        }

        return false;
    }

    // Wait-loop until "isLoading" is false
    async hasLoaded(): Promise<boolean> {
        return new Promise(async (resolve, _) => {
            if ( this.isLoading ){
                return setTimeout(() => {
                    return resolve(this.hasLoaded());
                }, 100);
            }else{
                return resolve(true);
            }
        })
    }

    // Check the validity of the refresh token
    getRefreshToken(): string | undefined {
        if ( !this.tokens.refresh_token_expiry || 
            this.timestamp() > this.tokens.refresh_token_expiry ){
            return undefined;
        }

        return this.tokens.refresh_token;
    }

    // Return access token if valid else attempt to fetch a new one
    async getAccessToken(): Promise<string | undefined> {
        return new Promise(async (resolve, _) => {
            // Prioritize validity of refresh token over access token?
            if ( !this.getRefreshToken() ){
                return resolve(undefined);
            }

            // Check if the access token is still valid
            if ( !this.tokens.access_token_expiry ||
                this.timestamp() > this.tokens.access_token_expiry ){
                
                // is it already trying to fetch a token?
                if ( this.isRefreshing ){
                    // wait for the previous request to finish via polling?
                    return setTimeout(() => {
                        resolve(this.getAccessToken());
                    }, 500);
                }

                // attempt to get a new access token
                this.isRefreshing = true;
                let { status, data } = await this.api.request('auth', {
                    useAuth: true
                });

                if ( status == 200 || status == 201){
                    let { access_token_expiry, access_token, user } = data;

                    await this.setAuthenticationTokens({
                        access_token, access_token_expiry
                    });

                    await this.setUserProps(user);

                    this.isRefreshing = false;
                    return resolve(access_token);
                }

                this.isRefreshing = false;
                return resolve(undefined);
            }

            return resolve(this.tokens.access_token);
        });
    }

    async setAuthenticationTokens(tokens: AuthenticationTokens){
        Object.assign(this.tokens, tokens);
        await this.save();
    }

    async loadIdentity() {
        this.isLoading = true; // "lock" function

        this.user_id = this.user_id || await this.getActiveIdentity();

        // still no user_id found? no problemo
        if ( !this.user_id ){
            this.isLoading = false;
            return false;
        }

        let user = await LocalStorage.getLocalObject(this.user_id);

        if ( !user ){
            return false;
        }

        this.props = user.props;
        this.tokens = user.tokens;
        
        this.isLoading = false;
        return true;
    }

    async setUserProps(props: {[key: string]: any}, reset: boolean = false){
        if ( reset ){
            this.props = props;
        }else{
            Object.assign(this.props, props);
        }
        
        await this.save();
    }

    // Save identity profile to local storage
    async save(){
        if ( !this.user_id ){
            return;
        }

        return await LocalStorage.setLocalObject(this.user_id, {
            props: this.props,
            tokens: this.tokens
        });
    }

    async destroy(){
        if ( !this.user_id ){
            return;
        }
        
        if ( await LocalStorage.deleteLocalItem(this.user_id) ) {
            this.props = {};
            this.user_id = undefined;
            this.setAuthenticationTokens({});

            return true;
        }

        return false;
    }

    // Set this identity profile as the default/active selection
    async makeActive(){
        if ( !this.user_id ) return;
        
        return await LocalStorage.setLocalItem('active', this.user_id);
    }

    // Get the id of the active identity
    async getActiveIdentity(){
        return await LocalStorage.getLocalItem('active');
    }

    // timestamp in seconds
    timestamp(): number{
        return Math.floor(Date.now() / 1000);
    }
}

export default LocalIdentity;