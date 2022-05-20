import { AWSPartitial } from '../../types';
import { getGallery, addImageGallery} from './index';

export const galleryConfig: AWSPartitial = {
  functions: { getGallery, addImageGallery }
}