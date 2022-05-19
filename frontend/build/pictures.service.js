var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { basicGalleryURL } from "./url.js";
import { TokenService } from "./token.service.js";
import { ErrorService } from "./error.service.js";
import { FetchFabric } from "./fetch-fabric.js";
const tokenService = new TokenService();
const errorService = new ErrorService();
const fetch = new FetchFabric();
const uploadFile = document.getElementById("file");
const formData = new FormData();
export class GalleryService {
    goToNewGalleryPage() {
        return __awaiter(this, void 0, void 0, function* () {
            let requestGalleryURL = basicGalleryURL + window.location.search;
            try {
                const response = yield fetch.makeFetch(requestGalleryURL, "GET", "application/json");
                if (response) {
                    this.checkResponse(response);
                    let responseObj = yield response.json();
                    this.createLinks(responseObj);
                    this.createImages(responseObj);
                }
                else {
                    throw new Error('нет ответа от fetch');
                }
            }
            catch (error) {
                console.log(error);
                alert(error);
            }
        });
    }
    checkResponse(response) {
        if (response.ok) {
            return response;
        }
        let errorMessage;
        if (response.status === 401) {
            errorMessage = "Токен некорректен или отсутствует. Повторите авторизацию.";
            errorService.writeErrorMessage(errorMessage, response);
        }
        else if (response.status === 404) {
            errorMessage = "Такой страницы не существует.";
            errorService.writeErrorMessage(errorMessage, response);
        }
        throw new Error(`${response.status} — ${response.body}`);
    }
    createLinks(imagesObject) {
        let totalPages = imagesObject.total;
        let linksSection = document.getElementById("links");
        for (let i = 1; i <= totalPages; i++) {
            let pictureLink = document.createElement('li');
            pictureLink.innerHTML = `<a>${i}</a>`;
            linksSection === null || linksSection === void 0 ? void 0 : linksSection.append(pictureLink);
        }
        return imagesObject;
    }
    createImages(imagesObject) {
        let imagesObjArray = imagesObject.objects;
        let imagesPathsArr = imagesObjArray.map(imageObject => imageObject.path);
        let imageSection = document.getElementById("photo-section");
        for (const imgPath of imagesPathsArr) {
            let galleryImage = document.createElement('img');
            galleryImage.src = './resources/images/' + imgPath;
            imageSection === null || imageSection === void 0 ? void 0 : imageSection.append(galleryImage);
        }
    }
    uploadImage(data, image) {
        return __awaiter(this, void 0, void 0, function* () {
            let postUrl = basicGalleryURL + '/upload-new';
            let body = JSON.stringify(data);
            console.log('body from upload: ' + JSON.stringify(data));
            if (uploadFile.files) {
                for (const file of uploadFile.files) {
                    formData.append("file", file);
                }
            }
            try {
                const response = yield fetch.makeFetch(postUrl, "POST", undefined, body);
                if (response) {
                    const uploadRes = yield fetch.makeFetch(response, "PUT", undefined, image);
                    if (uploadRes.status === 200) {
                        console.log('Картинка загружена');
                    }
                }
                let currentPage = window.location;
                let searchParam = currentPage.search;
                console.log(response);
                // window.location.href = "gallery.html" + searchParam;
            }
            catch (error) {
                let err = error;
                console.log(err);
            }
        });
    }
}
