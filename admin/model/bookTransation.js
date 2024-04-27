const mongoose = require("mongoose");
const bookTranstionSchema = new mongoose.Schema(
  {
    bookId: {
        type: String,
        require: true
    },
    userId: { //EmployeeId or AdmissionId
        type: String,
        require: true
    },
    bookName: {
        type: String,
        require: true
    },
    borrowerName: {
        type: String,
        require: true
    },
    transactionType: { //Issue or Reservation
        type: String,
        require: true,
    },
    fromDate: {
        type: String,
        require: true,
    },
    toDate: {
        type: String,
        require: true,
    },
    returnDate: {
        type: String
    },
    transactionStatus: {
        type: String,
        default: "Active"
    }
  },
  { timestamps: true }
);
const bookTranstionModel = mongoose.model("bookTranstion", bookTranstionSchema);
module.exports = bookTranstionModel;