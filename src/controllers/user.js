const User = require("../models/user");
const { generateToken } = require("../utils/jwt");

async function addUser(req, res) {
	const { username, password } = req.body;

	const existingUser = await User.findOne({ username }).exec();
	if (existingUser) {
		return res.status(400).json("User already exist");
	}

	const user = new User({ username, password });
	//call hashPassword (noted to use await because the method in schema is an async fn, otherwise, the password stored will not be hashed one but a public password)
	await user.hashPassword();
	await user.save();
	const token = generateToken(user._id);
	return res.json({ username, token });
}

module.exports = { addUser };
