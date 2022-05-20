import { HttpInternalServerError } from '@floteam/errors';
import { URLService } from './url.service';

export class GalleryUtil {
  urlService = new URLService();

  checkPageNumber(pageNumber: number, total: number) {
    return ((pageNumber > 0) && (pageNumber <= total)) ? pageNumber : false;
  }
  
  async getTotalPages(limit: number, imagesNumber: number | undefined) {
    if(imagesNumber) {
      return Math.ceil(imagesNumber / limit);
    }
    
    throw new HttpInternalServerError('Картинки не получены')
  }
  
  async getLinks(items:{[key: string]: any;}[] | undefined, limit: number, page: number) {
    if(items) {
      const start = limit * (page - 1);
      const end = limit * page;
  
      const imagesNamesArr = items.slice(start, end).map((item) => {
        return item.metadata.name;
      });
  
      const imagesLinks = imagesNamesArr.map(async (imageName: string) => {
        let imageLink = this.urlService.generatePreSignedGetUrl(imageName);
        return imageLink;
      });
  
      const links = await Promise.all(imagesLinks); 
  
      return links;
    }
  }
}