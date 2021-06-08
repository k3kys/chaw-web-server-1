import request from 'supertest'
import { app } from '../../app'

/* Follow User */

it("returns a 200 on follow user", async () => {
    jest.setTimeout(300000)

    const user = await global.signup()

    await global.createProfile(user.id, user.university)

    const { body: user2 } = await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test2@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

    await global.createProfile(user2._id, user2.university)

    return request(app)
    .post(`/api/followers/followUser/${user2._id}`)
    .set('Cookie', user.cookie)
    .send()
    .expect(200)
})

/* Unfollow User */

it("returns a 200 on unfollow user", async () => {
    jest.setTimeout(300000)

    const user = await global.signup()

    await global.createProfile(user.id, user.university)

    const { body: user2 } = await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test2@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

    await global.createProfile(user2._id, user2.university)

    await request(app)
    .post(`/api/followers/followUser/${user2._id}`)
    .set('Cookie', user.cookie)
    .send()
    .expect(200)

    return request(app)
    .patch(`/api/followers/unfollowUser/${user2._id}`)
    .set('Cookie', user.cookie)
    .send()
    .expect(200)
})

/* Get Followers */

it("returns a 200 on get user", async () => {
    jest.setTimeout(300000)

    const user = await global.signup()

    await global.createProfile(user.id, user.university)

    const { body: user2 } = await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test2@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

    await global.createProfile(user2._id, user2.university)

    await request(app)
    .post(`/api/followers/followUser/${user2._id}`)
    .set('Cookie', user.cookie)
    .send()
    .expect(200)

    return request(app)
    .get(`/api/followers/getFollower/${user2._id}`)
    .send()
    .expect(200)
})