import { errorHandler } from 'backend/helper/http-api/error-handler';
import { createResponse } from 'backend/helper/http-api/response';
import {
  APIGatewayProxyHandlerV2,
  Handler
} from "aws-lambda";
import { AuthorizationManager } from './auth.manager';
import { jwtToken } from './auth.interface';
import { log } from 'backend/helper/logger';
import { 
  HttpUnauthorizedError,
} from '@floteam/errors';
import { APIGatewayAuthorizerSimpleResult, APIGatewayRequestAuthorizerHttpApiPayloadV2Event } from "backend/interfaces/api-gateway-authorizer.interface";

const manager = new AuthorizationManager();

export const signUp: APIGatewayProxyHandlerV2 = async(event) => {
  console.log(event);

  try { 
    if (!event.body) {
      throw new HttpUnauthorizedError('Нет пользовательских данных')
    } 
    console.log('ev b ', event.body);
    
    const response = await manager.signUp(event.body);

    return createResponse(200, response);
  } catch (e) {

    return errorHandler(e);
  }
}

export const logIn: APIGatewayProxyHandlerV2 = async (event) => {
  try{
    if (!event.body) {
      throw new HttpUnauthorizedError('Нет пользовательских данных')
    } 

    const token = await manager.logIn(event.body);

    return createResponse(200, {token});
  } catch(e) {
    return errorHandler(e);
  }
}

export const uploadDefaultUsers: APIGatewayProxyHandlerV2 = async () => {
  console.log('upload');
  

  try {
    // const manager = new AuthorizationManager();
    const response = await manager.uploadDefaultUsers();

    return createResponse(200, response);
  } catch (err) {
    return errorHandler(err);
  }
}

export function generateSimpleResponse<C extends APIGatewayAuthorizerSimpleResult['context']>(
  isAuthorized: boolean,
  context: C
  ): APIGatewayAuthorizerSimpleResult & { context: C } {

    const authResponse: APIGatewayAuthorizerSimpleResult & { context: C } = {
      isAuthorized,
      context,
    };
  
    return authResponse;
}

export const authenticate: Handler<
  APIGatewayRequestAuthorizerHttpApiPayloadV2Event,
  APIGatewayAuthorizerSimpleResult
  > = async (event) => {

  console.log('event from authenticate: ', event);
  
  try {
    const manager = new AuthorizationManager();
    const token = event.identitySource?.[0]

    console.log('token', token);
    const user = await manager.authenticate(token!) as jwtToken;
    console.log('user from auth: ', user);
    const response = {
      isAuthorized: true,
      context: {
        email: user.sub,
      }
    };

    console.log('auth handler resp: ', response);
    return response;
    
  } catch (err) {
    
    const response = {
      isAuthorized: false,
    };

    return response;
  }

}


