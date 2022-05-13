import fs from 'fs';
import path from "path";
import * as config from 'services/config';
import { Image } from '@models/DynamoDB/image';
import { ObjectId } from "mongodb";
import { ImageInterface } from 'api/gallery/gallery.inteface';
import { 
  HttpInternalServerError,
} from '@floteam/errors';

export class ImageService {
  async getArrayLength (id: ObjectId, filter: string) { 
    try {
      const findFilter = getImagesFilter(filter, id);
      const imagesNumber = await Image.countDocuments(findFilter);
  
      return imagesNumber;
    } catch(e) {
      throw new HttpInternalServerError(e.message)
    }
  }
  
  async getImages(filter: string, page: number, limit: number, id: ObjectId) { 
    try {
      const findFilter = getImagesFilter(filter, id);
      const arrForPage = await Image.find(findFilter, null, {skip: limit * page - limit, limit: limit});
  
      return arrForPage as unknown as object[];
    } catch(e) {
      throw new HttpInternalServerError(e.message)
    }
  }
  
  async saveImagesToDB() {
    try {
      const imagesPathsArr = await getImagesArr();
      
      for(const imgPath of imagesPathsArr) {
        const imageIsExist = await Image.exists({path: imgPath});
  
        if(!imageIsExist) {
          try{
            const image = await this.addImage(imgPath);
          } catch(err) {
              let error = err as Error;
              console.log(error.message)
          }
        }
      }
    } catch(e) {
      throw new HttpInternalServerError('Ошибка сохранения картинки в бд')
    }
  }
  
  async addImage (imagePath: string, owner?: ObjectId) {
    try { 
      const metadata = await getMetadata(imagePath);
      const image: ImageInterface = await Image.create({path: imagePath, metadata: metadata, owner: owner ?? null});
      
      return image;
    } catch(e) {
      throw new HttpInternalServerError(e.message)
    }
  }
}

async function getMetadata(imageName: string){
  const imgPath = path.join(config.IMAGES_PATH, imageName);
  const metadata = await fs.promises.stat(imgPath);
  
  return metadata;
}

async function getImagesArr() { 
  try {
    const imagesArr = await fs.promises.readdir(config.IMAGES_PATH);
  
    return imagesArr;
  } catch(e) {
    throw new HttpInternalServerError(e.message)
  }
  
}

function getImagesFilter(filter: string, id: ObjectId) {
  return (filter === 'true') ? {'owner': id} : {$or: [{'owner': id}, {'owner': null}]}
}