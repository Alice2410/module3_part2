var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TokenService } from "./token.service.js";
const tokenService = new TokenService();
export class FetchFabric {
    constructor() {
        this.token = tokenService.getToken().token;
    }
    makeFetch(url, method, contentType, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (method === "GET") {
                return fetch(url, this.makeGetInit(method, contentType));
            }
            if (method === "POST") {
                let res = yield fetch(url, this.makePostInit(method, body));
                let result = yield res.json();
                return result;
            }
            if (method === "PUT") {
                let img = body;
                let res = yield fetch(url, this.makePutInit(method, img));
                return res;
            }
        });
    }
    makePostInit(method, body) {
        if (body) {
            return {
                method,
                headers: {
                    'Authorization': this.token
                },
                body
            };
        }
        throw new Error('Отсутствует тело запроса');
    }
    makeGetInit(method, contentType) {
        if (contentType) {
            return {
                method,
                headers: {
                    'Authorization': this.token,
                    'Content-Type': contentType,
                }
            };
        }
    }
    makePutInit(method, body) {
        if (body) {
            return {
                method,
                body
            };
        }
        throw new Error('Отсутствует тело запроса');
    }
}
