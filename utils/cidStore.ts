let cid: string | null = null;

export const setCID = (newCID: string): void => {
    cid = newCID;
}

export const getCID = (): string | null => {
    return cid;
}