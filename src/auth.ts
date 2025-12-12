import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb";
import { getDB } from "./db/mongo";
dotenv.config()

const SUPER_SECRETO = process.env.SECRET;

type TokenPayLoad = {
    userId: string
}

export const signToken = (userId: string) => jwt.sign({userId}, SUPER_SECRETO!, {expiresIn: "1h"})

export const verifyToken = (token: string):TokenPayLoad | null=> {
    try {
        return jwt.verify(token, SUPER_SECRETO!) as TokenPayLoad
    } catch (error) {
        return null;
    }
}

export const getUserFromToken = async (token:string)=>{
    const payload = verifyToken(token)
    if(!payload) return null
    const db = getDB()
    return await db.collection("users").findOne({
        _id: new ObjectId(payload.userId)
    })
}