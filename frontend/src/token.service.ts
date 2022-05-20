import { Token, tokenTimestampKey, localStorageTokenKey, } from "./url.js";

export class TokenService {
  private tokenObject: Token | undefined = undefined;

  assignToken() {
    let token = JSON.parse(localStorage.getItem(localStorageTokenKey) || "");
    this.tokenObject = token;
  }

  checkTokenIs() {
    if ((Date.now() - JSON.parse(localStorage.getItem(tokenTimestampKey) || "")) >= 600000) {
        localStorage.removeItem(localStorageTokenKey);
        localStorage.removeItem(tokenTimestampKey);

        this.redirectToAuthorization();
    }

    return true;
  }

  checkLocalStorage () {
    let token = localStorage.getItem(localStorageTokenKey)
    if (token) {
      this.tokenObject = JSON.parse(token);
    } else {
         this.redirectToAuthorization()
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