import { AWSPartitial } from '../../types';
import { getGallery, getUploadLink} from './index';

export const galleryConfig: AWSPartitial = {
  functions: { getGallery, getUploadLink }
}