import { TokenService } from "./token.service.js";
const tokenService = new TokenService();
export class ErrorService {
    writeErrorMessage(message, response) {
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.innerHTML = message;
            const toAuthorizationLink = document.getElementById('back-gallery');
            if (toAuthorizationLink) {
                toAuthorizationLink.classList.remove('back-link--disabled');
                toAuthorizationLink.classList.add('aback-link--abled');
                toAuthorizationLink.addEventListener("click", tokenService.redirectToAuthorization);
            }
        }
        throw new Error(`${response.status} — ${response.body}`);
    }
}
