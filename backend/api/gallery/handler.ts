import { errorHandler } from 'backend/helper/http-api/error-handler';
import { createResponse } from 'backend/helper/http-api/response';
import { log } from 'backend/helper/logger';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { QueryParameters } from './gallery.inteface';
import { GalleryManager } from './gallery.manager';
import { MultipartRequest } from 'lambda-multipart-parser';
import * as parser from 'lambda-multipart-parser';
import { setUncaughtExceptionCaptureCallback } from 'process';

if (process.env.LAMBDA_TASK_ROOT) {
  process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}/bin`;
}

/**
 * This is a handler file
 * It should contain Lambda functions for one feature
 * For example, Media Info feature
 * Or CRUD operations for the user entity
 */

/**
 * This is a Lambda function
 * It implements some functionality of the feature
 *
 * It should only create a feature manager object and call the manager's method
 * All required data should be provided to the manager's method
 * Do not provide event or context objects
 * You should create interfaces for required data
 * All required services except feature service should be provided to the manager's method
 *
 * This function should handle all errors and return them with proper structure
 * @param event - APIGateway, SQS Trigger, SNS Trigger, etc. event object
 * @param context
 */

export const getGallery: APIGatewayProxyHandlerV2 = async (event, context) => {
  log(event);

  try {
    const manager = new GalleryManager();
    const queryParams = event.queryStringParameters as unknown as QueryParameters;
    const userEmail = event.requestContext.authorizer?.jwt.claims.sub as string;
    const result = await manager.getImages(queryParams, userEmail);

    return createResponse(200, result);
  } catch (e) {
    return errorHandler(e)
  }
};

export const addImageGallery: APIGatewayProxyHandler = async (event) => {
  try {
    console.log('in handler, event: ', event);

    const manager = new GalleryManager();
    // const buffer = Buffer.from(event.body!);
    const email = event.requestContext.authorizer?.lambda.email;

    const json = buffer.toJSON();

    if(event.body) {
      const result = await manager.uploadImages(buffer, email);

      return createResponse(200, result);
    }

    console.log(buffer);
    console.log('event body: ', event.body);

    // const eventBody = JSON.parse(event.body!);
    // const images: MultipartRequest = await parser.parse(event);
    // console.log('images: ', images);
    // const ownerEmail: string = event.requestContext.authorizer?.jwt.claims.sub;
    // console.log('ownerEmail: ', );
    // console.log('auth: ', email); //мыло
    
    
     
  } catch (e) {
    return errorHandler(e)
  }
};

export const uploadDefaultImages: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    const manager = new GalleryManager();
    const response = await manager.uploadDefaultImages();

    return createResponse(200, response);
  } catch (err) {
    return errorHandler(err);
  }
}