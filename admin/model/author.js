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
  },
  { timestamps: true }
);
const authorModel = mongoose.model("author", authorSchema);
module.exports = authorModel;