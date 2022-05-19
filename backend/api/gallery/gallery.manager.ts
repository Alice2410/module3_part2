import { QueryParameters } from './gallery.inteface';
import { ResponseObject } from './gallery.inteface';
import { GalleryService } from './gallery.service';
import { ImageMetadata } from './gallery.inteface';
import { MultipartRequest } from 'lambda-multipart-parser';

export class GalleryManager {
  private readonly service: GalleryService;

  constructor() {
    this.service = new GalleryService();
  }

  async getImages(queryParams: QueryParameters, userEmail: string) {
    const page = queryParams?.page || '1';
    const limit = queryParams?.limit || '2';
    const filter = queryParams?.filter || 'false';
    
    const pageNumber = +page;
    const limitNumber = +limit;

    let mahagerRes = await this.service.getImages(pageNumber, limitNumber, filter, userEmail);
    console.log('manager res: ', mahagerRes);
    

    return mahagerRes;
  }

  async uploadImages(email: string, metadata: string) {
    
    const metadataObject: ImageMetadata = JSON.parse(metadata);
    console.log('metadata: ', metadataObject);
    
    const result = await this.service.uploadImage(email, metadataObject);
    console.log('result from upload manager: ', result);
  
    return result;
  }
  
  async uploadDefaultImages () {
    return this.service.uploadDefaultImages();
  }
}
