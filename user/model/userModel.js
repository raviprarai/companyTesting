const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        username: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        joinDate: {
            type: String,
        },
        gender: {
            type: String,
        },
        address: {
            type: String,
        },
        dob: {
            type: String,
        },
        password: {
            type: String,
        },
        profilePic: {
            type: String,
        },
        isUser: {
            type: Boolean,
            default: true,
        },
        fines:{
            type:Number,
            default:0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);