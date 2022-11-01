import * as SecureStore from 'expo-secure-store';

const LOCAL_STORAGE_PREFIX = 'ourodemi-identity';

export function localStorageKey(key: string): string{
    return `${LOCAL_STORAGE_PREFIX}_${key}`;
}

export async function setLocalItem(key: string, val: string): Promise <boolean> {
    return new Promise(async (resolve, _) => {
        try{
            await SecureStore.setItemAsync(localStorageKey(key), val);
            return resolve(true);
        }catch(e){
            console.log(e);
            return resolve(false);
        }
    });
}

export async function getLocalItem(key: string): Promise <string | undefined> {
    return new Promise(async (resolve, _) => {
        try{
            let res = await SecureStore.getItemAsync(localStorageKey(key));
            if ( res ){
                return resolve(res);
            }
            return resolve(undefined);
        }catch(e){
            console.log(e);
            return resolve(undefined);
        }
    });
}

export async function deleteLocalItem(key: string): Promise <boolean> {
    return new Promise(async (resolve, _) => {
        try{
            SecureStore.deleteItemAsync(localStorageKey(key));
            return resolve(true);
        }catch(e){
            console.log(e);
            return resolve(false);
        }
    });
}

export async function getLocalObject(key: string): Promise<{ [key:string]: any } | undefined> {
    return new Promise(async (resolve, _) => {
        try{
            let raw = await getLocalItem(key);
            if ( typeof(raw) == 'string' ){
                let json = JSON.parse(raw);
                return resolve(json);
            }else{
                return resolve(undefined);
            }
        }catch (e){
            return resolve(undefined);
        }
    });
}

export async function setLocalObject(key: string, obj:{ [key:string]: any }): Promise<boolean> {
    return new Promise(async (resolve, _) => {
        try{
            let raw = JSON.stringify(obj);
            let res = await setLocalItem(key, raw)
            return resolve(res);
        }catch(e){
            return resolve(false);
        }
    });
}
