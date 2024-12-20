const request = require('supertest');
const express = require('express');
const { sequelize, BlogPost } = require('../models');
const blogRoutes = require('../routes/blog');

const app = express();
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use('/', blogRoutes);

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Blog Routes', () => {
    test('GET HOME PAGE / Expect CODE 200', async () => {
        const response = await request(app).get('/')
        expect(response.statusCode).toBe(200);
    })

    test('POST BLOG /create', async ()=>{
        const newPost = {
            title: 'Test Post',
            content: 'This is a test',
            author: 'The Tester'
        }

        const response = await request(app)
            .post('/create')
            .type('form')
            .send(newPost)
            .timeout({ deadline: 2000 }) // Fail if no response within 2 seconds
            .expect(302) // Redirects to the home page
            
        
        const foundPost = await BlogPost.findOne({ where: {title: newPost.title}});
        expect(foundPost).not.toBeNull();
        expect(foundPost.content).toBe(newPost.content)
    })


})