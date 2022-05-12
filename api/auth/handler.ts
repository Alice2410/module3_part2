import { errorHandler } from '@helper/http-api/error-handler';
import { createResponse } from '@helper/http-api/response';
import {
  APIGatewayProxyHandlerV2,
  Handler
} from "aws-lambda";
import { AuthorizationManager } from './auth.manager';
import { jwtToken } from './auth.interface';
import { 
  HttpUnauthorizedError,
} from '@floteam/errors';
 import { APIGatewayAuthorizerSimpleResult, APIGatewayRequestAuthorizerHttpApiPayloadV2Event } from "@interfaces/api-gateway-authorizer.interface";

export const signUp: APIGatewayProxyHandlerV2 = async(event, context) => {
  try { 
    const manager = new AuthorizationManager();
    if (!event.body) {
      throw new HttpUnauthorizedError('Нет пользовательских данных')
    } 
    const response = await manager.signUp(event.body);

    return createResponse(200, response);
  } catch (e) {

    return errorHandler(e);
  }
}

export const logIn: APIGatewayProxyHandlerV2 = async (event, context) => {
  try{
    const manager = new AuthorizationManager();

    if (!event.body) {
      throw new HttpUnauthorizedError('Нет пользовательских данных')
    } 

    const token = await manager.logIn(event.body);

    return createResponse(200, {token});
  } catch(e) {
    return errorHandler(e);
  }
}

export const uploadDefaultUsers: APIGatewayProxyHandlerV2 = async (event, context) => {
  console.log('upload');
  

  try {
    const manager = new AuthorizationManager();
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
  > = async (event, context) => {

  try {
    const manager = new AuthorizationManager();
    const token = event.identitySource?.[0]

    console.log('token', token);
    const user = await manager.authenticate(token!) as jwtToken;
  
    return generateSimpleResponse(true, {email: user.email});
  } catch (err) {
    return generateSimpleResponse(false, {});
  }
}


