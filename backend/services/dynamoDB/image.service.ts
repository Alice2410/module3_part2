import { DynamoDBService } from "../../services/dynamoDB/dynamo.service";
import { getEnv } from "../../helper/environment";
import { ImageMetadata } from "api/gallery/gallery.inteface";
import { 
  HttpInternalServerError,
  AlreadyExistsError,
  HttpBadRequestError
} from '@floteam/errors';

export class ImageDBService {
  private readonly dynamoDBService = new DynamoDBService();
  private readonly tableName = getEnv('TABLE_NAME');
  private readonly imagePrefix = getEnv('IMAGE_TAG');

  async getImages(email: string, filter: string) {
    console.log('in getImages');

    try {
      console.log(email, filter);

      // if (filter === 'true') {

        const params = {
          tableName: this.tableName,
          keyCondition: 'partitionKey = :e AND begins_with(sortKey , :ip)',
          attributeValues: {
            ':e': `${email}`,
            ':ip': `${this.imagePrefix}`
          },
        }
        const images = this.dynamoDBService.query(params.tableName, params.attributeValues, params.keyCondition)
          
        return images;
      // }
      
    } catch(e) {
      if (e instanceof HttpBadRequestError){
        throw new HttpBadRequestError(e.message); 
      } 

      throw new HttpInternalServerError(e.message);
    }
    
  }

  async addNewImage(metadata: ImageMetadata, email: string) {
    console.log('in addNewImage');
    
    try {
      if (metadata) {
        console.log(metadata);
        
        let image = await this.createImageInDB(email, metadata);
        console.log('image: ', image);
        

        if (!image) {
          throw new AlreadyExistsError('Пользователь существует')
        }
  
        return image;
          
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
        resource: 'image'
      }
      const newImage = this.dynamoDBService.putItem(email, `${this.imagePrefix}#${email}#${metadata.name}`, this.tableName, attributes);
      console.log('new image: ', newImage);
      
      return newImage;
    } catch(e) {
     console.log('error in createImageInDB: ', e);
     
      throw new HttpInternalServerError(e.message)
    }
  }
}