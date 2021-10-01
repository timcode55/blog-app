const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

const express = require('express');
const app = express();
app.use(express.json());

blogsRouter.get('/', (request, response) => {
	Blog.find({}).then((blogs) => {
		response.json(blogs);
	});
});

blogsRouter.post('/', async (request, response, next) => {
	const blog = new Blog(request.body);
	const savedBlog = await blog.save();
	response.json(savedBlog);
});

blogsRouter.get('/:id', async (request, response, next) => {
	const blog = await Blog.findById(request.params.id);
	if (blog) {
		response.json(blog);
	} else {
		response.status(404).end();
	}
});

blogsRouter.delete('/:id', async (request, response, next) => {
	await Blog.findByIdAndRemove(request.params.id);
	response.status(204).end();
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
