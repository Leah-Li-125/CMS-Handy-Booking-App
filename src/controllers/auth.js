const User = require("../models/user");
const { generateToken } = require("../utils/jwt");

async function loginUser(req, res) {
	const { username, password } = req.body;

	const existingUser = await User.findOne({ username }).exec();
	if (!existingUser) {
		return res.status(401).json("Invalid username or password");
	}

	//hash
	//if validatePassword(password) verified successfully, it will return true
	// (noted to use await because the method in schema is an async fn
	if (!(await existingUser.validatePassword(password))) {
		return res.status(401).json("Invalid username or password");
	}

	//the logic before hashing
	// if (existingUser.password !== password) {
	// 	return res.status(401).json("Invalid username or password");
	// }

	const token = generateToken(existingUser._id);
	return res.json({ username, token });
}

module.exports = {
	loginUser
};
