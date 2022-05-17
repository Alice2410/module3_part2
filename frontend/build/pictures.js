var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { basicGalleryURL, tokenTimestampKey, localStorageTokenKey } from "./url.js";
const linksList = document.getElementById('links');
const uploadImageForm = document.getElementById('upload');
const uploadFile = document.getElementById("file");
const filterButton = document.getElementById("filter-button");
let formData = new FormData();
let tokenObject;
// setInterval(checkTokenIs, 1000);
// checkLocalStorage();
goToNewGalleryPage();
renderButton();
linksList === null || linksList === void 0 ? void 0 : linksList.addEventListener("click", createNewAddressOfCurrentPage);
filterButton === null || filterButton === void 0 ? void 0 : filterButton.addEventListener("click", changeFilter);
uploadImageForm === null || uploadImageForm === void 0 ? void 0 : uploadImageForm.addEventListener("submit", startUpload);
function startUpload(e) {
    e.preventDefault();
    uploadImage();
}
function goToNewGalleryPage() {
    return __awaiter(this, void 0, void 0, function* () {
        let requestGalleryURL = basicGalleryURL + window.location.search;
        try {
            const response = yield fetch(requestGalleryURL, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + tokenObject.token
                }
            });
            checkResponse(response);
            let responseObj = yield response.json();
            createLinks(responseObj);
            createImages(responseObj);
        }
        catch (error) {
            console.log(error);
            alert(error);
        }
    });
}
function uploadImage() {
    return __awaiter(this, void 0, void 0, function* () {
        let postUrl = '/gallery';
        if (uploadFile.files) {
            for (const file of uploadFile.files) {
                formData.append("file", file);
            }
        }
        try {
            yield fetch(postUrl, {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + tokenObject.token
                },
                body: formData
            });
            let currentPage = window.location;
            let searchParam = currentPage.search;
            window.location.href = "gallery.html" + searchParam;
        }
        catch (error) {
            let err = error;
            console.log(err.message);
        }
    });
}
function createLinks(imagesObject) {
    let totalPages = imagesObject.total;
    let linksSection = document.getElementById("links");
    for (let i = 1; i <= totalPages; i++) {
        let pictureLink = document.createElement('li');
        pictureLink.innerHTML = `<a>${i}</a>`;
        linksSection === null || linksSection === void 0 ? void 0 : linksSection.append(pictureLink);
    }
    return imagesObject;
}
function createImages(imagesObject) {
    let imagesObjArray = imagesObject.objects;
    let imagesPathsArr = imagesObjArray.map(imageObject => imageObject.path);
    let imageSection = document.getElementById("photo-section");
    for (const imgPath of imagesPathsArr) {
        let galleryImage = document.createElement('img');
        galleryImage.src = './resources/images/' + imgPath;
        imageSection === null || imageSection === void 0 ? void 0 : imageSection.append(galleryImage);
    }
}
function checkTokenIs() {
    if ((Date.now() - JSON.parse(localStorage.getItem(tokenTimestampKey) || "")) >= 600000) {
        localStorage.removeItem(localStorageTokenKey);
        localStorage.removeItem(tokenTimestampKey);
        linksList === null || linksList === void 0 ? void 0 : linksList.removeEventListener("click", createNewAddressOfCurrentPage);
        redirectToAuthorization();
    }
}
function redirectToAuthorization() {
    let currentPage = window.location;
    let searchParam = currentPage.search;
    window.location.href = "index.html" + searchParam;
}
function checkResponse(response) {
    if (response.ok) {
        return response;
    }
    let errorMessage;
    if (response.status === 401) {
        errorMessage = "Токен некорректен или отсутствует. Повторите авторизацию.";
        writeErrorMessage(errorMessage, response);
    }
    else if (response.status === 404) {
        errorMessage = "Такой страницы не существует.";
        writeErrorMessage(errorMessage, response);
    }
    throw new Error(`${response.status} — ${response.body}`);
}
function checkLocalStorage() {
    if (localStorage.getItem(localStorageTokenKey)) {
        tokenObject = JSON.parse(localStorage.getItem(localStorageTokenKey) || '');
    }
    else {
        redirectToAuthorization();
    }
}
function createNewAddressOfCurrentPage(e) {
    let currentPage = window.location.href;
    let params = new URL(currentPage).searchParams;
    let number = e.target.textContent;
    params.set('page', number);
    window.location.href = "gallery.html?" + params;
}
function writeErrorMessage(message, response) {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.innerHTML = message;
        const toAuthorizationLink = document.getElementById('back-gallery');
        if (toAuthorizationLink) {
            toAuthorizationLink.classList.remove('back-link--disabled');
            toAuthorizationLink.classList.add('aback-link--abled');
            toAuthorizationLink.addEventListener("click", redirectToAuthorization);
        }
    }
    throw new Error(`${response.status} — ${response.body}`);
}
function changeFilter(e) {
    let currentPage = window.location.href;
    let params = new URL(currentPage).searchParams;
    let filter = params.get('filter');
    if (filter === 'false') {
        params.set('filter', 'true');
        window.location.href = "gallery.html?" + params;
    }
    if (filter === 'true') {
        params.set('filter', 'false');
        window.location.href = "gallery.html?" + params;
    }
}
function renderButton() {
    let filter = new URL(window.location.href).searchParams.get('filter');
    if (filter === 'true') {
        filterButton.textContent = 'Показать все картинки';
    }
    else {
        filterButton.textContent = 'Показать мои картинки';
    }
}
