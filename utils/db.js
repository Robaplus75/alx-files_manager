import { MongoClient } from 'mongodb';

const port = process.env.DB_PORT || 27017;

const host = process.env.DB_HOST || 'localhost';

const url = `mongodb://${host}:${port}/`;

const database = process.env.DB_DATABASE || 'files_manager';

class DBClient {
  constructor() {
    this.db = null;
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
      if (error) { console.log(error); }
      this.db = client.db(database);

      this.db.createCollection('files');

      this.db.createCollection('users');
    });
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async getUser(query) {
    console.log('QUERY IN DB.JS', query);
    const user = await this.db.collection('users').findOne(query);
    console.log('GET USER IN DB.JS', user);
    return user;
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
