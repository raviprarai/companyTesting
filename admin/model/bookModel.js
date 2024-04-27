const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "author"
        },
        stock: {
            type: Boolean,
            default: true
        },
        description: {
            type: String,
        },
        category: {
            type: String,
        },
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
        synopsis: {
            type: String,
        },
    },
    { timestamps: true }
);
const bookModel = mongoose.model("book", bookSchema);
module.exports = bookModel;