const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
// const express = require('express');
// const app = express();
// app.use(express.json());
// var ObjectId = require('mongodb').ObjectId;

const getTokenFrom = (request) => {
	const authorization = request.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7);
	}
	return null;
};

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, password: 1 });
	response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post('/', async (request, response) => {
	const body = request.body;
	console.log(body, 'BODY25*****');
	const token = getTokenFrom(request);

	const decodedToken = jwt.verify(token, process.env.SECRET);
	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' });
	}

	const user = await User.findById(decodedToken.id);

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		user: user._id
	});

	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();

	response.json(savedBlog.toJSON());
});

blogsRouter.get('/:id', async (request, response, next) => {
	// const body = request.body;
	const token = getTokenFrom(request);
	const blog = await Blog.findById(request.params.id);
	if (blog) {
		response.json(blog);
	} else {
		response.status(404).end();
	}

	const decodedToken = jwt.verify(token, process.env.SECRET);
	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' });
	}

	const user = await User.findById(decodedToken.id);
	// if ( blog.user.toString() === userid.toString() )
});

blogsRouter.delete('/:id', async (request, response) => {
	const token = getTokenFrom(request);
	const blog = await Blog.findById(request.params.id);

	const decodedToken = jwt.verify(token, process.env.SECRET);

	const user = await User.findById(decodedToken.id);

	if (!token || blog.user.toString() !== user.id.toString()) {
		return response.status(401).json({ error: 'token missing or invalid or you are not the correct user' });
	} else {
		await Blog.findByIdAndRemove(request.params.id);
		response.status(204).end();
	}
});

blogsRouter.put('/:id', (request, response, next) => {
	const body = request.body;

	const blog = {
		likes: body.likes
	};

	Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
		.then((updatedBlog) => {
			response.json(updatedBlog.toJSON());
		})
		.catch((error) => next(error));
});

module.exports = blogsRouter;
