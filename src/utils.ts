import { LoginID } from "./types";

export function getLoginID(loginID: LoginID): string | undefined {
    if ( loginID.email ){
        return loginID.email;
    }else if ( loginID.username ){
        return loginID.username;
    }else if ( loginID.phone_number ){
        return loginID.phone_number
    }

    return undefined;
}