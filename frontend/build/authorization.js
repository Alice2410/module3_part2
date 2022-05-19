var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loginURL, signUpUrl, localStorageTokenKey, tokenTimestampKey } from './url.js';
const authorizationForm = document.getElementById('authorization-form');
const userEmail = document.getElementById('email');
const userPassword = document.getElementById('password');
const signUpButton = document.getElementById('signup');
authorizationForm === null || authorizationForm === void 0 ? void 0 : authorizationForm.addEventListener("submit", startAuthorization);
signUpButton === null || signUpButton === void 0 ? void 0 : signUpButton.addEventListener("click", startSignUp);
function startAuthorization(e) {
    e.preventDefault();
    loginWithToken();
}
function startSignUp(e) {
    e.preventDefault();
    signUp();
}
function signUp() {
    return __awaiter(this, void 0, void 0, function* () {
        let user = {
            email: userEmail.value,
            password: userPassword.value
        };
        try {
            const response = yield fetch(signUpUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            checkSignUpResponse(response);
        }
        catch (err) {
            let error = err;
            alert(error);
        }
    });
}
function loginWithToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let user = {
            email: userEmail.value,
            password: userPassword.value
        };
        try {
            const response = yield fetch(loginURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            checkTokenResponse(response);
            const jsonObj = yield response.json();
            const tokenJson = tokenIs(jsonObj);
            saveToken(tokenJson);
            saveTokenReceiptTime();
            redirect();
        }
        catch (err) {
            let error = err;
            alert(error);
        }
    });
}
function redirect() {
    const currentPage = window.location; //currentPage: http://localhost:5000/ || http://localhost:5000/index.html?page=2
    const params = currentPage.search; //?page=2
    authorizationForm === null || authorizationForm === void 0 ? void 0 : authorizationForm.removeEventListener("submit", startAuthorization);
    if (params) {
        window.location.href = "gallery.html" + params;
    }
    else {
        let searchParams = new URLSearchParams(params);
        searchParams.append('page', '1');
        searchParams.append('limit', '2');
        searchParams.append('filter', 'false');
        window.location.href = "gallery.html?" + searchParams;
    }
}
function saveToken(json) {
    localStorage.setItem(localStorageTokenKey, JSON.stringify(json));
}
function saveTokenReceiptTime() {
    let tokenReceiptTime = Date.now();
    localStorage.setItem(tokenTimestampKey, JSON.stringify(tokenReceiptTime));
}
function checkTokenResponse(response) {
    if (response.ok) {
        return response;
    }
    else {
        let TokenErrorElement = document.getElementById('token-error');
        if (TokenErrorElement) {
            TokenErrorElement.innerHTML = 'Ошибка получения токена. Введите верные логин и пароль.';
        }
        else {
            throw new Error(`HTML-элемент не найден. ${response.status} — ${response.statusText}`);
        }
    }
    throw new Error(`${response.status} — ${response.statusText}`);
}
function checkSignUpResponse(response) {
    let messageElement = document.getElementById('token-error');
    if (response.ok) {
        if (messageElement) {
            messageElement.innerHTML = 'Пользователь успешно добавлен';
        }
        else {
            throw new Error(`HTML-элемент не найден. ${response.status} — ${response.statusText}`);
        }
        return response;
    }
    if (response.status === 401) {
        if (messageElement) {
            messageElement.innerHTML = 'Такой пользователь уже существует';
        }
        else {
            throw new Error(`HTML-элемент не найден. ${response.status} — ${response.statusText}`);
        }
        return response;
    }
    else {
        if (messageElement) {
            messageElement.innerHTML = 'Что-то пошло не так';
        }
        else {
            throw new Error(`HTML-элемент не найден. ${response.status} — ${response.statusText}`);
        }
    }
    throw new Error(`${response.status} — ${response.statusText}`);
}
function tokenIs(json) {
    if (!json.token) {
        let TokenErrorElement = document.getElementById('token-error');
        if (TokenErrorElement) {
            TokenErrorElement.innerHTML = 'Ошибка получения токена';
            throw new Error('Token is not exist');
        }
    }
    return json;
}
