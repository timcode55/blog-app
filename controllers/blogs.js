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

blogsRouter.post('/', (request, response, next) => {
	const blog = new Blog(request.body);

	blog.save().then((result) => {
		response.status(201).json(result);
	});
});

blogsRouter.delete('/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

blogsRouter.put('/:id', (request, response, next) => {
	const body = request.body;

	const person = {
		content: body.content,
		important: body.important
	};

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then((updatedPerson) => {
			response.json(updatedPerson.toJSON());
		})
		.catch((error) => next(error));
});

module.exports = blogsRouter;
