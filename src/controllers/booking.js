const Booking = require("../models/booking");
const Customer = require("../models/customer");
const Cleaner = require("../models/cleaner");

// async function addBooking(req, res) {
// 	const { title, ref_No, description, customer_id } = req.body;
// 	const existingbooking = await Booking.findById(ref_No).exec();
// 	if (existingbooking) {
// 		return res.status(400).json("Duplicate booking code");
// 	}
// 	const booking = new Booking({
// 		title,
// 		ref_No,
// 		description,
// 		customer_id
// 	});
// 	await booking.save();
// 	return res.json(booking);
// }

async function getAllBookings(req, res) {
	const bookings = await Booking.find().exec();
	return res.json(bookings);
}

async function getBooking(req, res) {
	const { id: ref_No } = req.params;
	//{ id:code } to rename the name you defined in js file in routes /:id
	const booking = await Booking.findById(ref_No)
		.populate("customers", "firstName lastName")
		.populate("cleaners", "firstName lastName")
		.exec();
	//if 1 to n (customer to many bookings), you need to mannually check whether a customer has this booking id in his or her bookings, roughly like below
	// customer.find({$in: {bookings: [booking.id]}});
	if (!booking) {
		return res.status(404).send("booking not found");
	}
	return res.json(booking);
}

async function updateBooking(req, res) {
	const { id: ref_No } = req.params;
	const { title, description } = req.body;
	//findByIdAndUpdate(code) is same as updateOne(code)
	//if you need to do some validation, you must use .save() instead of using findByIdAndUpdate() straight away. you can usenfindById() first to get the document and then use booking.name = name etc to update the content and then use booking.save() to store the updated doc to db and do the db validation like limit of length here.
	const booking = await Booking.findByIdAndUpdate(
		ref_No,
		{
			title,
			description
		},
		//return the updated data , if false it will return the non-updated data
		{ new: true }
	).exec();
	if (!booking) {
		return res.status(404).send("booking not found");
	}
	return res.json(booking);
}
async function deleteBooking(req, res) {
	const { id: ref_No } = req.params;
	const booking = await Booking.findByIdAndDelete(ref_No).exec();
	if (!booking) {
		return res.status(404).send("booking not found");
	}

	await Customer.updateMany(
		{ bookings: booking._id },
		{ $pull: { bookings: booking._id } }
	).exec();

	await Cleaner.updateMany(
		{ bookings: booking._id },
		{ $pull: { bookings: booking._id } }
	).exec();
	return res.json(booking);
	// return res.json();
}

module.exports = {
	// addBooking,
	getBooking,
	getAllBookings,
	updateBooking,
	deleteBooking
};
