const Cleaner = require("../models/cleaner");
const Booking = require("../models/booking");

async function addCleaner(req, res) {
	const { firstName, lastName, email } = req.body;
	const cleaner = new Cleaner({
		firstName,
		lastName,
		email
	});
	await cleaner.save();
	return res.json(cleaner);
}

async function getAllCleaners(req, res) {
	const cleaners = await Cleaner.find().exec();
	return res.json(cleaners);
}

async function getCleaner(req, res) {
	const { id } = req.params;
	const cleaner = await Cleaner.findById(id).exec();
	if (!cleaner) {
		return res.status(404).json("cleaner not found");
	}
	return res.json(cleaner);
}

async function updateCleaner(req, res) {
	const { id } = req.params;
	const { firstName, lastName, title, email } = req.body;
	const cleaner = await Cleaner.findByIdAndUpdate(
		id,
		{
			firstName,
			lastName,
			title,
			email
		},
		{ new: true }
	).exec();
	if (!cleaner) {
		return res.status(404).send("cleaner not found");
	}
	return res.json(cleaner);
}

async function deleteCleaner(req, res) {
	const { id } = req.params;
	const cleaner = await Cleaner.findByIdAndDelete(id).exec();
	if (!cleaner) {
		return res.status(404).send("cleaner not found");
	}

	await Booking.updateMany(
		{ _id: { $in: cleaner.bookings } },
		{ $pull: { cleaners: cleaner._id } }
	).exec();
	// return res.json(cleaner);
	return res.sendStatus(200);
}

async function addBooking(req, res) {
	const { id } = req.params; //{ bookingId, customerId }
	const { title, description, ref_No } = req.body;
	const existingbooking = await Booking.findById(ref_No).exec();
	if (existingbooking) {
		return res.status(400).json("Duplicate booking code");
	}
	const booking = new Booking({
		title,
		ref_No,
		description
	});

	const cleaner = await Cleaner.findById(id).exec();

	if (!cleaner || !booking) {
		return res.status(404).json("cleaner or booking not found");
	}
	cleaner.bookings.addToSet(booking.ref_No);
	booking.cleaners.addToSet(cleaner._id);
	// booking.cleaners.addToSet(cleaner._id, cleaner.lastName);
	await cleaner.save();
	await booking.save();
	// return res.json(cleaner);
	return res.json(booking);
}

async function deleteBooking(req, res) {
	const { ref_No, id } = req.params;
	const cleaner = await Cleaner.findById(id).exec();
	const booking = await Booking.findById(ref_No).exec();

	if (!cleaner || !booking) {
		return res.status(404).json("cleaner or booking not found");
	}
	const oldCount = cleaner.bookings.length;
	cleaner.bookings.pull(booking._id);
	if (cleaner.bookings.length === oldCount) {
		return res.status(404).json("Enrolment does not exist");
	}
	booking.cleaners.pull(cleaner._id);

	await cleaner.save();
	await booking.save();
	return res.json(cleaner);
}

module.exports = {
	addCleaner,
	getCleaner,
	getAllCleaners,
	updateCleaner,
	deleteCleaner,
	addBooking,
	deleteBooking
};
