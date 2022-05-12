import { UserData } from "api/auth/auth.interface";
import { User } from "@models/MongoDB/user";
import { validUsers } from "@helper/valid-users";
import { hashPassword } from "@services/password-operations.service"; 
import { comparePasswords } from "@services/password-operations.service";
import { 
  HttpInternalServerError,
} from '@floteam/errors';

export class UserService {
  
  async addNewUser(userData?: UserData) {
    
    try {
      
      if (userData) {
        let email = userData.email;
        let password = userData.password;
        let result = await this.createUserInDB(email, password);
  
        return result;
          
      } else {
          for (const email in validUsers) {  
            const user = await this.createUserInDB(email, validUsers[email])
          }
          return;
      }        
    } catch(err) {
      throw new HttpInternalServerError('Ошибка добавления пользователя')
    }
  }
  
  async createUserInDB(email:string, password:string) {
    try{
      let userIsExist = await User.exists({email: email});
  
      if(!userIsExist) {
        
        const hashedData = await hashPassword(password);
        
        const newUser: UserData = await User.create({email: email, password: hashedData.salt + hashedData.password, salt: hashedData.salt});
        
        return newUser;
      } 
  
      return false;
    } catch(e) {
     
      throw new HttpInternalServerError(e.message)
    }
  }
  
  async checkUser(userCred: UserData) {
    const email = userCred.email;
    const password = userCred.password;
  
    try {
      const userIsExist = await User.exists({email: email});
  
      if(userIsExist) {
          const userData = await User.findOne({email: email}) as UserData;
          const validPassword = userData.password;
          const userSalt = userData.salt;
          const isValid = await comparePasswords(password, validPassword, userSalt);
  
          return isValid;
      } 
  
      return false;
  } catch(err) {
      throw new HttpInternalServerError('Ошибка проверки существования пользователя')
  }
  }
  
  async getId(email: string) {
    try {
      const user = await User.findOne({email});
      const id = user._id;
  
      return id;
    } catch(e) {
      throw new HttpInternalServerError('Ошибка получения id пользователя')
    }
  }
}

