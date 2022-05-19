import { TokenService } from "./token.service.js";

const tokenService = new TokenService();

export class FetchFabric {
  private token = tokenService.getToken().token;

  async makeFetch (url: string, method: string, contentType?: string | undefined, body?: BodyInit | string) {
    
    if (method === "GET") {
      return fetch (url, this.makeGetInit(method, contentType))
    }

    if (method === "POST") {
      let res = await fetch (url, this.makePostInit(method, body))
      let result = await res.json();
      
      return result;
    }

    if (method === "PUT") {
      let img =  body as Blob;
      let res = await fetch (url, this.makePutInit(method, img))
      
      return res;
    }

  }

  private makePostInit (method: string, body?: BodyInit) {
    if (body) {
      return {
        method,
        headers: {
          'Authorization': this.token
        },
        body
      }
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