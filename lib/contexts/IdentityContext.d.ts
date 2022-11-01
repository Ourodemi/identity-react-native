import React from "react";
import { IdentityContext as IdentityContextInterface, IdentityProvider as IdentityProviderInterface } from "../types";
declare const IdentityContext: React.Context<IdentityContextInterface>;
export declare const IdentityProvider: ({ domain, children }: IdentityProviderInterface) => JSX.Element;
export default IdentityContext;
