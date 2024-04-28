const mongoose = require("mongoose");
const bookTranstionSchema = new mongoose.Schema(
    {
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "book"
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        bookName: {
            type: String,
        },
        transactionType: {
            type: String,
            enum: ["Issue", "Return"],
            default: "Issue"
        },
        fromDate: {
            type: String,
        },
        toDate: {
            type: String,
        },
        returnDate: {
            type: String
        },
        transactionStatus: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    { timestamps: true }
);
const bookTranstionModel = mongoose.model("bookTranstion", bookTranstionSchema);
module.exports = bookTranstionModel;