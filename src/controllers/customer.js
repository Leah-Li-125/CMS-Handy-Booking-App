const Customer = require("../models/customer");
const Booking = require("../models/booking");

async function addCustomer(req, res) {
	const { firstName, lastName, email } = req.body;
	const customer = new Customer({
		firstName,
		lastName,
		email
	}); //express async error: deal with try()catch()
	await customer.save();
	return res.json(customer);
}

async function getAllCustomers(req, res) {
	const customers = await Customer.find().exec();
	return res.json(customers);
}

async function getCustomer(req, res) {
	const { id } = req.params;
	/*
	//to check whether you are admin in order to control that only admin can access to the populated bookings data related to the customer you request.
	if (req.user.role === "admin"){
		//you can do the populate below
	}
	//otherwise, you cant do the populate below
	*/
	const customer = await Customer.findById(id)
		.populate("bookings", "code name")
		.exec();
	if (!customer) {
		return res.status(404).json("customer not found");
	}
	return res.json(customer);
}

async function updateCustomer(req, res) {
	const { id } = req.params;
	const { firstName, lastName, email } = req.body;
	const customer = await Customer.findByIdAndUpdate(
		id,
		{
			firstName,
			lastName,
			email
		},
		{ new: true }
	).exec();
	if (!customer) {
		return res.status(404).send("customer not found");
	}
	return res.json(customer);
}

async function deleteCustomer(req, res) {
	const { id } = req.params;
	const customer = await Customer.findByIdAndDelete(id).exec();
	if (!customer) {
		return res.status(404).send("customer not found");
	}

	await Booking.updateMany(
		{ _id: { $in: customer.bookings } },
		{ $pull: { customers: customer._id } }
	).exec();
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

	// 	return res.json(booking);
	const customer = await Customer.findById(id).exec();
	// const booking = await Booking.findById(ref_No).exec();

	if (!customer || !booking) {
		return res.status(404).json("customer or booking not found");
	}
	customer.bookings.addToSet(booking.ref_No);
	booking.customers.addToSet(customer._id);
	// booking.customers.addToSet(customer._id, customer.lastName);
	await customer.save();
	await booking.save();
	// return res.json(customer);
	return res.json(booking);
}

async function deleteBooking(req, res) {
	const { ref_No, id } = req.params;
	const customer = await Customer.findById(id).exec();
	const booking = await Booking.findById(ref_No).exec();

	if (!customer || !booking) {
		return res.status(404).json("customer or booking not found");
	}
	const oldCount = customer.bookings.length;
	customer.bookings.pull(booking._id);
	if (customer.bookings.length === oldCount) {
		return res.status(404).json("Enrolment does not exist");
	}
	booking.customers.pull(customer._id);

	await customer.save();
	await booking.save();
	return res.json(customer);
}

module.exports = {
	addCustomer,
	getCustomer,
	getAllCustomers,
	updateCustomer,
	deleteCustomer,
	addBooking,
	deleteBooking
};
