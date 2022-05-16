import { ObjectId } from "mongodb";
import path from "path";
import fs from "fs";
import * as config from "../../services/config";
import { ResponseObject } from "./gallery.inteface";
import { MultipartFile } from 'lambda-multipart-parser';
import { ImageService } from "@models/DynamoDB/image-operations";
import { UserService } from "@services/dynamoDB/user-operations";
import { 
  HttpBadRequestError,
  HttpInternalServerError,
 } from '@floteam/errors';

const User = new UserService();
const Image = new ImageService();

export const pathToImgDir = config.IMAGES_PATH;

export class GalleryService {
  async getImages(pageNumber: number, limitNumber: number, filter: string, userEmail: string) {
    let responseGalleryObj: ResponseObject = {
      objects: [],
      page: 0,
      total: 0,
    }
    
    try {
      // await connectToDB();
      // const userId: ObjectId = await User.getId(userEmail);
      const allImagesNumber = await Image.getArrayLength(userEmail, filter);
      const total = await getTotalPages(limitNumber, allImagesNumber);
      const page = checkPageNumber(pageNumber, total);

      if (page) {
        const objects = await Image.getImages(filter, page, limitNumber, userId)

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

  async uploadImage(image: MultipartFile, userEmail: string) {
    try {
      const userId: ObjectId = await User.getId(userEmail);
      const fileName = await saveImageLocal(image);
      await Image.addImage(fileName, userId);

    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }

    return 'Изображение загружено';
  }

  async uploadDefaultImages () {
    try {
      // await connectToDB();
      const image = await Image.saveImagesToDB();

      return 'Картинки добавлены';
    } catch (err) {
      throw new HttpInternalServerError('Картинки не были добавлены');
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

