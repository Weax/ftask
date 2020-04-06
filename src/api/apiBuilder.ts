export type QueryParams = { [key: string]: string } | undefined;

export interface LocalStorageApiRequest<T> {
    query: (query?: QueryParams) => Promise<T[]>,
    get: (id: number) => Promise<T>,
    create: (item: T) => Promise<T>,
    update: (id: number, item: T) => Promise<T>
}

export const buildLocalStorageApi = <T>(endpoint: string) => {
    //use endpoint as localStorage key
    let items: T[];
    let err: ErrorEvent | null;
    try {
        const existing = localStorage.getItem(endpoint);
        items = existing ? JSON.parse(existing) : [];
    } catch (e) {
        err = e;
    }

    const api: LocalStorageApiRequest<T> = {
        query: (query = {}) => new Promise((resolve, reject) => {
            //todo: custom query for filtering
            err ? reject(err) : resolve(items);
        }),
        create: (item: T) => new Promise((resolve, reject) => {
            try {
                const newItems = [...items, item];
                localStorage.setItem(endpoint, JSON.stringify(newItems));
                resolve(item);
                return;
            } catch (e) {
                reject(e);
            }
        }),
        get: (id: number) => new Promise((resolve, reject) => {
            err ? reject(err) : resolve(items[id]);
        }),
        update: (id: number, item: T) => new Promise((resolve, reject) => {
            try {
                const newItems = Object.assign([...items], {[id]: item});
                localStorage.setItem(endpoint, JSON.stringify(newItems));
                resolve(item);
            } catch (e) {
                reject(e);
            }
        })
    };

    return api;
};