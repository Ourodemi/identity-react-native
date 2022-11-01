import { AxiosRequestConfig } from 'axios';
import React from 'react';
import IdentityAPI from './IdentityAPI';
export interface APIOptions {
    protocol?: 'http' | 'https';
    authHandler?: Function;
    deauthHandler?: Function;
}
export interface Identity {
    user_id: string;
    username: string;
    email?: string;
    phone_number?: string;
}
export interface LoginID {
    email?: string;
    username?: string;
    phone_number?: string;
}
export interface APIResponse {
    code: string;
    status: number;
    data: {
        [key: string]: any;
    };
}
export interface APIRequest extends AxiosRequestConfig {
    useAuth?: Boolean;
}
export interface IdentityContext {
    isAuthenticated: boolean | null;
    identityAPI: IdentityAPI;
}
export interface IdentityProvider {
    domain: string;
    children: React.ReactNode;
}
export interface AuthenticationTokens {
    refresh_token?: string;
    refresh_token_expiry?: number;
    access_token?: string;
    access_token_expiry?: number;
}
export declare type UserProps = {
    [key: string]: any;
};
