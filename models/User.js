const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    isAdmin: Boolean,
});

const User = mongoose.model('User', userSchema);

// Function to validate user
function validateUser(user) {
    const schema = {
        userName: Joi.string().required().min(3).max(50).error(errors => errors[0]),
        email: Joi.string().required().min(5).max(255).email().error(errors => errors[0]),
        password: Joi.string().required().min(3).max(255).error(errors => errors[0]),
    };

    return Joi.validate(user, schema, {abortEarly: false});
}

exports.User = User;
exports.validate = validateUser;