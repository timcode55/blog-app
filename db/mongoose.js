const mongoose = require('mongoose');

const connectDB = async () => {
	const db = await mongoose.connect(process.env.MONGODB_API_KEY, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	console.log('DB connection was successful!');
};

module.exports = connectDB;
