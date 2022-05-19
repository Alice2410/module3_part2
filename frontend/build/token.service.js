import { tokenTimestampKey, localStorageTokenKey } from "./url.js";
export class TokenService {
    constructor() {
        this.tokenObject = JSON.parse(localStorage.getItem(localStorageTokenKey) || '');
    }
    checkTokenIs() {
        if ((Date.now() - JSON.parse(localStorage.getItem(tokenTimestampKey) || "")) >= 600000) {
            localStorage.removeItem(localStorageTokenKey);
            localStorage.removeItem(tokenTimestampKey);
            this.redirectToAuthorization();
        }
        return true;
    }
    checkLocalStorage() {
        if (localStorage.getItem(localStorageTokenKey)) {
            this.tokenObject = JSON.parse(localStorage.getItem(localStorageTokenKey) || '');
        }
        else {
            this.redirectToAuthorization();
        }
    }
    redirectToAuthorization() {
        let currentPage = window.location;
        let searchParam = currentPage.search;
        window.location.href = "index.html" + searchParam;
    }
    getToken() {
        if (this.tokenObject) {
            return this.tokenObject;
        }
        throw new Error('Нет токена');
    }
}
