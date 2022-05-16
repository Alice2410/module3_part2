import { HashedPassword } from "../api/auth/auth.interface";
import crypto from 'crypto';
import { promisify } from "util";
import { 
  HttpInternalServerError
} from '@floteam/errors';

const scryptAsync = promisify< crypto.BinaryLike,  crypto.BinaryLike, number, Buffer>(crypto.scrypt);

export async function hashPassword (password: string) {
  try {
    console.log('hashing password: ', password);
    
    const salt = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await scryptAsync(password, salt, 64);

    const hash: HashedPassword = {
      password: hashedPassword.toString('hex'),
      salt: salt,
    };
    
    

  return hash;
  } catch(e) {
    throw new HttpInternalServerError('Ошибка хэширования')
  }
}

export async function comparePasswords (password: string, correctData: string, salt: string) {
  try{
    console.log('in compare password data: ', 'pass: ', password, 'corrD: ' ,correctData, 'salt: ' , salt);
    
    
    const hashedUserPassword = await scryptAsync(password, salt, 64);
    console.log('hashedPass: ', hashedUserPassword.toString('hex'), 'correct: ', correctData);
    
    const isValid = (hashedUserPassword.toString('hex')) === correctData;

    return isValid;
  } catch(e) {
    throw new HttpInternalServerError(e.message)
  }
}
  


