const express = require("express");

const {
	addCustomer,
	getCustomer,
	getAllCustomers,
	updateCustomer,
	deleteCustomer,
	addBooking,
	deleteBooking
} = require("../controllers/customer");

const router = express.Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomer);
router.post("/", addCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.post("/:id/bookings", addBooking);
router.delete("/:id/bookings/:ref_No", deleteBooking);
// if you want to control only admin can access as well as write, like delete, the data any route, you can go to the js files in routes to add adminGuard middleware before the small route
// router.delete("/:id/bookings/:code", adminGuard, deleteBooking);

module.exports = router;
