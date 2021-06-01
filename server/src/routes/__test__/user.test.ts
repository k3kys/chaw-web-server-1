import request from 'supertest'
import { app } from '../../app'

const nodemailer = require("nodemailer"); //doesn't work with import. idk why
jest.mock("nodemailer");
const sendMailMock = jest.fn();
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

/* Sign Up*/

it('returns a 200 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)
})

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'testtest.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(400)
})

it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'p',
            confirmPassword: "p",
            university: "kookmin"
        })
        .expect(400)
})

it('returns a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(400)

    await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            university: "kookmin"
        })
        .expect(400)
})

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

    await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(400)
})

it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})

/* Sign In*/

it('fails when a email that does not exist is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(400)
})

it('fails when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(400)
})

it('responds with a cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})

/* Sign Out*/

it('clears the cookie after signing out', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

    const response = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200)

    expect(response.get('Set-Cookie')[0]).toEqual(
        'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    )
})

/* Current User*/

it('responds with details about the current user', async () => {
    const cookie = await global.signin()

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200)

    expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200)

    expect(response.body.currentUser).toEqual(null)
})

it('update password after signup', async () => {
    const cookie = await global.signin()

    await request(app)
        .patch('/api/users/updatePassword')
        .set('Cookie', cookie)
        .send({
            passwordCurrent: "password",
            password: "password1",
            confirmPassword: "password1"
        })
        .expect(200)
})

/* Send Email*/


it("send email correctly", async () => {
    await request(app)
        .post('/api/users/send-email')
        .send({ email: "test@test.ac.kr" })
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200);

    expect(sendMailMock).toHaveBeenCalled()
})

/* Forgot Password*/

it("forgot password send email", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.ac.kr',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

    await request(app)
        .post('/api/users/forgotPassword')
        .send({ email: "test@test.ac.kr" })
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200);

    expect(sendMailMock).toHaveBeenCalled()
})

/* Reset Password*/

it("reset password after forgot password", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.ac.kr',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

    const response = await request(app)
        .post('/api/users/forgotPassword')
        .send({ email: "test@test.ac.kr" })
        .set("Accept", "application/json")
        .expect('Content-Type', /json/)
        .expect(200)

    const token = response.body.resetToken

    await request(app)
        .patch(`/api/users/resetPassword/${token}`)
        .send({
            password: "paaaaa",
            confirmPassword: "paaaaa"
        })
        .expect(200)
})