import { Token, basicGalleryURL, Gallery, tokenTimestampKey, localStorageTokenKey, ImageObject } from "./url.js";
import { TokenService } from "./token.service.js";
import { ErrorService } from "./error.service.js";
import { FetchFactory } from "./fetch-fabric.js";

const tokenService = new TokenService();
const errorService = new ErrorService();
const fetch = new FetchFactory();

const uploadFile = document.getElementById("file") as HTMLInputElement;
const formData = new FormData();

export class GalleryService {

  async goToNewGalleryPage() {  
    let requestGalleryURL = basicGalleryURL + window.location.search;
    
    try {
        const response: Gallery = await fetch.makeFetch(requestGalleryURL, "GET", true, "application/json");

        if (response) {
          this.checkResponse(response); 
          this.createLinks(response);
          this.createImages(response);
        } else {
          throw new Error('нет ответа от fetch')
        }
    } catch(error) {
        console.log(error);
        alert(error);
    }
  }

  checkResponse (response: Gallery) {
    if (response) {
      console.log('response is ok');
      
      return response;
    } 

    throw new Error(response);
  }

  createLinks(imagesObject: Gallery){
    let totalPages = imagesObject.total;
    let linksSection = document.getElementById("links");

    for ( let i = 1; i <= totalPages; i++) {
        let pictureLink = document.createElement('li');
        pictureLink.innerHTML = `<a>${i}</a>`
        linksSection?.append(pictureLink);
    }

    return imagesObject;
  }

  createImages(imagesObject: Gallery) {
    let imagesPathsArr = imagesObject.objects;
    let imageSection = document.getElementById("photo-section");

    for (const imgPath of imagesPathsArr) {
        let galleryImage = document.createElement('img');
        galleryImage.src = imgPath;
        imageSection?.append(galleryImage);
    }
  }

  public async uploadImage(data: object, image: Blob) { //fetch на отправку
    let postUrl = basicGalleryURL + '/upload-new';
    let body = JSON.stringify(data);
 
    if (uploadFile.files) {
        for (const file of uploadFile.files) {
            formData.append("file", file);
        }
    }
    
    try {
        const response = await fetch.makeFetch(postUrl, "POST", true ,undefined, body);
        if(response) {
          const uploadRes = await fetch.makeFetch(response, "PUT", true, undefined, image);
          if (uploadRes.status === 200) {
            console.log('Картинка загружена');
          }
        }
        
        let currentPage = window.location;
        let searchParam = currentPage.search;
        window.location.href = "gallery.html" + searchParam;
    } catch(error) {
        let err = error as Error;
        console.log(err);
    }
  }
}


