import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { loadUsersFromFile } from '../utils/userPersist';

export const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // Si no hay URI de MongoDB definida en las variables de entorno (como en local),
    // creamos una base de datos temporal en memoria.
    if (!uri) {
      console.log('No MONGO_URI provided in environment. Falling back to local MongoMemoryServer...');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
    }
    
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Solo cargamos los usuarios desde el archivo si estamos usando la base en memoria local
    if (!process.env.MONGO_URI) {
      await loadUsersFromFile();
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
