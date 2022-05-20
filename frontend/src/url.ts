export const loginURL = 'https://aa1jxrc38h.execute-api.us-east-1.amazonaws.com/auth/login';
export const signUpUrl = 'https://aa1jxrc38h.execute-api.us-east-1.amazonaws.com/auth/signup';
export const basicGalleryURL = 'https://aa1jxrc38h.execute-api.us-east-1.amazonaws.com/gallery';
export const localStorageTokenKey = 'token';
export const tokenTimestampKey = 'tokenReceiptTime';

export interface UserData {
    email: string;
    password: string;
}

export interface Token {
    token: string;
}

export interface Error {
    errorMessage: string;
}

export interface Gallery {
    objects: string[];
    page: number;
    total: number;
}

export interface ImageObject {
    id: string;
    path: string;
    metadata: object;
}

export interface ImageMetadata {
    name: string;
    lastModifiedDate: Date;
    size: number;
    type: string;
}

export interface FetchInit {
    method: string,
    headers?: {[key: string]: string},
    body?: Blob | BodyInit |string | undefined
}