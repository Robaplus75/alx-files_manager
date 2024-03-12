import dbClient from '../utils/db';
// import redis client
import redisClient from '../utils/redis';

class AppController {
  static async getStatus(req, res) {
    // check if db status and redis status is alive
    const dbStatus = dbClient.isAlive();
    const redisStatus = redisClient.isAlive();

    // return the result
    return res.status(200).json({ redis: redisStatus, db: dbStatus });
  }

  static async getStats(req, res) {
    // get userscount and files count
    const countuser = await dbClient.nbUsers();
    const filecount = await dbClient.nbFiles();
    // return the result
    return res.status(200).json({ users: countuser, files: filesCount });
  }
}

export default AppController;
