import { Metadata } from "./metadata.js";
import { TokenService } from "./token.service.js";
import { GalleryService } from "./pictures.service.js";
const linksList = document.getElementById('links');
const uploadImageForm = document.getElementById('upload');
const uploadFile = document.getElementById("file");
const filterButton = document.getElementById("filter-button");
const metadataService = new Metadata();
const tokenService = new TokenService();
const galleryService = new GalleryService();
setInterval(tokenService.checkTokenIs, 100000);
tokenService.checkLocalStorage();
galleryService.goToNewGalleryPage();
renderButton();
addListeners();
let metadata;
let image;
function startUpload(e) {
    e.preventDefault();
    galleryService.uploadImage(metadata, image);
}
function createNewAddressOfCurrentPage(e) {
    let currentPage = window.location.href;
    let params = new URL(currentPage).searchParams;
    let number = e.target.textContent;
    params.set('page', number);
    window.location.href = "gallery.html?" + params;
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
function addListeners() {
    linksList === null || linksList === void 0 ? void 0 : linksList.addEventListener("click", createNewAddressOfCurrentPage);
    filterButton === null || filterButton === void 0 ? void 0 : filterButton.addEventListener("click", changeFilter);
    uploadImageForm === null || uploadImageForm === void 0 ? void 0 : uploadImageForm.addEventListener("submit", startUpload);
    uploadFile.addEventListener('change', (e) => {
        let evT = e.target;
        image = (evT.files)[0];
        metadata = metadataService.getMetadata(e);
    });
}
