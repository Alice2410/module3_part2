import { Token, basicGalleryURL, Gallery, tokenTimestampKey, localStorageTokenKey, ImageObject } from "./url.js";
import { TokenService } from "./token.service.js";
import { ErrorService } from "./error.service.js";
import { FetchFabric } from "./fetch-fabric.js";

const tokenService = new TokenService();
const errorService = new ErrorService();
const fetch = new FetchFabric();

const uploadFile = document.getElementById("file") as HTMLInputElement;
const formData = new FormData();

export class GalleryService {

  async goToNewGalleryPage() {  //fetch на получение
    let requestGalleryURL = basicGalleryURL + window.location.search;
    
    try {
        const response = await fetch.makeFetch(requestGalleryURL, "GET", "application/json");
        // let responseGalleryObj = await response.clone().json();
        // console.log(responseGalleryObj);
        
        if (response) {

          this.checkResponse(response);
          let responseObj: Gallery = await response.json();
          console.log(responseObj);
          
          this.createLinks(responseObj);
          this.createImages(responseObj);

        } else {
          throw new Error('нет ответа от fetch')
        }
    } catch(error) {
        console.log(error);
        alert(error);
    }
  }

  checkResponse (response: Response) {
    if (response.ok) {
      console.log('response is ok');
      
        return response;
    } 

    let errorMessage: string;

    if (response.status === 401) {
        errorMessage = "Токен некорректен или отсутствует. Повторите авторизацию."
        errorService.writeErrorMessage (errorMessage, response);
    } else if (response.status === 404) {
        errorMessage = "Такой страницы не существует."
        errorService.writeErrorMessage (errorMessage, response);
    }

    throw new Error(`${response.status} — ${response.body}`);
    
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
    console.log('paths: ', imagesPathsArr);
  
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
    console.log('body from upload: ' + JSON.stringify(data));
    
    if (uploadFile.files) {

        for (const file of uploadFile.files) {
            formData.append("file", file);
        }
    }
    
    try {
        const response = await fetch.makeFetch(postUrl, "POST", undefined, body);

        if(response) {
          const uploadRes = await fetch.makeFetch(response, "PUT", undefined, image);
          if (uploadRes.status === 200) {
            console.log('Картинка загружена');
          }
        }
        
        let currentPage = window.location;
        let searchParam = currentPage.search;
        console.log(response);
        // window.location.href = "gallery.html" + searchParam;
    } catch(error) {
        let err = error as Error;
        console.log(err);
    }
  }
}


