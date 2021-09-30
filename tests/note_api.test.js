const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('notes are returned as json', async () => {
	await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);
});

afterAll(() => {
	mongoose.connection.close();
});

test('there are two notes', async () => {
	const response = await api.get('/api/blogs');

	expect(response.body).toHaveLength(1);
});

test('the first note is about HTTP methods', async () => {
	const response = await api.get('/api/blogs');

	expect(response.body[0].title).toBe('How to Beat the High Cost of Living');
});
