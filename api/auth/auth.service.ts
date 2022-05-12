import { UserData } from "./auth.interface";
import { connectToDB } from "@services/connect-to-DB.service";
import { UserService } from "@models/MongoDB/user-operations";
import jwt from "jsonwebtoken";
import { 
  HttpUnauthorizedError,
  HttpInternalServerError,
  AlreadyExistsError
} from '@floteam/errors';

const tokenKey = process.env.TOKEN_KEY as string;


export class AuthorizationService {
  User = new UserService();

  async signUp(userData: UserData) {
    try {
      await connectToDB();
      const newUser = await this.User.addNewUser(userData);
      if (!newUser) {
        throw new AlreadyExistsError('Пользователь существует')
      }
      
      return true;
    } catch(e) {
      throw new HttpInternalServerError('Новый пользователь не добавлен')
    }
  }

  async logIn(userData: UserData) {
    try {
      await connectToDB();
      const isValid = await this.User.checkUser(userData);

      if (isValid) {
        
        let token = jwt.sign({sub: userData.email}, tokenKey);

        return token;
      } else {
        throw new HttpUnauthorizedError('Пользователь неавторизован')
      }
    } catch(e) {
      throw new HttpUnauthorizedError('Ошибка логина')
    }
  }

  async uploadDefaultUsers () {
    try {
      await connectToDB();
      let user = await this.User.addNewUser();
      
      return 'Пользователи добавлены';
    } catch (err) {
      throw new HttpInternalServerError('Пользователи не были добавлены');
    }
  }

  async authenticate(token: string) {
    try {
      await connectToDB();
      
      return jwt.verify(token, tokenKey);
    } catch (err) {
      throw new HttpUnauthorizedError('Невалидный токен')
    }
  }
}


  