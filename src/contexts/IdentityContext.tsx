import React, { 
    createContext, 
    useEffect,
    useState 
} from "react";

import { 
    IdentityContext as IdentityContextInterface,
    IdentityProvider as IdentityProviderInterface
} from "../types";

import IdentityAPI from "../IdentityAPI";

const IdentityContext = createContext<IdentityContextInterface>(undefined!);

export const IdentityProvider = ({
    domain,
    children
}: IdentityProviderInterface) => {

    const [isAuthenticated, setAuthenticated] = useState<boolean | null>(null);

    const identityAPI = new IdentityAPI(domain, {
        authHandler: async function(){
            setAuthenticated(await identityAPI.isAuthenticated())
        }
    });

    useEffect(() => {
        identityAPI.isAuthenticated().then(res => setAuthenticated(res));
    }, [])

    return (
        <IdentityContext.Provider value={{ isAuthenticated, identityAPI }}>
            {children}
        </IdentityContext.Provider>
    )
}

export default IdentityContext;