import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'

const nodemailer = require("nodemailer") //doesn't work with import. idk why
jest.mock("nodemailer");
const sendMailMock = jest.fn();
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

declare global {
    namespace NodeJS {
        interface Global {
            signin(): Promise<string[]>
        }
    }
}

let mongo: any
beforeAll(async () => {

    process.env.JWT_KEY = 'asdfasdf'
    process.env.JWT_EXPIRES_IN = "2d"
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    mongo = new MongoMemoryServer()
    const mongoUri = await mongo.getUri()

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({})
    }

    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
});

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
});

global.signin = async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200);

    const cookie = response.get('Set-Cookie')

    return cookie
}