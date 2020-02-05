const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});
//schema.methods will let you to create your own function in schama, like here hashPassword fn.
//here using normal function is to use this to point the password of newly added user where the hashPassword() will be called.

schema.methods.hashPassword = async function() {
	this.password = await bcrypt.hash(this.password, 10);
};

schema.methods.validatePassword = async function(password) {
	// compare(password, this.password): the first password is the password just passed in (user inputed password); this.password is the password stored in db
	const validatePassword = await bcrypt.compare(password, this.password);
	return validatePassword;
};

const model = mongoose.model("User", schema);

module.exports = model;
