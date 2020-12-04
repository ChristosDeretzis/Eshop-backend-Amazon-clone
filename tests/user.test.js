const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setUpDatabase } = require('./fixtures/db');

beforeEach(setUpDatabase)

test('should sign up a new user', async () => {
    const response = await  request(app).post('/users').send({
        username: 'athenianCoder',
        firstName: 'Christos',
        lastName: 'Mastorakos',
        password: '3465dhft45',
        email: 'intrasoft@gmail.com'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            email: 'intrasoft@gmail.com',
            username: 'athenianCoder'
        },
        token: user.tokens[0].token
    })
});

test('Should not sign up user with invalid email/password', async () => {
    await request(app).post('/users').send({
        email: 'mary',
        password: '1234'
    }).expect(400)
});

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password 
    }).expect(200)

    const user = await User.findById({ _id: response.body.user._id});

    expect(response.body.token).toBe(user.tokens[1].token)
});

test('should not login for non-existent user', async () => {
    await request(app).post('/users/login').send({
        email: 'vrasidas@hotmail.com',
        password: 'erdftt56'
    }).expect(400)
});

test('should get profile for user', async () => {
    await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
});

test('should not get profile for unauthenticated user', async () => {
    await request(app)
            .get('/users/me')
            .send()
            .expect(401)
})

test('should delete account for user', async () => {
    const response = await request(app)
                                .delete('/users/me')
                                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                                .send()
                                .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
});

test('should not delete account for unauthenticated user', async () => {
    await request(app)
            .delete('/users/me')
            .send()
            .expect(401)
})

test('should update valid user fields', async () => {
    await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                username: 'kavlas'
            })
            .expect(200)

    const user = await User.findById(userOneId)
    expect(user.username).toBe('kavlas')
})

test('should not update invalid user fields', async () => {
    await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                location: 'Thessaloniki'
            })
            .expect(400)
})

test('should not update valid user fields for authenticated user', async () => {
    await request(app)
            .patch('/users/me')
            .send({
                'username': 'someone',
                'email': 'deretzis@gmail.com'
            })
            .expect(401)
})