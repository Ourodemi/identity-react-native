export declare function localStorageKey(key: string): string;
export declare function setLocalItem(key: string, val: string): Promise<boolean>;
export declare function getLocalItem(key: string): Promise<string | undefined>;
export declare function deleteLocalItem(key: string): Promise<boolean>;
export declare function getLocalObject(key: string): Promise<{
    [key: string]: any;
} | undefined>;
export declare function setLocalObject(key: string, obj: {
    [key: string]: any;
}): Promise<boolean>;
