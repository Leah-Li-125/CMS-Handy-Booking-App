const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const schema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true
			// minlength: 10
		},
		lastName: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			//here to validate email, either third party library like joi or self-written rejex-Regular Expression
			//here use a old version of Joi @15, latest is @17, at the end showsvalidation example  @17
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

const model = mongoose.model("Customer", schema);

schema.virtual("fullName").get(function() {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = model;

/*
const Joi = require('@hapi/joi');

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    access_token: [
        Joi.string(),
        Joi.number()
    ],

    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2013),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
    .with('username', 'birth_year')
    .xor('password', 'access_token')
    .with('password', 'repeat_password');


schema.validate({ username: 'abc', birth_year: 1994 });
// -> { value: { username: 'abc', birth_year: 1994 } }

schema.validate({});
// -> { value: {}, error: '"username" is required' }

// Also -

try {
    const value = await schema.validateAsync({ username: 'abc', birth_year: 1994 });
}
catch (err) { }
*/
