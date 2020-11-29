const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");
const Grid = require("gridfs-stream");

const connectDB = async () => {
  let gfs;
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    const connect = mongoose.createConnection(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    connect.once("open", () => {
      gfs = new mongoose.mongo.GridFSBucket(connect.db, { bucketName: "fs" });
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
