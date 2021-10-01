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

// blogsRouter.get('/:id', (request, response, next) => {
// 	Person.findById(request.params.id)
// 		.then((person) => {
// 			if (person) {
// 				response.json(person.toJSON());
// 			} else {
// 				response.status(404).end();
// 			}
// 		})
// 		.catch((error) => next(error));
// });

blogsRouter.post('/', async (request, response, next) => {
	const blog = new Blog(request.body);

	try {
		await blog.save().then((result) => {
			response.status(201).json(result);
		});
	} catch (exception) {
		next(exception);
	}
});

blogsRouter.get('/:id', async (request, response, next) => {
	await Blog.findById(request.params.id)
		.then((result) => {
			response.status(200).send(result);
		})
		.catch((error) => next(error));
});

blogsRouter.delete('/:id', async (request, response, next) => {
	await Blog.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

blogsRouter.put('/:id', (request, response, next) => {
	const body = request.body;

	const blog = {
		content: body.content,
		important: body.important
	};

	Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
		.then((updatedBlog) => {
			response.json(updatedBlog.toJSON());
		})
		.catch((error) => next(error));
});

module.exports = blogsRouter;
