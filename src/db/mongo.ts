import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv"

dotenv.config()

let client: MongoClient;
let db: Db;
const dbName = 'Practica4'

export const connectToMongoDB = async () => {
    try {
        const mongoUrl = `mongodb+srv://${process.env.USER_MONGO}:${process.env.USER_PASSWORD}@${process.env.MONGO_CLUSTER}.a4nz0xh.mongodb.net/?appName=${process.env.MONGO_APP_NAME}`
        
        client = new MongoClient(mongoUrl)
        await client.connect();
        db = client.db(dbName);
        console.log("Estas conectado al mondongo")

    } catch (error) {
        console.log('Error del mondongo baby', error)
    }
}

export const getDB = ():Db => db;

export const clientMognoDb = async () => {
    try {
        client && await client.close()
    } catch (error) {
        console.log("Error al cerrar mongo")
    }
}