const mongoose = require("mongoose");
const { Schema } = mongoose;

const lexKeySchema = new Schema(
  {
    lexs: [String],
    mailKey: String,
});

module.exports = mongoose.model("lexKeys", lexKeySchema);