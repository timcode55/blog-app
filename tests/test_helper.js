const Blog = require('../models/blog');
const User = require('../models/user');

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

const nonExistingId = async () => {
	const blog = new Blog({
		title: 'willremovethissoon',
		author: 'Marquis',
		url: 'http://www.added.com',
		likes: 454
	});
	await blog.save();
	await blog.remove();

	return blog._id.toString();
};

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((u) => u.toJSON());
};

module.exports = {
	initialBlogs,
	nonExistingId,
	blogsInDb,
	usersInDb
};
