//to connect the server to database
const mongoose = require("mongoose");

exports.connectToDB = () => {
	const { DB_DATABASE, DB_HOST, DB_PORT } = process.env;
	const connectionString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
	console.log(`Connecting to ${connectionString}`);
	mongoose.set("useFindAndModify", false);
	return mongoose.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
};
