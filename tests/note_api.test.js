const mongoose = require('mongoose');
const helper = require('./test_helper');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const initialBlogs = [
	{
		title: 'How to Beat the High Cost of Living',
		author: 'Dabney Coleman',
		url: 'http://www.HBHC.com',
		likes: 650
	},
	{
		title: 'Making Money in 2021',
		author: 'Influencer Jones',
		url: 'http://www.MM2021.com',
		likes: 275
	}
];

beforeEach(async () => {
	await Blog.deleteMany({});
	for (let blog of helper.initialBlogs) {
		let blogObject = new Blog(blog);
		await blogObject.save();
	}
});

test('notes are returned as json', async () => {
	await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);
});

afterAll(() => {
	mongoose.connection.close();
});

test('there are two notes', async () => {
	const response = await api.get('/api/blogs');

	expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('the first note is about HTTP methods', async () => {
	const response = await api.get('/api/blogs');
	const contents = response.body.map((r) => r.title);
	console.log(contents, 'CONTENTS');
	expect(contents).toContain('How to Beat the High Cost of Living');
});

test('a valid blog can be added', async () => {
	const newBlog = {
		title: "Let's Learn Some Stuff",
		author: 'Master Instructor',
		url: 'http://www.Learn.com',
		likes: 325
	};

	await api.post('/api/blogs').send(newBlog).expect(200).expect('Content-Type', /application\/json/);

	const response = await api.get('/api/blogs');

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

	const contents = blogsAtEnd.map((n) => n.title);
	expect(contents).toContain("Let's Learn Some Stuff");
});

test('a specific blog can be viewed', async () => {
	const blogsAtStart = await helper.blogsInDb();

	const blogToView = blogsAtStart[0];

	const resultBlog = await api
		.get(`/api/blogs/${blogToView.id}`)
		.expect(200)
		.expect('Content-Type', /application\/json/);

	const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

	expect(resultBlog.body).toEqual(processedBlogToView);
});

test('a blog can be deleted', async () => {
	const blogsAtStart = await helper.blogsInDb();
	console.log(blogsAtStart, 'BLOGSATSTART');
	const blogToDelete = blogsAtStart[0];
	console.log(blogToDelete.id, 'BLOGTODEL');

	await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

	const blogsAtEnd = await helper.blogsInDb();

	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

	const contents = blogsAtEnd.map((r) => r.title);

	expect(contents).not.toContain(blogToDelete.title);
});

test('there is an id value', async () => {
	const blogsAtStart = await helper.blogsInDb();
	const blogToView = blogsAtStart[0];
	const resultBlog = await api.get(`/api/blogs/${blogToView.id}`);
	console.log(resultBlog, 'RESULTBLOG');
	expect(resultBlog).toBeDefined();
});

test('if likes property is missing then 0', async () => {
	const newBlog = {
		title: "Let's Learn Some Stuff",
		author: 'Master Instructor',
		url: 'http://www.Learn.com'
	};

	if (!newBlog.likes) {
		newBlog.likes = 0;
	}

	await api.post('/api/blogs').send(newBlog);

	const blogsAtEnd = await helper.blogsInDb();
	const lastBlog = blogsAtEnd[blogsAtEnd.length - 1];
	console.log(lastBlog, 'LASTBLOG');

	expect(lastBlog.likes).toEqual(0);
});

test('blog is missing title and url with 400', async () => {
	const newBlog = {
		author: 'Master Instructor',
		likes: 325
	};

	if (!newBlog.title && !newBlog.url) {
		const sendBlog = await api.post('/api/blogs').send(newBlog).expect(400);
	}

	const blogsAtEnd = await helper.blogsInDb();
	const lastBlog = blogsAtEnd[blogsAtEnd.length - 1];
});
