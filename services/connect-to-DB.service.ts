import { getEnv } from '@helper/environment';
import { log } from '@helper/logger';
import mongoose from 'mongoose';
import { 
  HttpInternalServerError,
 } from '@floteam/errors';
import { UserService } from '@models/MongoDB/user-operations';

const dbURL = getEnv('DB_CONN', true);
const User = new UserService();

export async function addDefaultUserData() {
  try {
    const isConnected = mongoose.connection;

    isConnected.on('error', (error) => {
      log(error);
      throw new HttpInternalServerError(error.message)
    });

    isConnected.on('open', async () => {
      log('Connection to DB is successfully established.');

      await User.addNewUser();
    });

  } catch(e) {
    throw new HttpInternalServerError('Ошибка подключения к базе данных')
  }
}

export async function connectToDB() {
  try {
    console.log('CONNECTED');
    const connection = await mongoose.connect(dbURL);
    
  } catch(e) {
    throw new HttpInternalServerError('Ошибка подключения к базе данных')
  }
}
