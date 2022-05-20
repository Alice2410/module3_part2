import fs from "fs";
import * as config from "../../services/config";
import { ResponseObject } from "./gallery.inteface";
import { ImageService } from "../../models/DynamoDB/image-operations";
import { ImageDBService } from "services/dynamoDB/image.service";
import { S3Service } from "../../services/s3Service";
import { URLService } from "services/url.service";
import { GalleryUtil } from "services/gallery-utils.service";
import { 
  HttpBadRequestError,
  HttpInternalServerError,
 } from '@floteam/errors';
import { ImageMetadata } from "./gallery.inteface";

const Image = new ImageService();

export const pathToImgDir = config.IMAGES_PATH;

export class GalleryService {
  imageDBService = new ImageDBService();
  urlService = new URLService();
  galleryUtil = new GalleryUtil();

  async getImages(page: number, limit: number, filter: string, userEmail: string) {  
    let responseGalleryObj: ResponseObject = {
      objects: [],
      page: 0,
      total: 0,
    }

    const getImgRes = await this.imageDBService.getImages(userEmail, filter); 
    const allImagesNumber = getImgRes.Count;
    const total = await this.galleryUtil.getTotalPages(limit, allImagesNumber);
    const validPage = this.galleryUtil.checkPageNumber(page, total);
    const links = await this.galleryUtil.getLinks(getImgRes.Items, limit, page);

    if (validPage && links) {
      responseGalleryObj.total = total;
      responseGalleryObj.page = validPage;
      responseGalleryObj.objects = links;

      return responseGalleryObj;
    } else {
      throw new HttpBadRequestError(`Страницы не существует`)
    }
  }

  async uploadImage(email: string, metadata: ImageMetadata) {
    try {
      const addImgRes = await this.imageDBService.addNewImage(metadata, email);
      const uploadLink = await this.urlService.generatePreSignedPutUrl(metadata);

      return uploadLink;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}


