const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema(
    {
        bookName: {
            type: String,
        },
        alternateTitle: {
            type: String,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "author"
        },
        publisher: {
            type: String,
        },
        stock: {
            type: Boolean,
            default: true
        },
        description: {
            type: String,
        },
        category: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "bookCategory"
            }
        ],
        transactions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "bookTranstion"
            }
        ],
        publiction_year: {
            type: String,
        },
        language: {
            type: String,
        },
        pages: {
            type: Number,
        },
        edition: {
            type: String,
        },
        bookStatus: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available"
        },
    },
    { timestamps: true }
);
const bookModel = mongoose.model("book", bookSchema);
module.exports = bookModel;