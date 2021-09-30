const { parse } = require('dotenv');
var _ = require('lodash');

const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	const likes = blogs.map((item) => {
		return item.likes;
	});
	return likes.reduce((acc, val) => {
		return acc + val;
	});
};

const favoriteBlog = (blogs) => {
	const favorite = blogs.map((item) => {
		return item.likes;
	});
	let max = Math.max(...favorite);
	console.log(max, 'MAX****');
	const findFavorite = blogs.find((item) => {
		return item.likes === max;
	});
	return findFavorite;
};

const mostBlogs = (blogs) => {
	let count = _.countBy(
		blogs.map((item) => {
			return item.author;
		})
	);

	let max = _.max(Object.values(count));
	for (let key in count) {
		if (count[key] === max) {
			return { author: key, blogs: max };
		}
	}
};

const mostLikes = (blogs) => {
	// let count = _.sumBy(
	// 	blogs.map((item) => {
	// 		return item;
	// 	})
	// );
	// console.log(count, 'COUNT*****');
	// let max = _.max(Object.values(count));
	// for (let key in count) {
	// 	if (count[key] === max) {
	// 		return { author: key, blogs: max };
	// 	}
	// }
	// return 5;
	let object = {};
	for (let item of blogs) {
		// console.log(item, 'ITEM');
		// console.log(acc, 'ACC');
		// console.log(val, 'VAL');
		if (!object[item.author]) {
			object[item.author] = item.likes;
		} else {
			object[item.author] += item.likes;
		}
		// return object;
	}
	console.log(object, 'OBJECT*****');

	let max = _.max(Object.values(object));
	for (let key in object) {
		if (object[key] === max) {
			return { author: key, likes: max };
		}
	}
};

// const obj = {};
// if (Object.keys(blogs))

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
};
