import { AWSPartitial } from '../../types';
import { getGallery, addImageGallery, uploadDefaultImages } from './index';

export const galleryConfig: AWSPartitial = {
  functions: { getGallery, addImageGallery, uploadDefaultImages }
}