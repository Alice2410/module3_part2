import { UserData } from "../../api/auth/auth.interface";
import { validUsers } from "../../helper/valid-users";
import { hashPassword, comparePasswords } from "../../services/password-operations.service"; 
import { 
  HttpInternalServerError,
  AlreadyExistsError
} from '@floteam/errors';
import { DynamoDBService } from "../../services/dynamoDB/dynamo.service";
import { getEnv } from "../../helper/environment";

export class UserService {
  private readonly dynamoDBService = new DynamoDBService();
  private readonly tableName = getEnv('TABLE_NAME');
  private readonly profilePrefix = getEnv('PROFILE_TAG');
  
  async addNewUser(userData?: UserData) {
    console.log('in addNewUser');
    
    try {
      
      if (userData) {
        console.log(userData);
        
        let email = userData.email;
        let password = userData.password;
        let result = await this.createUserInDB(email, password);

        if (!result) {
          throw new AlreadyExistsError('Пользователь существует')
        }
  
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
      console.log('try to create user', email, password);
      
      let  userIsExist = await this.getUser(email);

      console.log('user is exist', userIsExist);
      
  
      if(!userIsExist) {
        console.log('user not exist');
        
        const hashedData = await hashPassword(password);
        console.log('hashedData: ', hashedData);
        const attributes = {
          password: hashedData.password,
          salt: hashedData.salt,
          resource: 'profile'
        }
        const newUser = await this.dynamoDBService.putItem(email, `${this.profilePrefix}#${email}`, this.tableName, attributes);
        console.log('new user', newUser);
        
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
        console.log('user is in checkUser');
        
          const userData = user.Item;
          const validPassword = userData!.password;
          const userSalt = userData!.salt;
          const isValid = await comparePasswords(password, validPassword, userSalt);
          console.log('compare passwords res: ', isValid);
          
  
          return isValid;
      } 
  
      return false;
  } catch(err) {
      throw new HttpInternalServerError('Ошибка проверки существования пользователя')
  }
  }
  
  async getUser(email: string) { // this func is instead of User.exist
    console.log('in getUser with email: ', email);
    
    try {
      const user = await this.dynamoDBService.getItem(email, `${this.profilePrefix}#${email}`, this.tableName);
      console.log('getItem result: ', user);
      
      if(!user!.Item) {
        return false;
      }

      return user;
    } catch(err) {
      throw new HttpInternalServerError(err.message);
    }
  }
}

