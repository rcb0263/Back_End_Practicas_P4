import { ObjectId } from "mongodb"
import { getDB } from "../db/mongo"
import bcrypt from "bcryptjs"


const COLLECTION = "tasks"
const USERSCOLLECTION = "users"
const PROJECTSCOLLECTION = "projects"

export const createTask = async (projectId:string, title: string, assignedTo: string, status: string, priority: string, dueDate:string)=>{
    const db = getDB()
    const project = await db.collection(PROJECTSCOLLECTION).findOne({_id: new ObjectId(projectId)})
    if(!project) throw Error("No existe el proyecto")
    const duesDate = Date.parse(dueDate);
    const startDate = Date.parse(project.startDate);
    const endDate = Date.parse(project.endDate);
    if(!duesDate||duesDate<startDate||endDate<duesDate) throw Error("dates wrong, must be mm-dd-yyyy")
        
    const result = await db.collection(COLLECTION).insertOne({
        title: title,
        projectId,
        assignedTo,
        status,
        priority,
        dueDate
    })
    return result.insertedId.toString()
}

export const updateTaskStatus= async (taskId:string, status: string) =>{
    const db = getDB()
    const task = await db.collection(COLLECTION).findOne({_id: new ObjectId(taskId)});
    if(!task) throw Error("No existe ese proyecto");
    const result = await db.collection(COLLECTION).updateOne(
        {_id: new ObjectId(taskId)},
        {$set: {status}}
    )
    return result.modifiedCount
}