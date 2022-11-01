import { APIOptions, LoginID, APIResponse, APIRequest } from './types';
import LocalIdentity from './LocalIdentity';
declare class IdentityAPI {
    domain: string;
    apiVersion: string;
    protocol: string;
    identity: LocalIdentity;
    deauthHandler: Function;
    authHandler: Function;
    constructor(domain: string, options?: APIOptions);
    isAuthenticated(): Promise<boolean>;
    auth(loginID: LoginID, password: string): Promise<APIResponse>;
    deauth(): Promise<boolean | undefined>;
    initializeLocalIdentity(data: {
        [key: string]: any;
    }): Promise<void>;
    request(endpoint: string, options: APIRequest): Promise<APIResponse>;
    getURL(endpoint: string): string;
    parseApiResponse(data: any): APIResponse;
}
export default IdentityAPI;
