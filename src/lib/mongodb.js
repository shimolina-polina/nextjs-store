import { MongoClient, ServerApiVersion } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

if (!MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable inside .env.local')
}

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


export async function connectToDatabase() {
    await client.connect();
    const database = client.db(MONGODB_DB);
    return { db: database, client };
}