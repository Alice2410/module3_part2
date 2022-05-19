import fs from 'fs';
import path from "path";
import * as config from '../../services/config';
import { Image } from './image';
import { ObjectId } from "mongodb";
import { ImageInterface } from '../../api/gallery/gallery.inteface';
import { 
  HttpInternalServerError,
} from '@floteam/errors';

export class ImageService {
  // async getArrayLength (email: string, filter: string) { 
  //   try {
  //     // const findFilter = getImagesFilter(filter, email); не нужен фильтр для MongoDB. Вместо этого будет query для email и IMAGE#...
  //     const imagesNumber = await Image.countDocuments(findFilter); //тут будет получение длины массива из query.Items
  
  //     return imagesNumber;
  //   } catch(e) {
  //     throw new HttpInternalServerError(e.message)
  //   }
  // }
  
  // async getImages(filter: string, page: number, limit: number, email: string) { 
  //   try {
  //     const findFilter = getImagesFilter(filter, id);
  //     const arrForPage = await Image.find(findFilter, null, {skip: limit * page - limit, limit: limit});
  
  //     return arrForPage as unknown as object[];
  //   } catch(e) {
  //     throw new HttpInternalServerError(e.message)
  //   }
  // }
  
}

async function getMetadata(imageName: string){//как получать метадату для картинки из S3?
  const imgPath = path.join(config.IMAGES_PATH, imageName);
  const metadata = await fs.promises.stat(imgPath);
  
  return metadata;
}

async function getImagesArr() {//может быть менять не надо будет 
  try {
    const imagesArr = await fs.promises.readdir(config.IMAGES_PATH);
  
    return imagesArr;
  } catch(e) {
    throw new HttpInternalServerError(e.message)
  }
  
}

function getImagesFilter(filter: string, id: ObjectId) {//не надо
  return (filter === 'true') ? {'owner': id} : {$or: [{'owner': id}, {'owner': null}]}
}