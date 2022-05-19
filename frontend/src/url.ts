export const loginURL = 'http://localhost:5000/authorization';
export const signUpUrl = 'http://localhost:5000/signup';
export const basicGalleryURL = 'https://qlruntkjag.execute-api.us-east-1.amazonaws.com/gallery';
export const localStorageTokenKey = 'token';
export const tokenTimestampKey = 'tokenReceiptTime';

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