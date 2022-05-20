import { S3 } from 'aws-sdk';
import fs from 'fs';
import {
  DeleteObjectOutput,
  DeleteObjectRequest,
  GetObjectOutput,
  GetObjectRequest,
  PutObjectOutput,
  PutObjectRequest,
} from 'aws-sdk/clients/s3';
import { getEnv } from 'helper/environment';

const region = getEnv('REGION', true);

export class S3Service {
  public s3 = new S3({region: region});

  public getPreSignedPutUrl(key: string, type: string, bucket: string) {
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: 60000000,
      ContentType: type,
    };

    return this.s3.getSignedUrlPromise('putObject', params);
  }

  public getPreSignedGetUrl(key: string, bucket: string) {
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: 60000000,
    };
    return this.s3.getSignedUrlPromise('getObject', params);
  }

  public remove(key: string, bucket: string): Promise<DeleteObjectOutput> {
    const params: DeleteObjectRequest = {
      Bucket: bucket,
      Key: key,
    };
    return this.s3.deleteObject(params).promise();
  }

  public put(key: string, body: Buffer, bucket: string, acl = 'public-read'): Promise<PutObjectOutput> {
    const params: PutObjectRequest = {
      ACL: acl,
      Bucket: bucket,
      Key: key,
      Body: body,
    };
    return this.s3.putObject(params).promise();
  }

  public get(key: string, bucket: string): Promise<GetObjectOutput> {
    const params: GetObjectRequest = {
      Bucket: bucket,
      Key: key,
    };
    return this.s3.getObject(params).promise();
  }

  

  // async getImagesArr() {//может быть менять не надо будет 
  //   try {
  //     const imagesArr = await fs.promises.readdir(config.IMAGES_PATH);
    
  //     return imagesArr;
  //   } catch(e) {
  //     throw new HttpInternalServerError(e.message)
  //   }
    
  // }
}
