const request = require('supertest');
const app = require('../src/app');
const Product = require('../src/models/product');
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    productOne,
    productTwo,
    productThree,
    setUpDatabase
} = require('./fixtures/db');
 
beforeEach(setUpDatabase);

test('should create a product', async () => {
    const response = await request(app)
                            .post('/products')
                            .set('Authorization',  `Bearer ${userTwo.tokens[0].token}`)
                            .send({
                                name: 'ION',
                                description: 'The best greek chocolate',
                                price: 1.2
                            })
                            .expect(201)

    const product = await Product.findById(response.body._id)
    expect(product.name).toBe('ION');
    expect(product).not.toBeNull();
})

test('get all tasks', async () => {
    const response = await request(app)
                            .get('/products')
                            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                            .send()
                            .expect(200)
    expect(response.body.length).toEqual(3)
})

test('get a certain product', async () => {
    const response = await request(app)
                            .get(`/products/${productOne._id}`)
                            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                            .send()
                            .expect(200)
     expect(response.body.name).toBe('Sergal Milk')
})

test('delete a certain product', async () => {
    const response = await request(app)
                            .delete(`/products/${productOne._id}`)
                            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                            .send()
                            .expect(200)

    const product = await Product.findById(productOne._id);
    expect(product).toBeNull()
})