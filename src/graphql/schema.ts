import {gql} from "apollo-server"

export const typeDefs =gql`

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        createdAt: String!
    }
    type Project {
        _id: ID!
        name: String!
        description: String!
        startDate: String!
        endDate: String!
        owner: ID!
        members: [ID]!
    }
    type Task {
        _id: ID,
        title: String!
        projectId: ID!
        assignedTo: ID,
        status: TaskStatus!
        priority: PriorityList!
        dueDate: String!
    }
    enum TaskStatus {
        PENDING
        IN_PROGRESS
        COMPLETED
    }
    enum PriorityList{
        LOW
        MEDIUM
        HIGH
    }
    input RegisterInput {
        email: String!
        password: String!
        username: String!
    }
    input LoginInput {
        email: String!
        password: String!
    }
    input CreateProjectInput {
        name: String!
        description: String
        startDate: String!
        endDate: String!
        owner: ID!
    }
    input UpdateProjectInput {
        name: String
        description: String
        endDate: String
    }

    input CreateTaskInput {
        title: String!
        assignedTo: ID,
        status: TaskStatus!
        priority: PriorityList!
        dueDate: String!
    }

    type Query {
        myProjects: [Project]! 
        projectDetails(id: ID!): Project 
        users: [User]! 
    }

    type Mutation {
        register(input: RegisterInput): String! 
        login(input: LoginInput): String! 
        createProject(input: CreateProjectInput!): Project!
        updateProject(id: ID!, input: UpdateProjectInput!): Project!
        addMember(projectId: ID!, userId: ID!): Project!
        deleteProject(id: ID!): String!

        createTask(projectId: ID!, input: CreateTaskInput!): Task!
        updateTaskStatus(taskId: ID!, status: TaskStatus!): Task!

    }
`