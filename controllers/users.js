const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 });
	response.json(users.map((u) => u.toJSON()));
});

usersRouter.post('/', async (request, response, next) => {
	const body = request.body;

	const saltRounds = 10;
	if (!body.password || !body.username) {
		response.status(400).json({
			error: 'UN or PW is missing'
		});
	} else if (body.password.length < 3) {
		return response.status(400).json({
			error: 'Password is too short'
		});
	} else {
		const passwordHash = await bcrypt.hash(body.password, saltRounds);

		const user = new User({
			username: body.username,
			name: body.name,
			passwordHash
		});

		const savedUser = await user.save();

		response.json(savedUser);
	}
});

module.exports = usersRouter;
