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

  async uploadImages(imagesArr: MultipartRequest, userEmail: string) {
    const file = imagesArr.files[0]

    return this.service.uploadImage(file, userEmail);
  }
  
  async uploadDefaultImages () {
    return this.service.uploadDefaultImages();
  }
}
