const express = require("express");
const customerRoute = require("./routes/customer");
const cleanerRoute = require("./routes/cleaner");
const bookingRoute = require("./routes/booking");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const authGuard = require("./middleware/authGuard");

const router = express.Router();

/*
if only admin user can access this route, you can add adminGuard middleware before the Route
if you want to control only admin can access as well as write the data any route, you can go to the js files in routes to add adminGuard middleware before the small route
// router.use("/students", authGuard, adminGuard, studentRoute);
*/

router.use("/customers", authGuard, customerRoute);
router.use("/cleaners", authGuard, cleanerRoute);
router.use("/bookings", authGuard, bookingRoute);
router.use("/users", userRoute);
router.use("/auth", authRoute);

module.exports = router;
