const express = require("express");

const {
	getCleaner,
	getAllCleaners,
	addCleaner,
	updateCleaner,
	deleteCleaner,
	addBooking,
	deleteBooking
} = require("../controllers/cleaner");

const router = express.Router();

router.get("/", getAllCleaners);
router.get("/:id", getCleaner);
router.post("/", addCleaner);
router.put("/:id", updateCleaner);
router.delete("/:id", deleteCleaner);
router.post("/:id/bookings", addBooking);
router.delete("/:id/bookings/:ref_No", deleteBooking);

module.exports = router;
