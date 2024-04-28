const mongoose = require("mongoose");
const bookFinesSchema = new mongoose.Schema(
  {
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    booKTranstion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bookTranstion"
    },
    fines:{
        type:Number,
        default:0
    },
    finesStatus: {
        type: String,
        default:"Complete"
    },
  },
  { timestamps: true }
);
const bookFinesModel = mongoose.model("bookFines", bookFinesSchema);
module.exports = bookFinesModel;