export function getLoginID(loginID) {
    if (loginID.email) {
        return loginID.email;
    }
    else if (loginID.username) {
        return loginID.username;
    }
    else if (loginID.phone_number) {
        return loginID.phone_number;
    }
    return undefined;
}
