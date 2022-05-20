import { ImageMetadata } from "./url.js";
import { Metadata } from "./metadata.js";
import { TokenService } from "./token.service.js";
import { GalleryService } from "./pictures.service.js";
import { FetchFactory } from "./fetch-fabric.js";

const linksList = document.getElementById('links');
const uploadImageForm = document.getElementById('upload') as HTMLFormElement;
const uploadFile = document.getElementById("file") as HTMLInputElement;
const filterButton = document.getElementById("filter-button") as HTMLButtonElement;

const metadataService = new Metadata();
const tokenService = new TokenService();
const galleryService = new GalleryService();
const fetchFactory = new FetchFactory();


tokenService.assignToken();
fetchFactory.assignToken();
setInterval(tokenService.checkTokenIs, 100000);
tokenService.checkLocalStorage();
galleryService.goToNewGalleryPage();
renderButton();
addListeners();

let metadata: ImageMetadata;
let image: Blob;

function startUpload(e: Event) {
    e.preventDefault();
    
    
    galleryService.uploadImage(metadata, image);
}

function createNewAddressOfCurrentPage(e: Event) {
    let currentPage = window.location.href;
    let params = new URL(currentPage).searchParams;
    let number = (e.target as HTMLLinkElement).textContent as string;
    params.set('page', number);
    window.location.href = "gallery.html?" + params;
}

function changeFilter(e: Event) {
    let currentPage = window.location.href;
    let params = new URL(currentPage).searchParams;
    let filter = params.get('filter');
    
    if (filter === 'false'){
        params.set('filter', 'true');
        window.location.href = "gallery.html?" + params;
    } 

    if (filter === 'true'){ 
        params.set('filter', 'false');
        window.location.href = "gallery.html?" + params;
    }
}

function renderButton() {
    let filter = new URL(window.location.href).searchParams.get('filter');

    if (filter === 'true'){
        filterButton.textContent = 'Показать все картинки';
    } else {
        filterButton.textContent = 'Показать мои картинки';
    }
}

function addListeners () {
    linksList?.addEventListener("click", createNewAddressOfCurrentPage);
    filterButton?.addEventListener("click", changeFilter);
    uploadImageForm?.addEventListener("submit", startUpload);
    uploadFile.addEventListener('change', (e) => {
        
        let evT = e.target as HTMLInputElement;
        image = (evT.files)![0]
        metadata = metadataService.getMetadata(e)
    });
}


    