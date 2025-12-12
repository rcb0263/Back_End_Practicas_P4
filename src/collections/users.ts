import { ObjectId } from "mongodb"
import { getDB } from "../db/mongo"
import bcrypt from "bcryptjs"


const COLLECTION = "users"

export const createUser = async (email:string, password: string, username: string)=>{
    const db = getDB()
    const toEncriptao = await bcrypt.hash(password, 10)
    const resultemail = await db.collection(COLLECTION).findOne({email})
    if(resultemail) throw Error("El email debe ser unico")
    const resultusername = await db.collection(COLLECTION).findOne({username})
    if(resultusername) throw Error("El username debe ser unico")
    const result = await db.collection(COLLECTION).insertOne({
        email,
        createdAt: new Date(),
        username: username,
        password: toEncriptao,
    })
    return result.insertedId.toString()
}

export const validateUser = async (email:string, password: string) =>{
    const db = getDB()
    const user = await db.collection(COLLECTION).findOne({email})
    if(!user) return null
    const laPassEsLaMisma = await bcrypt.compare(password, user.password);
    if(!laPassEsLaMisma) return null
    return user
}

export const findUserById = async (id: string) =>{
    const db = getDB()
    return await db.collection(COLLECTION).findOne({_id: new ObjectId(id)})
}