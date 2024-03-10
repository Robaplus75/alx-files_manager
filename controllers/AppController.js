import dbClient from '../utils/db';

import redisClient from '../utils/redis';

class AppController {
  static getStatus(request, response) {
    try {
      const redis = redisClient.isAlive();
      const db = dbClient.isAlive();

      response.status(200).send({ redis, db });
    } catch (error) {
      console.log(error);
    }
  }

  // app controller js file
  static async getStats(request, response) {
    try {
      const users = await dbClient.nbUsers();
      const files = await dbClient.nbFiles();

      response.status(200).send({ users, files });
    } catch (error) {
      console.log(error);
    }
  }
}
export default AppController;
