import { Db, MongoClient, ServerApiVersion } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

if (!MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable inside .env.local')
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
    if (cachedClient && cachedDb) {
        try {
            await cachedClient.db().admin().ping();
            return { client: cachedClient, db: cachedDb };
        } catch (error) {
            console.error('Cached connection is dead, creating new one', error);
            cachedClient = null;
            cachedDb = null;
        }
    }

    const client = new MongoClient(MONGODB_URI ?? "", {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        minPoolSize: 1,
        maxIdleTimeMS: 30000,
    });
    try {
        await client.connect();
        const db = client.db(MONGODB_DB);
        await db.admin().ping();
        console.log('MongoDB connection established successfully');
        
        cachedClient = client;
        cachedDb = db;
        return { db: cachedDb, client: cachedClient };
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        await client.close();
        throw error;
    }
}