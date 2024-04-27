const mongoose = require("mongoose");
// const MONGO_URL = process.env.URL;
// console.log(MONGO_URL);
mongoose.set("strictQuery", false);
exports.connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/liberyTest", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected Successfully...."));

  mongoose.connection.on("error", (err) => {
    console.log(`DB connection error: ${err.message}`);
  });
};