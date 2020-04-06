import { buildLocalStorageApi } from "./apiBuilder";

export interface User {
    name: string
    surname?: string
    email: string
    address: {
        country?: string
        city?: string
        house?: string
        code?: string
    }
}

export const emptyUser: User = {
    name: "",
    surname: "",
    email: "",
    address: {
        country: "",
        city: "",
        house: "",
        code: ""
    }
};

const STORAGE_KEY = "users";
export const usersApi = buildLocalStorageApi<User>(STORAGE_KEY);