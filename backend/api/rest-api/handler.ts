// Remove example

import { log } from 'backend/helper/logger';
import { Handler } from 'aws-lambda';
import { errorHandler } from 'backend/helper/rest-api/error-handler';
import { APIGatewayLambdaEvent } from 'backend/interfaces/api-gateway-lambda.interface';

export const handler: Handler<APIGatewayLambdaEvent<null>, string> = async (event) => {
  log(event);

  try {
    return 'Hi!';
  } catch (error) {
    errorHandler(error);
  }
};
