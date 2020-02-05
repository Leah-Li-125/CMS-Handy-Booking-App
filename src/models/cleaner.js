const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const schema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			validate: {
				validator: email =>
					!Joi.validate(email, Joi.string().email()).error,
				msg: "Invalid email format"
			}
		},
		bookings: [{ type: String, ref: "Booking" }]
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true
		},
		id: false
	}
);

schema.virtual("fullName").get(function() {
	return `${this.title} ${this.firstName} ${this.lastName}`;
});

const model = mongoose.model("Cleaner", schema);

module.exports = model;
