import { useContext } from 'react';
import IdentityContext from '../contexts/IdentityContext';
var useIdentity = function () {
    var context = useContext(IdentityContext);
    if (!context) {
        throw new Error("useIdentity must be called inside of an IdentityProvider!");
    }
    return context;
};
export default useIdentity;
