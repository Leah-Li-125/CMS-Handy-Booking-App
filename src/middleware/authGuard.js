const { validateToken } = require("../utils/jwt");

module.exports = (req, res, next) => {
	const authHeader = req.header("Authorization");
	if (!authHeader) return res.status(401).json("Access denied");

	const contentArr = authHeader.split(" ");
	if (contentArr.length !== 2 || contentArr[0] !== "Bearer") {
		return res.status(401).json("Access denied");
	}

	//here contentArr[1] is to get the playload and assign to decoded, if decoded is not null, next() pass the verification and put the content of decoded into req.user, otherwise, denied.
	const decoded = validateToken(contentArr[1]);
	if (decoded) {
		req.user = decoded;
		return next();
	}
	return res.status(401).json("Access denied");
};
