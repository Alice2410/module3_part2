import {Error, Token, localStorageTokenKey, tokenTimestampKey, UserData, basicURL} from './url.js'
import { FetchFactory } from './fetch-fabric.js';
import { TokenService } from './token.service.js';
const authorizationForm = document.getElementById('authorization-form');
const userEmail = <HTMLInputElement>document.getElementById('email');
const userPassword = <HTMLInputElement>document.getElementById('password');
const signUpButton = <HTMLButtonElement>document.getElementById('signup');
const fetch = new FetchFactory();
const tokenService = new TokenService();
const basicAuthURL = basicURL + '/auth';

authorizationForm?.addEventListener("submit", startAuthorization);
signUpButton?.addEventListener("click", startSignUp)

function startAuthorization(e: Event) {
    e.preventDefault();
    loginWithToken();
}

function startSignUp(e: Event) {
    e.preventDefault();
    signUp();
}

async function signUp() {
    const user: UserData = {
        email: userEmail.value,
        password: userPassword.value
    };
    const body = JSON.stringify(user);
    
    try{ 
        const signUpUrl = basicAuthURL + '/signup';
        const response = await fetch.makeFetch(signUpUrl, "POST", false, "application/json", body);

        checkSignUpResponse(response);
    } catch (err) {
        let error = err as Error;
        alert(error) 
    }
}

async function loginWithToken() { 
    let user: UserData = {
        email: userEmail.value,
        password: userPassword.value
    };

    const body = JSON.stringify(user);
    
    try {
        const loginURL = basicAuthURL + '/login';
        const response = await fetch.makeFetch(loginURL, "POST", false, "application/json", body)     
        checkTokenResponse(response);    
        const tokenJson = tokenIs(response);
        saveToken(tokenJson);
        saveTokenReceiptTime();
        redirect();

    } catch (err) {
        let error = err as Error;
        alert(error) 
    } 
}

function redirect() {
    const currentPage = window.location; //currentPage: http://localhost:5000/ || http://localhost:5000/index.html?page=2
    const params = currentPage.search; //?page=2

    authorizationForm?.removeEventListener("submit", startAuthorization);

    if (params) {
        window.location.href = "gallery.html" + params;
    } else {
        let searchParams = new URLSearchParams(params);
        searchParams.append('page', '1');
        searchParams.append('limit', '2');
        searchParams.append('filter', 'false');
        window.location.href = "gallery.html?" + searchParams;
    }
}

function saveToken(json: Token) { 
    localStorage.setItem (localStorageTokenKey, JSON.stringify(json));
}

function saveTokenReceiptTime() {
    let tokenReceiptTime = Date.now();
    localStorage.setItem (tokenTimestampKey, JSON.stringify(tokenReceiptTime));
}

function checkTokenResponse(response: Token) {
    if (response.token){
        
        return response;
    } else {
        let TokenErrorElement = document.getElementById('token-error');

        if (TokenErrorElement) {
            TokenErrorElement.innerHTML = 'Ошибка получения токена. Введите верные логин и пароль.';
        } else {
            throw new Error(`HTML-элемент не найден.`)
        }
    }

    throw new Error(`Ошибка проверки токена`); 
}

function checkSignUpResponse(response: Response) {
    let messageElement = document.getElementById('token-error');

    if (response){

        if (messageElement) {
            messageElement.innerHTML = 'Пользователь успешно добавлен';
        } else {
            throw new Error(`HTML-элемент не найден. ${response.status} — ${response.statusText}`)
        }

        return response;
    } 
    
    // if (response.status === 401){

    //     if (messageElement) {
    //         messageElement.innerHTML = 'Такой пользователь уже существует';
    //     } else {
    //         throw new Error(`HTML-элемент не найден. ${response.status} — ${response.statusText}`)
    //     }

    //     return response;
    // } else {

    //     if (messageElement) {
    //         messageElement.innerHTML = 'Что-то пошло не так';
    //     } else {
    //         throw new Error(`HTML-элемент не найден. ${response.status} — ${response.statusText}`)
    //     }
    // }

    // throw new Error(`${response.status} — ${response.statusText}`); 
}

function tokenIs (json: Token) {

    if (!json.token){ 
        let TokenErrorElement = document.getElementById('token-error');
        if (TokenErrorElement) {
            TokenErrorElement.innerHTML = 'Ошибка получения токена';

            throw new Error('Token is not exist')
        }
    } 

    return json;   
}