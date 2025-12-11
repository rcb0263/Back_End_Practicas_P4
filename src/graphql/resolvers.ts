import { ObjectId } from "mongodb"; import { IResolvers } from "@graphql-tools/utils"
import { signToken } from "../auth";
import { getDB } from "../db/mongo";
import { createUser, validateUser } from "../collections/users";
import { User } from "../types.ts/Users";
import { addMember, createProject, updateProject } from "../collections/projects";
import { createTask, updateTaskStatus } from "../collections/tasks";

const projectCollection = "projects";
const taskCollection = "tasks";
const userCollection = "users";

export const resolvers: IResolvers = {
    Query: {
        users: async () => {
            const db = getDB();
            const users = await db.collection(userCollection).find().toArray();
            return users.map(user => ({
                _id: user._id.toString(),
                username: user.username,
                email: user.email,
                password: user.password,
                createdAt: user.createdAt
            }));
        },
        projectDetails: async (_, {id}: {id:string}) => {
            const db = getDB();
            const project = await db.collection(projectCollection).findOne({_id: new ObjectId(id)})
            return project;
        },
        myProjects: async (_, __, context) => {
            const db = getDB();
            const project = await db.collection(projectCollection).find({owner: context.user._id.toString()}).toArray()
            return project;
        }
    },
    Mutation: {
        register: async (_, { input }: { input: { email: string, password: string, username: string } }) => {
            const { email, password, username } = input
            const userId = await createUser(email, password, username)
            return signToken(userId)
        },
        login: async (_, { input }: { input: { email: string, password: string } }) => {
            const { email, password } = input
            const user = await validateUser(email, password)
            if (!user) throw new Error("Invalid credentials")
            return signToken(user._id.toString())
        },
        createProject: async (_, { input }: { input: { name: string, description: string, startDate: string, endDate: string, owner: string } }) => {
            const { name, description, startDate, endDate, owner } = input
            const projectId = await createProject(name, description, startDate, endDate, owner);
            const db = getDB();
            const project = await db.collection(projectCollection).findOne({_id: new ObjectId(projectId)});
            return project;
        },
        updateProject: async (_, {id, input }: { id:string, input: { name: string, description: string, endDate: string } }) => {
            const { name, description, endDate } = input
            const result = await updateProject(id, name, description, endDate );
            if(result.modifiedCount==0) throw Error("no se ha podido cambiar")
            const db = getDB();
            const project = await db.collection(projectCollection).findOne({_id: new ObjectId(id)});
            return project;
        },
        addMember: async (_, { projectId, userId }: { projectId:string, userId: string }) => {
            const result = await addMember( projectId, userId );
            if(result.modifiedCount==0) throw Error("no se ha podido añadir el miembro")
            const db = getDB();
            const project = await db.collection(projectCollection).findOne({_id: new ObjectId(projectId)});
            return project;
        },
        deleteProject: async (_, {id }: { id:string }) => {
            const db = getDB();
            const project = await db.collection(projectCollection).deleteOne({_id: new ObjectId(id)});
            return "deletedCount: "+project.deletedCount.toString();
        },
        createTask: async (_, { projectId, input }: {projectId:string, input: { title: string, assignedTo: string, status: string, priority: string, dueDate:string } }) => {
            const { title, assignedTo, status, priority, dueDate} = input
            const taskId =  await createTask(projectId, title, assignedTo, status, priority, dueDate)
            const db = getDB();
            const task = await db.collection(taskCollection).findOne({_id: new ObjectId(taskId)});
            return task;
        },
        updateTaskStatus: async (_, {taskId, status}:{taskId: string, status:string})=>{
            const updated =  await updateTaskStatus(taskId, status)
            if(updated==0)throw Error("No se pudo hacer ningun cambio")
            const db = getDB();
            const task = await db.collection(taskCollection).findOne({_id: new ObjectId(taskId)});
            return task;
        }
    }
}