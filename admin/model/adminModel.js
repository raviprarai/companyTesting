const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    //  deviceToken: {
    //   type: String,
    // },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    // country: {
    //   type: String,
    // },
    // name: {
    //   type: String,
    // },
    // prifilePic: {
    //   type: String,
    // },
    // otp: {
    //   type: String,
    // },
    // otpExpireTime: {
    //   type: Number,
    //   allowNull: true,
    // },
    // otpVerify: {
    //   type: Boolean,
    //   default: false,
    // },
    // deviceToken: {
    //   type: String,
    // },
    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;