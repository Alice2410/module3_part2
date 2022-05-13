import { UserData } from "api/auth/auth.interface";
// import { User } from "@models/MongoDB/user";
import { validUsers } from "@helper/valid-users";
import { hashPassword } from "@services/password-operations.service"; 
import { comparePasswords } from "@services/password-operations.service";
import { 
  HttpInternalServerError,
} from '@floteam/errors';
import { DynamoDBService } from "@services/dynamoDB/dynamo.service";
import { getEnv } from "@helper/environment";

export class UserService {
  private readonly dynamoDBService = new DynamoDBService();
  private readonly tableName = getEnv('TABLE_NAME');
  private readonly profilePrefix = getEnv('PROFILE_TAG');
  
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
      let  userIsExist = await this.getUser(email);
  
      if(!userIsExist) {
        const hashedData = await hashPassword(password);
        const attributes = {
          password: hashedData.password,
          salt: hashedData.salt,
        }
        const newUser = this.dynamoDBService.putItem(email, `${this.profilePrefix}#${email}`, this.tableName, attributes);
        
        return newUser;
      } 
  
      return false;
    } catch(e) {
     
      throw new HttpInternalServerError(e.message)
    }
  }
  
  async checkUser(userCred: UserData) { // для лог-ина
    const email = userCred.email;
    const password = userCred.password;
  
    try {
      const user = await this.getUser(email);
  
      if(user) {
          const userData = user.Item;
          const validPassword = userData!.password;
          const userSalt = userData!.salt;
          const isValid = await comparePasswords(password, validPassword, userSalt);
  
          return isValid;
      } 
  
      return false;
  } catch(err) {
      throw new HttpInternalServerError('Ошибка проверки существования пользователя')
  }
  }
  
  async getUser(email: string) { // this func is instead of User.exist
    try {
      const user = await this.dynamoDBService.getItem(email, `${this.profilePrefix}#${email}`, this.tableName);

      if(!user.Item) {
        return false;
      }

      return user;
    } catch(err) {
      throw new HttpInternalServerError(err.message);
    }
  }
}

