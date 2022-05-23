import { errorHandler } from '../../helper/http-api/error-handler';
import { createResponse } from '../../helper/http-api/response';
import { log } from '../../helper/logger';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { QueryParameters } from './gallery.inteface';
import { GalleryManager } from './gallery.manager';
import { HttpInternalServerError } from '@floteam/errors';

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

export const getGallery: APIGatewayProxyHandler = async (event, context) => {
  log(event);

  try {
    const manager = new GalleryManager();
    const queryParams = event.queryStringParameters as unknown as QueryParameters;
    const email: string = event.requestContext.authorizer?.lambda.email;
    const result = await manager.getImages(queryParams, email);

    return createResponse(200, result);
  } catch (e) {
    return errorHandler(e)
  }
};

export const getUploadLink: APIGatewayProxyHandler = async (event) => {
  try {
    console.log('in handler, event: ', event);
    const manager = new GalleryManager();

    const email: string = event.requestContext.authorizer?.lambda.email;
    console.log('email: ', email)

    if(event.body) {
      const result = await manager.uploadImages(email, event.body);
      console.log('upload res handler: ', result);
      
      return createResponse(200, result);
    }

    throw new HttpInternalServerError('Нет event.body')
    
  } catch (e) {
    return errorHandler(e)
  }
};
