const { MongoClient, ServerApiVersion } = require("mongodb"); // destructure mongo nodejs driver
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGO_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}); // new connection with custom options

const db = client.db('notes_db');
const table = db.collection('notes');
module.exports = table; // to use in service files
