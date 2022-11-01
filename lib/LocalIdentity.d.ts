import IdentityAPI from './IdentityAPI';
import { AuthenticationTokens, UserProps } from './types';
/**
 * Manages local user profiles
 */
declare class LocalIdentity {
    api: IdentityAPI;
    user_id: string | undefined;
    props: UserProps;
    tokens: AuthenticationTokens;
    isRefreshing: boolean;
    isLoading: boolean;
    constructor(api: IdentityAPI, user_id?: string, props?: UserProps, tokens?: AuthenticationTokens);
    isAuthenticated(): Promise<boolean>;
    hasLoaded(): Promise<boolean>;
    getRefreshToken(): string | undefined;
    getAccessToken(): Promise<string | undefined>;
    setAuthenticationTokens(tokens: AuthenticationTokens): Promise<void>;
    loadIdentity(): Promise<boolean>;
    setUserProps(props: {
        [key: string]: any;
    }, reset?: boolean): Promise<void>;
    save(): Promise<boolean | undefined>;
    destroy(): Promise<boolean | undefined>;
    makeActive(): Promise<boolean | undefined>;
    getActiveIdentity(): Promise<string | undefined>;
    timestamp(): number;
}
export default LocalIdentity;
