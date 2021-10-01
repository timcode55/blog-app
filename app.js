const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const http = require('http');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db/mongoose');
const PORT = 3003;

logger.info('connecting to', config.MONGODB_URI);

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

connectDB();

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;
