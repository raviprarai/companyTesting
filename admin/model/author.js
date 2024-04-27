const mongoose = require("mongoose");
const authorSchema = new mongoose.Schema(
  {
     author_name: {
      type: String,
    },
    nationality: {
      type: String,
    },
    dob: {
      type: String,
    },
    biography: {
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
const authorModel = mongoose.model("author", authorSchema);
module.exports = authorModel;