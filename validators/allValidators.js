const Joi = require("joi");
const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    joinDate: Joi.string(),
    gender: Joi.string().required(),
    // profilePic: Joi.string(),
    username: Joi.string().required(),
    dob: Joi.string().required(),
    password:Joi.string().required()
});
const userLogin = Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().required()
});
const userEditSchema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    address: Joi.string(),
    phone: Joi.string(),
    gender: Joi.string(),
    username: Joi.string(),
    dob: Joi.string()
});
const image = Joi.object({
    profilePic: Joi.string()
});
const admin = Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().required()
});
const author = Joi.object({
    author_name: Joi.string().required(),
    dob:Joi.string().required(),
    nationality:Joi.string().required(),
    biography:Joi.string().required()
});
module.exports = {
    userSchema,userLogin,userEditSchema,image,admin,author

};