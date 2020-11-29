const mongoose = require("mongoose");
const { Schema } = mongoose;

const leadSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    fullName: String,
    address: String,
    deliveryAddress: String,
    alternateAddress1: String,
    address: String,
    stateFiled: String,
    countyFiled: String,
    mailKey:String,
    entityName1:String,
    entityName2:String,
    deliveryAddress: String,
    alternateAddress1: String,
    city: String,
    state: String,
    zip4: String,
    zip: String,
    lexisQuery: String,	  
    zipCode: String,
    county: String,
    ssn: String,
    fileType: String,
    amount: String,
    source: String,
    email: String,
    filingDate: String,
    loadDate: Date,
    dupId:String,
    fiveAmount: String,
    nineAmount: String,
    loadDatePlusSeven: String,
    entityType: String,
    pinCode: String,
    origDept: String,
    plaintiff: String,
    age: String,
    dob: String,
    scrapeDate: Date,
    phone: String,
    phones: [String],
    ageRange: String,
    phone: String,
    emailAddresses: [String],
    email: String,
    emailAddress: String,
    stateRelease:String,
    fedRelease:String,
    otherliens:[{
      plaintiff:{ type: String },
      amount:{ type: String },
      filingDate:{ type: String }
    }]

  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("leads", leadSchema);


