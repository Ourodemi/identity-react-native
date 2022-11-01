import IdentityAPI from "./IdentityAPI";
import useIdentity from "./hooks/useIdentity";
import IdentityContext from "./contexts/IdentityContext";
import { IdentityProvider } from "./contexts/IdentityContext";

export {
    useIdentity,
    IdentityAPI,
    IdentityContext,
    IdentityProvider
}

export default useIdentity;