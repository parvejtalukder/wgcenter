import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!global._mongo) {
    client = new MongoClient(uri);
    global._mongo = client.connect();
}

clientPromise = global._mongo;

export default clientPromise;