import path from "path";
import fs from "fs";
import * as config from "../../services/config";
import { ResponseObject } from "./gallery.inteface";
import { MultipartFile } from 'lambda-multipart-parser';
import { ImageService } from "../../models/DynamoDB/image-operations";
import { ImageDBService } from "services/dynamoDB/image.service";
import { S3Service } from "../../services/s3Service";
import { URLService } from "services/url.service";
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

  async getImages(pageNumber: number, limitNumber: number, filter: string, userEmail: string) {
    let responseGalleryObj: ResponseObject = {
      objects: [],
      page: 0,
      total: 0,
    }
    
    try {
      // const userId: ObjectId = await User.getId(userEmail);

      const allImagesNumber = await Image.getArrayLength(userEmail, filter);
      const total = await getTotalPages(limitNumber, allImagesNumber);
      const page = checkPageNumber(pageNumber, total);

      if (page) {
        const objects = await Image.getImages(filter, page, limitNumber, userEmail)

        responseGalleryObj.objects = objects;
        responseGalleryObj.page = page;
        responseGalleryObj.total = total;

        return responseGalleryObj;
      } else {
        throw new HttpBadRequestError(`Страницы не существует`)
      }
    } catch(e) {
      if (e instanceof HttpBadRequestError){
        throw new HttpBadRequestError(e.message); 
      } 

      throw new HttpInternalServerError(e.message);
    }
  }

  async uploadImage(email: string, metadata: ImageMetadata) {
    try {
      // const userId: ObjectId = await User.getId(userEmail);
      console.log('image: ', metadata);

      //сохранить в бд
      const addImgRes = await this.imageDBService.addNewImage(metadata, email);
      console.log('addImgRes: ', addImgRes);
      

      //сделать подписанную ссылку
      const uploadLink = await this.urlService.generatePreSignedPutUrl(metadata);

      console.log('presigned upload link: ', uploadLink);
      
      //сохранить в s3

      

      // const fileName = await saveImageLocal(image);
      // await Image.addImage(fileName, userId);
      return uploadLink;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }

    
  }

  async uploadDefaultImages () {
    try {

      // const image = await Image.saveImagesToDB();

      // return 'Картинки добавлены';
      const BUCKET_NAME = 'alice-image-bucket';
      const fileContent = fs.readFileSync('/cat.jpeg');
  
      const params = {
        Bucket: BUCKET_NAME,
        Key: 'cat.jpeg', // File name you want to save as in S3
        Body: fileContent,
      };
      const s3 = new S3Service();
  
      await s3.put(params.Key, params.Body, params.Bucket);
      
    } catch (err) {
      throw new HttpInternalServerError(err.message);
    }
  }
}

function checkPageNumber(pageNumber: number, total: number) {
  return ((pageNumber > 0) && (pageNumber <= total)) ? pageNumber : false;
}

async function getTotalPages(limit: number, imagesNumber: number) {
         
  return Math.ceil(imagesNumber / limit);
}

async function saveImageLocal(file: MultipartFile) {
  let fileName = file.filename;
  let noSpaceFileName = fileName.replace(/\s/g, '');
  let newFileName = 'user' + '_' +  noSpaceFileName;

  try {
    await fs.promises.writeFile(
      path.join(pathToImgDir, newFileName),
      file.content
    );

    return newFileName;
  } catch(e) {
    throw new HttpInternalServerError(e.message)
  }
}

