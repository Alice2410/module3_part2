import { UserData } from "./auth.interface";
import { UserService } from "backend/services/dynamoDB/user-operations";
import jwt from "jsonwebtoken";
import { getEnv } from 'backend/helper/environment';
import { 
  HttpUnauthorizedError,
  HttpInternalServerError,
  AlreadyExistsError
} from '@floteam/errors';

const tokenKey = process.env.TOKEN_KEY as string;
// const tokenKey = getEnv('TOKEN_KEY');



export class AuthorizationService {
  User = new UserService();

  async signUp(userData: UserData) {
    console.log('in service', userData);
    
    try {
      const newUser = await this.User.addNewUser(userData);
      console.log('addNewUser result: ', newUser);
      
      // if (!newUser) {
      //   throw new AlreadyExistsError('Пользователь существует')
      // }
      
      return true;
    } catch(e) {
      throw new HttpInternalServerError('Новый пользователь не добавлен')
    }
  }

  async logIn(userData: UserData) {
    try {
      console.log('in logIn');
      
      const isValid = await this.User.checkUser(userData);

      console.log('isValid result: ', isValid);
      

      if (isValid) {
        console.log('user is valid');
        console.log('email: ', userData.email, 'tokenKey: ', tokenKey);
        
        try {
          let token = jwt.sign({sub: userData.email}, tokenKey);
          console.log(token);

          return token;
        } catch(e) {
          console.log(e.message);
        }
        
      } else {
        throw new HttpUnauthorizedError('Пользователь неавторизован')
      }
    } catch(e) {
      throw new HttpUnauthorizedError('Ошибка логина')
    }
  }

  async uploadDefaultUsers () {
    try {
      let user = await this.User.addNewUser();
      
      return 'Пользователи добавлены';
    } catch (err) {
      throw new HttpInternalServerError('Пользователи не были добавлены');
    }
  }

  async authenticate(token: string) {
    try {
      const result = jwt.verify(token, tokenKey);
      console.log('service result: ', result);
      
      return result;
    } catch (err) {
      throw new HttpUnauthorizedError('Невалидный токен')
    }
  }
}


  