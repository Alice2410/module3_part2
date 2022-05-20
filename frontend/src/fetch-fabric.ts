import { TokenService } from "./token.service.js";
import { FetchInit, localStorageTokenKey, Token } from "./url.js";

const tokenService = new TokenService();

export class FetchFactory {
  private token = '';

  assignToken() {
    let token = JSON.parse(localStorage.getItem(localStorageTokenKey) || "")
    this.token = token.token;
  }

  async makeFetch (url: string, method: string, withToken?: boolean,contentType?: string | undefined, body?: BodyInit | string ) {
    if (method === "GET") {
      this.assignToken() 
      const res = await fetch (url, this.makeGetInit(method, contentType));
      let result = await res.json();

      return result;
    }

    if (method === "POST") {
      let res = await fetch (url, this.makePostInit(method, withToken ,body))
      let result = await res.json();
      
      return result;
    }

    if (method === "PUT") {
      let img =  body as Blob;
      let res = await fetch (url, this.makePutInit(method, img))
      
      return res;
    }

  }

  private makePostInit (method: string, withToken: boolean | undefined, body?: BodyInit ) {
    if (body) {
      let init: FetchInit = {
        method,
        body,
      }

      if (withToken) {
        init.headers = {
          'Authorization': this.token
        }
      }
      return init as RequestInit;
    }
    
    throw new Error('Отсутствует тело запроса')
  }

  private makeGetInit (method: string, contentType?: string) {
    if(contentType) {

      return {
        method,
        headers: {
          'Authorization': this.token,
          'Content-Type': contentType,
        }
      }
    }
  }

  private makePutInit (method: string, body?: Blob) {
    if (body) {
      return {
        method,
        body
      }
    }
    
    throw new Error('Отсутствует тело запроса')
  }
}