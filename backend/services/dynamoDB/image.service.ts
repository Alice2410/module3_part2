import { DynamoDBService } from "../../services/dynamoDB/dynamo.service";
import { getEnv } from "../../helper/environment";
import { ImageMetadata } from "api/gallery/gallery.inteface";
import { 
  HttpInternalServerError,
  AlreadyExistsError
} from '@floteam/errors';

export class ImageDBService {
  private readonly dynamoDBService = new DynamoDBService();
  private readonly tableName = getEnv('TABLE_NAME');
  private readonly imagePrefix = getEnv('IMAGE_TAG');

  async addNewImage(metadata: ImageMetadata, email: string) {
    console.log('in addNewImage');
    
    try {
      if (metadata) {
        console.log(metadata);
        
        let result = await this.createImageInDB(email, metadata);
        console.log(result);
        

        if (!result) {
          throw new AlreadyExistsError('Пользователь существует')
        }
  
        return result;
          
      }         
    } catch(err) {
      throw new HttpInternalServerError('Ошибка добавления пользователя')
    }
  }
  
  async createImageInDB(email:string, metadata: ImageMetadata) {
    try{
      console.log('try to create image', email, metadata);

      const attributes = {
        path: metadata.name,
        metadata: metadata,
      }
      const newImage = await this.dynamoDBService.putItem(email, `${this.imagePrefix}#${email}#${metadata.name}`, this.tableName, attributes);
      console.log('new image: ', newImage);
      
      return newImage;
    } catch(e) {
     console.log('error in createImageInDB: ', e);
     
      throw new HttpInternalServerError(e.message)
    }
  }
}