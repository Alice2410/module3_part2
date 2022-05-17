import { QueryParameters } from './gallery.inteface';
import { ResponseObject } from './gallery.inteface';
import { GalleryService } from './gallery.service';
import { MultipartRequest } from 'lambda-multipart-parser';

export class GalleryManager {
  private readonly service: GalleryService;

  constructor() {
    this.service = new GalleryService();
  }

  getImages(queryParams: QueryParameters, userEmail: string): Promise<ResponseObject> {
    const page = queryParams?.page || '1';
    const limit = queryParams?.limit || '2';
    const filter = queryParams?.filter || 'false';
    
    const pageNumber = +page;
    const limitNumber = +limit;

    return this.service.getImages(pageNumber, limitNumber, filter, userEmail);
  }

  async uploadImages(body: string, email: string) {
    // const file = imagesArr.files[0]
    
    const parsedBody = body;
    console.log('par b: ', parsedBody);
    // console.log('email: ', userEmail);
    
    

    return this.service.uploadImage(body, email);
  }
  
  async uploadDefaultImages () {
    return this.service.uploadDefaultImages();
  }
}
