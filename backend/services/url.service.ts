import { ImageMetadata } from "api/gallery/gallery.inteface";
import { getEnv } from "helper/environment";
import { S3Service } from "./s3Service";

export class URLService {
  private s3 = new S3Service();
  private bucket = getEnv('BUCKET');

  async generatePreSignedPutUrl(metadata: ImageMetadata) {
    const imageName = `${metadata.name}`;
    const uploadToS3Url = await this.s3.getPreSignedPutUrl(imageName, this.bucket);

    console.log('PutUrl: ', uploadToS3Url);
    return uploadToS3Url;
  }

  async generatePreSignedGetUrl(imageName: string) {
    const getFromS3Url = await this.s3.getPreSignedGetUrl(imageName, this.bucket);

    console.log('PutUrl: ', getFromS3Url);
    return getFromS3Url;
  }
}