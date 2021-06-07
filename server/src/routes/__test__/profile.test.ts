import request from "supertest"
import { app } from "../../app"

it('create profile successfully', async () => {

    const response = await request(app)
    .post('/api/users/signup')
    .send({
        name: "dasd",
        email: 'test@test.ac.kr',
        password: 'password',
        confirmPassword: "password",
        university: "kookmin"
    })
    .expect(200)

    const id = response.body._id
    const university = response.body.university

    return request(app)
        .post(`/api/profile/createProfile/${id}`)
        .send({
            user: id,
            image: "dasd",
            motherCountry: "korea",
            motherLanguage: "korean",
            learningLanguage: "japanese",
            intro: "hi im ys",
            facebook: "my facebook",
            instagram: "hi",
            university: university
        })
        .expect(200)
})
