import request from 'supertest'
import { app } from '../../app'

/* Create Profile */

it("returns a 200 on create Profile", async () => {
    jest.setTimeout(300000)

    const { body: user } = await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

    return request(app)
        .post(`/api/profile/createProfile/${user._id}`)
        .send({
            user: user._id,
            image: "image",
            motherCountry: "motherCountry",
            motherLanguage: "motherLanguage",
            learningLanguage: "learningLanguage",
            intro: "intro",
            social: {
                facebook: "facebook",
                instagram: "instagram"
            },
            university: user.university
        })
        .expect(200)
})

/* Update Profile */

it("returns a 200 on update Profile", async () => {
    jest.setTimeout(300000)

    const { body: user } = await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

        const { body: profile } = await request(app)
        .post(`/api/profile/createProfile/${user._id}`)
        .send({
            user: user._id,
            image: "image",
            motherCountry: "motherCountry",
            motherLanguage: "motherLanguage",
            learningLanguage: "learningLanguage",
            intro: "intro",
            social: {
                facebook: "facebook",
                instagram: "instagram"
            },
            university: user.university
        })
        .expect(200)


    return request(app)
        .patch(`/api/profile/updateProfile/${profile._id}`)
        .send({
            image: "image",
            motherCountry: "motherCountry",
            motherLanguage: "motherLanguage",
            learningLanguage: "learningLanguage",
            intro: "intro",
            social: {
                facebook: "facebook",
                instagram: "instagram"
            }
        })
        .expect(200)
})
/* delete Profile */

it("returns a 200 on delete Profile", async () => {
    jest.setTimeout(300000)

    const { body: user } = await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

        const { body: profile } = await request(app)
        .post(`/api/profile/createProfile/${user._id}`)
        .send({
            user: user._id,
            image: "image",
            motherCountry: "motherCountry",
            motherLanguage: "motherLanguage",
            learningLanguage: "learningLanguage",
            intro: "intro",
            social: {
                facebook: "facebook",
                instagram: "instagram"
            },
            university: user.university
        })
        .expect(200)

        return request(app)
        .delete(`/api/profile/deleteProfile/${profile._id}`)
        .send()
        .expect(200)
})

/* get Profile */

it("returns a 200 on get Profile", async () => {
    jest.setTimeout(300000)

    const { body: user } = await request(app)
        .post('/api/users/signup')
        .send({
            name: "dasd",
            email: 'test@test.com',
            password: 'password',
            confirmPassword: "password",
            university: "kookmin"
        })
        .expect(200)

        const { body: profile } = await request(app)
        .post(`/api/profile/createProfile/${user._id}`)
        .send({
            user: user._id,
            image: "image",
            motherCountry: "motherCountry",
            motherLanguage: "motherLanguage",
            learningLanguage: "learningLanguage",
            intro: "intro",
            social: {
                facebook: "facebook",
                instagram: "instagram"
            },
            university: user.university
        })
        .expect(200)

        return request(app)
        .get(`/api/profile/getProfile/${profile._id}`)
        .send()
        .expect(200)
})