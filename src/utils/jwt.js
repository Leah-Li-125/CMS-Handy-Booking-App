const jwt = require("jsonwebtoken");

//sign a jwt
//can be id or admin or user
function generateToken(id) {
	const token = jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "1d" });
	return token;
}

//verify a jwt
function validateToken(token) {
	let decoded;
	// if verify successfully, the value of decoded will be assigned to the value of payload, if not, go to catch and return null for decode
	try {
		decoded = jwt.verify(token, process.env.JWT_KEY);
	} catch (e) {
		return null;
	}
	return decoded; // then do logic to check the decoded is null or not outside of the file.
}

module.exports = { generateToken, validateToken };
