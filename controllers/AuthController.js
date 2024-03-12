import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  static async getConnect(request, response) {
    const Headerauth = request.headers.authorization;

    // checks if header auth exists or starts with basic
    if (!Headerauth || !Headerauth.startsWith('Basic ')) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    // encoded and decoded credentials
    const CredentEncode = Headerauth.split(' ')[1];
    const CredentDecode = Buffer.from(CredentEncode, 'base64').toString();
    const [email, password] = CredentDecode.split(':');

    if (!email || !password) {
      return response.status(401).send({ error: 'Unauthorized' });
    }

    const collection = dbClient.client.db().collection('users');
    const user = await collection.findOne({ email, password: sha1(password) });
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    const expiresIn = 86400;
    // expires in twenty four hours

    redisClient.set(key, user._id.toString(), expiresIn);

    return response.status(200).json({ token });
  }

  static async getDisconnect(request, response) {
    const token = request.headers['x-token'];
    if (!token) {
      // return the status
      return response.status(401).json({ error: 'Unauthorized' });
    }
    // getting key and userID
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      // return the status
      return response.status(401).json({ error: 'Unauthorized' });
    }
    redisClient.del(key);
    // return the status
    return response.status(204).send();
  }
}

export default AuthController;
