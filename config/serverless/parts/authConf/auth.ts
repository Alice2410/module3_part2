import { AWSPartitial } from '../../types';
import {signUp, logIn, uploadDefaultUsers, authenticator} from "./index";

export const authConfig: AWSPartitial = {
  provider: {
    httpApi: {
      authorizers: {
        authenticator: {
          type: "request",
          functionName: "authenticator",
          identitySource: "$request.header.Authorization",
          enableSimpleResponses: true,
        }
      }
    }
  },
  functions: {
    authenticator, signUp, logIn, uploadDefaultUsers
  },
}