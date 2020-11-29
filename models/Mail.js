const mongoose = require("mongoose");
const { Schema } = mongoose;

const MailSchema = new Schema({
  title: String,
  mailHouse: String,
  vendor: String,
  type: String,
  colorPaper: String,
  colorInk: String,
  image: String,
  taxChart: String,
  theme: String,
  lienType: String,
  key: String,
  lienAmount: String,
  fileid: String,
  zipCodeSuppress: String,
  zipCode: [String],
  costs: [{ date: Date, costs: Number }],
  postageCeiling: String,
  unitCost: String,
  tracking: String,
  startDate: String,
});

module.exports = mongoose.model("mail", MailSchema);
