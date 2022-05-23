import { UserData } from "./auth.interface";
import { AuthorizationService } from "./auth.service";
import { 
  HttpBadRequestError,
  HttpUnauthorizedError,
 } from '@floteam/errors';

export class AuthorizationManager {
  private readonly service: AuthorizationService;

  constructor() {
    this.service = new AuthorizationService();
  }

  validateUserData(userData: string, validate: boolean) {
    console.log('in validate user data');
    const userObject: UserData = JSON.parse(userData);

    if(validate) {
      if (userObject.email && userObject.password) {
        console.log('data is validated');
        
        return userObject;
      }

      throw new HttpBadRequestError('Неверные данные пользователя');
    }

    return userObject;
  }

  signUp (userData: string) {
    console.log('im manager');
    
    const userObject = this.validateUserData(userData, true);
    console.log('manager uo ', userObject);
    

    return this.service.signUp(userObject);
  }

  logIn (userData: string) {
    const userObject = this.validateUserData(userData, false);

    return this.service.logIn(userObject);
  }

  async uploadDefaultUsers() {
    return this.service.uploadDefaultUsers();
  }

  async authenticate(token: string) {
    
    if (!token) {
      
      throw new HttpUnauthorizedError('Токен не найден')
    }
    const result = await this.service.authenticate(token);

    console.log('auth manager res: ', result);
    

    return result;
  }
}
