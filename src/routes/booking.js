const express = require("express");

const {
	getBooking,
	getAllBookings,
	// addBooking,
	updateBooking,
	deleteBooking
} = require("../controllers/booking");

const router = express.Router();

router.get("/", getAllBookings);
router.get("/:id", getBooking);
// router.post("/customers/:id", addBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;
