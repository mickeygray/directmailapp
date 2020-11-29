const mongoose = require("mongoose");
const { Schema } = mongoose;

const zipSchema = new Schema({
zip4: String,
class: String, 
});

module.exports = mongoose.model("zip", zipSchema);