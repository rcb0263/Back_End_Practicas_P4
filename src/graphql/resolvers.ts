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
        }
    }
}