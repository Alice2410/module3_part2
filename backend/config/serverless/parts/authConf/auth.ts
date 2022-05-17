import { AWSPartitial } from '../../types';
import {signUp, logIn, uploadDefaultUsers, authenticate} from "./index";

export const authConfig: AWSPartitial = {
  provider: {
    httpApi: {
      authorizers: {
        authenticate: {
          type: "request",
          functionName: "authenticate",
          identitySource: "$request.header.Authorization",
          enableSimpleResponses: true,
        }
      }
    }
  },
  functions: {
    authenticate, signUp, logIn, uploadDefaultUsers
  },
}