import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';

import dbClient from '../utils/db';
import redisClient from '../utils/redis';
// auth controller calss here
class AuthController {
  static async getConnect(request, response) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      response.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const pass = sha1(auth[1]);
      const email = auth[0];
      // pass constant

      // user constant
      const user = await dbClient.getUser({ email });

      if (!user) {
        response.status(401).json({ error: 'Unauthorized' });
      }

      if (pass !== user.password) {
        response.status(401).json({ error: 'Unauthorized' });
      }

      // token constant
      const token = uuidv4();
      // key constant
      const key = `auth_${token}`;
      // duration constant
      const duration = ((30 + 30) * 60 * 24);
      await redisClient.set(key, user._id.toString(), duration);

      response.status(200).json({ token });
    } catch (err) {
      // logging error if any
      console.log(err);
      response.status(500).json({ error: 'Server error' });
    }
  }

  static async getDisconnect(request, response) {
    try {
      // usertoken an userkey
      const userToken = request.header('X-Token');
      const userKey = await redisClient.get(`auth_${userToken}`);

      if (!userKey) {
        response.status(401).json({ error: 'Unauthorized' });
      }

      await redisClient.del(`auth_${userToken}`);
      response.status(204).send('Disconnected');
      // error catcher
    } catch (err) {
      console.log(err);
      response.status(500).json({ error: 'Server error' });
    }
  }
}
export default AuthController;
