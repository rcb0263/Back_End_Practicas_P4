import { ObjectId } from "mongodb"
import { getDB } from "../db/mongo"
import bcrypt from "bcryptjs"


const COLLECTION = "projects"
const USERSCOLLECTION = "users"

export const createProject = async (name:string, description: string, startDate: string, endDate: string, owner: string)=>{
    const db = getDB()
    const datestart = Date.parse(startDate);
    const dateend = Date.parse(endDate);
    if(!datestart || !dateend || dateend<=datestart) throw Error("dates wrong, must be mm-dd-yyyy")

    const result = await db.collection(COLLECTION).insertOne({
        name,
        description: description||"",
        startDate,
        endDate,
        members: [],
        owner
    })
    return result.insertedId.toString()
}
export const updateProject= async (id:string, name: string, description: string, endDate: string) =>{
    const db = getDB()
    const dateend = Date.parse(endDate);
    const existing = await db.collection(COLLECTION).findOne({_id: new ObjectId(id)});
    if(!existing) throw Error("No existe ese proyecto");
    if(!name) name= existing.name;
    if(!description) description= existing.description;
    if(!endDate) endDate= existing.endDate;
    if(!existing.startDate || !dateend || dateend<=existing.startDate) throw Error("dates wrong, must be mm-dd-yyyy")

    const result = await db.collection(COLLECTION).updateOne(
        {_id: new ObjectId(id)},
        {$set: {name, description, endDate}}
    )
    return result
}
export const addMember = async (id:string, memberId: string) =>{
    const db = getDB()

    const projectExists = await db.collection(COLLECTION).findOne({_id: new ObjectId(id)});
    if(!projectExists) throw Error("No existe ese proyecto");

    const userExists = await db.collection(USERSCOLLECTION).findOne({_id: new ObjectId(memberId)});
    if(!userExists) throw Error("No existe ese usuario");

    if(projectExists.members.includes(memberId)) throw Error("El miembro ya existe")

    const members = [...projectExists.members, memberId]

    const result = await db.collection(COLLECTION).updateOne(
        {_id: new ObjectId(id)},
        {$set: {members}}
    )
    return result
}