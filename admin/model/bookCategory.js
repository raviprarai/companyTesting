const mongoose = require("mongoose");
const bookCategorySchema = new mongoose.Schema(
  {
     category_Name: {
      type: String,
    },
    book: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "book"
        }
    ],
  },
  { timestamps: true }
);
const bookCategoryModel = mongoose.model("bookCategory", bookCategorySchema);
module.exports = bookCategoryModel;