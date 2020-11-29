const express = require("express");
const router = express.Router();
const Lead = require('../models/Lead')
const LexKey = require('../models/LexKey')
const moment = require('moment')
const { Parser } = require("json2csv");
const nodemailer = require("nodemailer");
const { localeData } = require("moment");
const utf8 = require('utf8');
const { v4: uuidv4 } = require('uuid');


//Add the records and create mailkey filter by mailkey email records with dup mailkey in list send dups to react app as buttons with x 
router.post("/", async  (req,res) =>{


const leads = []

  if(Object.keys(req.body[0]).toString().includes("entityName")){
  
   req.body.map(({entityName1, entityName2, address, city, state, zip, filingDate, amount, stateFiled, countyFiled}) => {
  var r = /\d+/g;
let addressNumber = address.match(r) 

console.log(address) 

  const nameString = entityName1.split(' ')  

  let lastnm 

  if(nameString[nameString.length-1].toLowerCase !== "jr" || nameString[nameString.length-1].toLowerCase !== "sr" || nameString[nameString.length-1].toLowerCase !== "iii" ){
    lastnm = nameString[nameString.length-1] 
  }else {
    lastnm = nameString[nameString.length-2] 
  }

  let obj = {
  fullName: entityName1.includes("&") ? entityName1.substr(entityName1.indexOf("&")+2, entityName1.length) : entityName1,
  firstName: entityName1.includes("&") ? entityName1.substr(entityName1.indexOf("&")+2, entityName1.length).split(' ')[0].toString() : entityName1.split(' ')[0].toString(),
  lastName:  nameString[nameString.length-1].toLowerCase !== "jr" || nameString[nameString.length-1].toLowerCase !== "sr" || nameString[nameString.length-1].toLowerCase !== "iii" ?  nameString[nameString.length-1] :  nameString[nameString.length-2],
  address: address,
  city: city,
  dupId: uuidv4(),
  state: state,
  zip: zip.substring(0,5),
  filingDate:filingDate,
  amount:amount,
  county: countyFiled,
  plaintiff: "Internal Revenue Service",
  fileType: "Federal Tax Lien",
  mailKey: address.split(' ')[0].toString().trim().toLowerCase() + amount.replace("$","").replace(",", "").substr(0,amount.indexOf(".")-1).replace(".",'').trim() + lastnm.toLowerCase(),
  lexisQuery: `type(federal tax lien) and amount (btw ${parseInt(amount.replace("$","").replace(",", "").substr(0,amount.indexOf(".")-1).replace(".",'').trim())-500} and ${parseInt(amount.replace("$","").replace(",", "").substr(0,amount.indexOf(".")-1).replace(".",'').trim())+500}) AND filing-date(is ${filingDate})`,
  loadDate: Intl.DateTimeFormat(
      "en-US",
      { timeZone: "America/Los_Angeles" },
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    ).format(new Date(Date.now())) 
  }
  return leads.push(obj);
})
} else {
    req.body.map(({fileType, filingDate, loadDate, address, city, state, zip, zip4, plaintiff, amount, entityType, plantiff, deliveryAddress, county, rmsid, firstName, midInit, lastName, suffix, fullName }) => {
    var r = /\d+/g;
    let addressNumber = address ? address.match(r).toString() :''
    let deliveryAddressNumber = deliveryAddress ? deliveryAddress.match(r).toString():''

    let midNm
    let lastNm

    if(lastName === null){
       lastNm=''
    }else{
      lastNm=lastName
    }
    if(midInit === null){
      midNm = ''
    } else {
      midNm = midInit
    }

    console.log(firstName)

    console.log(lastNm)

  let obj = {
  fullName:  firstName + lastNm,
  firstName: firstName,
  lastName: lastNm,
  address: deliveryAddress ? deliveryAddress : address,
  city: city,
  state: state,
  zip: zip4 ? zip4 : zip,
  filingDate:filingDate,
  amount:amount.replace("$","").replace(",","").replace(",","").replace(/\.[0-9][0-9]/,""),
  county: county,
  plaintiff: plantiff ? plantiff : plaintiff,
  fileType: fileType,
  mailKey: deliveryAddress ? deliveryAddressNumber + amount.replace("$","").replace(",","").replace(/\.[0-9][0-9]/,"")+lastNm.toLowerCase() :  addressNumber + amount + lastNm.toLowerCase(),
  lexisQuery: `type(${fileType}) and amount (btw ${parseInt(amount)-500} and ${parseInt(amount)+500}) AND filing-date(is ${filingDate})`,
  loadDate: loadDate,
  entityType: entityType,
  dupId: uuidv4(),
  county: county, 
  pinCode: rmsid,

  }
  return leads.push(obj);
})
}

var uniq = leads
  .map((lead) => {
    return {
      count: 1,
      mailKey: lead.mailKey
    }
  })
  .reduce((a, b) => {
    a[b.mailKey] = (a[b.mailKey] || 0) + b.count
    return a
  }, {})

  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)

  const dupLeads = leads.filter((lead) => duplicates.includes(lead.mailKey))

  const newLeads = leads.filter((lead)=> !duplicates.includes(lead.mailKey))

  await Lead.insertMany(newLeads)

  res.json(dupLeads)
  console.log(newLeads)
  console.log(dupLeads)
}) 

//upload files get suppression create mailkey new list by mailkey save new records email unique list 
 router.post("/dup", async (req,res)=>{

  const list = req.body
  const leads = await Lead.insertMany(list);

  res.json(leads);
}) 

 router.post("/new", async (req,res)=>{


   const leads = []
 if(Object.keys(req.body[0]).toString().includes("entityName")){
  


   req.body.map(({entityName1, entityName2, address, city, state, zip, filingDate, amount, stateFiled, countyFiled}) => {

  const nameString = entityName1.split(' ')  

  let lastnm 

  if(nameString[nameString.length-1].toLowerCase !== "jr" || nameString[nameString.length-1].toLowerCase !== "sr" || nameString[nameString.length-1].toLowerCase !== "iii" ){
    lastnm = nameString[nameString.length-1] 
  }else {
    lastnm = nameString[nameString.length-2] 
  }

  var r = /\d+/g;
  let addressNumber = address.match(r)[0]
 
 
  let obj = {
  fullName: entityName1.includes("&") ? entityName1.substr(entityName1.indexOf("&")+2, entityName1.length) : entityName1,
  firstName: entityName1.includes("&") ? entityName1.substr(entityName1.indexOf("&")+2, entityName1.length).split(' ')[0].toString() : entityName1.split(' ')[0].toString(),
  lastName:  nameString[nameString.length-1].toLowerCase !== "jr" || nameString[nameString.length-1].toLowerCase !== "sr" || nameString[nameString.length-1].toLowerCase !== "iii" ?  nameString[nameString.length-1] :  nameString[nameString.length-2],
  address: address,
  city: city,
  dupId: uuidv4(),
  state: state,
  zip: zip.substring(0,5),
  filingDate:filingDate,
  amount:amount,
  county: countyFiled,
  plaintiff: "Internal Revenue Service",
  fileType: "Federal Tax Lien",
  mailKey: addressNumber + amount.replace("$","").replace(",", "").substr(0,amount.indexOf(".")-1).replace(".",'').trim() + lastnm.replace("-","").toLowerCase(),
  lexisQuery: `type(federal tax lien) and amount (btw ${parseInt(amount.replace("$","").replace(",", "").substr(0,amount.indexOf(".")-1).replace(".",'').trim())-500} and ${parseInt(amount.replace("$","").replace(",", "").substr(0,amount.indexOf(".")-1).replace(".",'').trim())+500}) AND filing-date(is ${filingDate})`,
  loadDate: Intl.DateTimeFormat(
      "en-US",
      { timeZone: "America/Los_Angeles" },
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    ).format(new Date(Date.now())) 
  }
  return leads.push(obj);
})
} else {
    req.body.map(({fileType, filingDate, fileDate, loadDate, address, city, state, zip, zip4, plaintiff, amount, entityType, plantiff, deliveryAddress, county, rmsid, firstName, midInit, lastName, suffix, fullName }) => {
  var r = /\d+/g;
 let addressNumber = address ? address.match(r)[0] : ''
 let deliveryAddressNumber = deliveryAddress ? deliveryAddress.match(r)[0] : ''

  let midNm
  let suff
  let lastNm

    if(midInit === undefined || midInit === null){
      midNm = ''
    } else {
      midNm = midInit
    }

    if(suffix === undefined || suffix === null){
      suff = ''
    } else {
      suff = suffix
    }

    if(lastName === undefined || lastName === null){
      lastNm = ''
    } else {
      lastNm = lastName
    }


  let obj = {
  fullName: firstName + ' ' +  lastNm,
  firstName: firstName,
  lastName: lastName,
  address: deliveryAddress ? deliveryAddress : address,
  city: city,
  state: state,
  zip: zip4 ? zip4 : zip,
  filingDate:fileDate ? fileDate : filingDate,
  amount:amount,
  county: county,
  plaintiff: plantiff ? plantiff : plaintiff,
  fileType: fileType,
  mailKey: deliveryAddressNumber ? deliveryAddressNumber + amount.replace(".00","").replace("$","").replace(',','').replace(",","").replace(" ","") + lastNm.replace("-","").replace(' ','').toLowerCase() : addressNumber + amount.replace(".00","").replace("$","").replace(',','').replace(",","").replace(" ","") + lastNm.replace("-","").replace(' ','').toLowerCase()  ,
  lexisQuery: `type(${fileType}) and amount (btw ${parseInt(amount.replace(".00","").replace("$","").replace(',',''))-500} and ${parseInt(amount.replace(".00","").replace("$","").replace(',',''))+500}) AND filing-date(is ${fileDate ? fileDate : filingDate})`,
  loadDate: loadDate,
  entityType: entityType,
  dupId: uuidv4(),
  county: county, 
  pinCode: rmsid,

  }
  return leads.push(obj);
})
}




const suppressionList = leads.map((lead) => lead.mailKey)


const suppressionLeads = await Lead.find({
    "mailKey": { "$in": suppressionList },
  });

 //console.log(suppressionLeads)

const master = leads.concat(...suppressionLeads)

console.log(leads.length, 'leads')
console.log(master.length,'master')
var uniq = master
  .map((lead) => {
    return {
      count: 1,
      mailKey: lead.mailKey
    }
  })
  .reduce((a, b) => {
    a[b.mailKey] = (a[b.mailKey] || 0) + b.count
    return a
  }, {})

  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)


  
  const dupLeads = master.filter((lead) => duplicates.includes(lead.mailKey))

  const newLeads = master.filter((lead)=> !duplicates.includes(lead.mailKey))




  await Lead.insertMany(newLeads)

  res.json(dupLeads)

}) 




router.delete("/", async (req, res) => {


console.log(req.query.q)


  try {
Lead.findOneAndRemove({"dupId":req.query.q }, 
    function (err, docs) { 
    if (err){ 
        console.log(err) 
    } 
    else{ 
        console.log("Removed Lead : ", docs); 
    } 
}); 

    res.json({ msg: "Lead removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }

});

router.get("/releases", async (req,res)=>{
  const {startDate,endDate} = JSON.parse(req.query.q)

console.log(startDate)

  const periodStart = new Date(startDate)
  const periodEnd = new Date(endDate)


  let leads = await Lead.find({
    loadDate: {
	    $gte:periodStart,
	    $lte:periodEnd
    }})	

console.log(leads)
    
   const federalReleases = leads.filter(e => e.fedRelease && e.fedRelease.includes('POSSIBLE')) || []
   const stateReleases = leads.filter(e => e.stateRelease && e.stateRelease.includes('POSSIBLE')) 

   const releases = federalReleases.concat(...stateReleases)

   res.json(releases)	   
})

router.get("/lexs", async (req, res) =>  {

  const { startDate, endDate } = JSON.parse(req.query.q);

  const momentPeriodStart = new Date(startDate);
  const momentPeriodEnd = new Date(endDate);

  
  const leads = await Lead.find({
    loadDate: {
      $gte: momentPeriodStart,
      $lte: momentPeriodEnd,
    },
  });

  const mailKeys = leads.map(lead => lead.mailKey)

  const lexs = await LexKey.find({    
    "mailKey": { "$in": mailKeys }
  })

  const result = leads.filter((e)=> !e.dob && !e.ssn).map((lead)=>{
   
  const keyMatch= lexs.filter((e)=> e.mailKey === lead.mailKey)  

  let obj ={
  mailKey: lead.mailKey,
  lexisInfo: keyMatch.length > 0 ? keyMatch : lead.lexisQuery,
  fullName: lead.fullName, 
  address: lead.address	  
  }
  return obj
  })	

  console.log(result)

  res.json(result)	  
})


 router.get("/today", async (req, res) => {
  // console.log(req);

  const today = Intl.DateTimeFormat(
      "en-US",
      { timeZone: "America/Los_Angeles" },
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    ).format(new Date(Date.now())) 

  const prospects = await Lead.find({
    "loadDate": today
  });




const filterUnwanted = (arr) => {
   const required = arr.filter(el => {
      return el.otherliens;
   });
   return required;
};

  const result = prospects.map(({fullName,fileType, filingDate, firstName, mailKey, lastName, state,zip, county, plaintiff, amount, address, age, dob, ssn, otherliens, phones, emailAddresses}) => {
  let obj = {
    fullName: fullName,
    First_Name: firstName,
    Last_Name: lastName,
    Address: address,
    mailKey: mailKey,
    city:city,
    State: state,
    Zip_4: zip,
    file_date: filingDate,
    County: county,
    plaintiff: plaintiff,
    lien_type: fileType,
    Amount: amount,
    age: age,
    dob: dob,
    ssn: ssn
  };

 phones.forEach((phone, i) => obj[`phone${i+1}`] = phone)
 emailAddresses.forEach((addr, i) => obj[`emailAddress${i+1}`] = addr)
 otherliens.filter((e)=> e.plaintiff && e.plaintiff.includes("Internal Revenue") || e.plaintiff && e.plaintiff.includes("State of") || e.plaintiff && e.plaintiff.includes("IRS")).forEach(({plaintiff, amount}, i) => {
    obj[`plaintiff${i+1}`] = plaintiff;
    obj[`amount${i+1}`] = amount;
  });

  return obj;
})



 const json2csvParser = new Parser();
 const csv = json2csvParser.parse(result);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'blackballedproductions@gmail.com',
    pass: 'Pay@ttention35!' // naturally, replace both with your real credentials or an application-specific password
  }
});



   const attachment2 = {
          filename: `Unique Daily File - ${today}.csv`,
          content: csv,
        };
  const mailer2 = {
    title: "list",
    from: "mickey",
    to: ["mickeygray85@hotmail.com","poakes@nattaxexperts.com","arios@nattaxexperts.com","mforde@nattaxexperts.com"],
    subject: `Unique Daily File - ${today}`,
    text: `Here are all of the unique leads with a load date of Today `,
    attachments:[attachment2]
  };

  transporter.sendMail(mailer2);

});

router.get("/dups", async (req, res) => {

  const leads = await Lead.find({})
  var uniq = leads
  .map((lead) => {
    return {
      count: 1,
      mailKey: lead.mailKey
    }
  })
  .reduce((a, b) => {
    a[b.mailKey] = (a[b.mailKey] || 0) + b.count
    return a
  }, {})

  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)

  const dupLeads = leads.filter((lead) => duplicates.includes(lead.mailKey))

  res.json(dupLeads)

});


router.put("/", async (req, res) => {
  
 let string = Object.keys(req.body).toString()

 string = string.replace(/[^\x00-\x7F]/g, " ");

 let addresser = string.match(/(?<=1:\s*).*?(?=\s*\r\n)/gs);
 const addressa = addresser[1]

 let citya = string.match(/(?<=1:\s*).*?(?=\s*,)/gs);

 const rawcity = citya[1].split(' ')

 const finalcity = rawcity[rawcity.length-1]
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  String.prototype.toProperCase = function () {
    return this.replace(/\w\S* /g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  let reg1 = /(?:[a-z0-9!#$%'&*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gis;
  let reg2 = /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/gim;
  let liens = string.match(/(?<=Debtor Information\s*).*?(?=\s*Number)/gs);
  
  let emails = string.match(reg1) || []
  let phone1 = string.match(reg2) || []
  

  if (phone1.length > 0)
    phone1 = phone1.toString()
    .replace(/[\n\r]/g, "")
    .split(",").map((phone) => phone.trim()).filter(distinct);

  let bankruptcy1 = string.match(
    /(?<=Petitioner Information\s*).*?(?=\s*Meeting Date)/gs
  );
  let real1 = string.match(/(?<=Deed Record for\s*).*?(?=\s*Loan Type)/gs);
 
  let release1 = string.match(/(?<=FEDERAL TAX\s*).*?(?=\s*RELEASE)/gs);
  let release2 = string.match(/(?<=STATE TAX \s*).*?(?=\s*RELEASE)/gs);

  let type1 = string.match(/(?<=Filing 1\s*).*?(?=\s*Book:)/gs);



  const formattedLiens = []
  liens.forEach(leadString =>{  
    
  leadString.replace(leadString.substring(leadString.indexOf("Debtor 2")), "");

  const S =
    leadString.substring(0, leadString.indexOf("Debtor 2")) +
    leadString.substring(leadString.indexOf("Creditor Information"));

  let leadBody;

  if (leadString.includes("Debtor 2")) {
    leadBody =
      "{" +
      S.replace(/[\s,]+/g, " ")
        .trim()
        .replace("Debtor 1", "")
        .replace("Debtor 2", "")
        .replace("Filing 1", "")
        .replace("Name:", '"fullName":"')
        .replace("SSN:", '", "ssn":"')
        .replace("Address:", '", "address":"')
        .replace("Creditor Information Name:", '", "plaintiff":"')
        .replace("Jurisdiction", '", "state":"')
        .replace("Filing Information", "")
        .replace("Amount", '", "amount":"')
        .replace("Filing Date", '", "filingDate":"')
        + '"}';
  } else {
    leadBody =
      "{" +
      leadString
        .replace(/[\s,]+/g, " ")
        .trim()
        .replace("Debtor 1", "")
        .replace("DebtorÂ 1",'')
        .replace("Debtor 2", "")
        .replace("Filing 1", "")
        .replace("Name:", '"fullName":"')
        .replace("SSN:", '", "ssn":"')
        .replace("Address:", '", "address":"')
        .replace("Creditor Information Name:", '", "plaintiff":"')
        .replace("Jurisdiction", '", "state":"')
        .replace("Filing Information", "")
        .replace("Amount", '", "amount":"')
         .replace(",Original,Filing","")
         .replace("Original Filing")   
        .replace("Filing Date", '", "filingDate":"')
      +'"}';
  }

 // console.log(leadBody)

  let lead = JSON.parse(leadBody);

 formattedLiens.push(lead)
})

//console.log(formattedLiens)

let lead = formattedLiens[0]
  
  lead.county = lead.address
    .match(/(?<=(\d+)(?!.*\d)\s*).*?(?=\s*COUNTY)/gs)
    .toString();
  if (phone1) {
    lead.phones = phone1.filter((str) => str.includes("("));
  }

  if (lead.amount != null) {
    lead.amount = lead.amount.replace(":", "");
  }

 if(lead.filingDate) { lead.filingDate = lead.filingDate.replace(": ", "")}

 //  lead.city = lead.address.match(/#\d+ ([^,]+), ([A-Z]{2}) (\d{5})/)
let citystate = lead.address.match(/([a-zA-Z ]+ [a-zA-z ]+)/).toString()

citystate = citystate.split(' ')
citystate = citystate.filter(e => String(e).trim());
if(citystate[citystate.length-1].length === 2){
lead.state = citystate[citystate.length-1] 
} 
lead.state = lead.state.replace(":", "").replace(": ", "");

  if (lead.plaintiff != null) {
    lead.plaintiff = lead.plaintiff
      .split(" ")
      .filter(function (el) {
        return el != "";
      })
      .toString()
      .replace(",", " ")
      .replace(",", " ")
      .toProperCase();
  }

  if (lead.address){
    lead.zip4 = lead.address
      .substring(
        lead.address.lastIndexOf(lead.state),
        lead.address.lastIndexOf(lead.county)
      )
      .split(" ")
      .splice(-1)
      .toString();

    lead.stateRelease = release1 ? "STATE TAX RELEASE POSSIBLE" : ''
    
    lead.fedRelease = release2 ? "FEDERAL TAX RELEASE POSSIBLE": ''
    //lead.type = type1[0]
    lead.address = lead.address
      .substring(0, lead.address.indexOf(lead.state))
    /*
     lead.address = lead.address
      .substring(0, lead.address.indexOf(lead.city))
      .split(" ")
      .filter(function (el) {
        return el != "";
      })
      .toString()
      .replace(",", " ")
      .replace(",", " ")
      .replace(",", " ")
      .toProperCase();  
    */
    }

  if(lead.plaintiff.includes("Internal")){
    lead.type = "Federal Tax Lien"
  } else {
    lead.type = "State Tax Lien"
  } 

  if (lead.amount != null) {
    lead.amount = lead.amount

    .split(" ")
      .filter(function (el) {
        return el != "";
      })
      .toString();
  }

  lead.amount = lead.amount.replace(",Original,Filing","").replace("Original Filing")   

  if (lead.city != null) {
    lead.city = lead.city.toProperCase();
  }

  if (lead.county != null) {
    lead.county = lead.county
      .split(" ")
      .filter(function (el) {
        return el != "";
      })
      .toString()
      .toProperCase();
  }

  if (lead.state != null) {
    lead.state = lead.state
      .split(" ")
      .filter(function (el) {
        return el != "";
      })
      .toString();
  }

  if (lead.fullName != null) {
    lead.firstName = lead.fullName
      .split(" ")
      .filter(function (el) {
        return el != "";
      })[1]
      .toString()
      .toProperCase();
  }


  
  if (lead.fullName != null) {
    lead.lastName = lead.fullName
      .split(" ")
      .filter(function (el) {
        return el != "";
      })[0]
      .toString()
      .toProperCase();
  }
  if (lead.fullName != null) {
    lead.fullName = lead.fullName.replace(
      lead.fullName,
      lead.firstName + " " + lead.lastName
    );
  }

  if (real1 != null) {
    let realIndex1 = real1.toString().search(/Name/);
    let realIndex2 = real1.toString().search(/Address/);
    let realIndex3 = real1.toString().search(/County\/FIPS/);
    let realIndex4 = real1.toString().search(/Mortgage Information/);

    const realField1 = real1.toString().slice(realIndex1, realIndex2);
    const realField2 = real1.toString().slice(realIndex2, realIndex3);
    const realField3 = real1
      .toString()
      .slice(realIndex4, real1.toString().length);

    const colon1 = realField1.search(":");
    const colon2 = realField2.search(":");

    const name =
      '"' +
      realField1.slice(0, colon1).toLowerCase() +
      '"' +
      ':"' +
      realField1.slice(colon1 + 1, realField1.length) +
      '",';

    const address2 =
      '"' +
      realField2.slice(0, colon2).toLowerCase() +
      '"' +
      ':"' +
      realField2.slice(colon2 + 1, realField2.length) +
      '",';

    const loan =
      '"' + realField3.slice(realField3.length - 16, realField3.length) + '"';

    const colon3 = loan.search(":");

    const bone =
      loan.slice(0, colon3) + '"' + ':"' + loan.slice(colon3 + 1, loan.length);

    const stone = bone.toLowerCase().trim();

    const realBody = "{" + name + address2 + stone + "}";

  //  lead.real = JSON.parse(realBody.replace(/\s{2,10}/g, " "));
  } else {
    lead.real = {
      name: "",
      address: "",
      amount: "",
    };
  }

  if (bankruptcy1) {
    let bankIndex1 = bankruptcy1.toString().search(/Bankruptcy Information/);
    let bankIndex2 = bankruptcy1.toString().search(/Court/);
    let bankIndex3 = bankruptcy1.toString().search(/Filing Date/);
    let bankIndex4 = bankruptcy1.toString().search(/Filing Type/);

    const bankField1 = bankruptcy1.toString().slice(bankIndex1, bankIndex2);
    const bankField2 = bankruptcy1.toString().slice(bankIndex2, bankIndex3);
    const bankField3 = bankruptcy1
      .toString()
      .slice(bankIndex4, bankruptcy1.toString().length);

    const colon4 = bankField1.search(":");
    const colon5 = bankField2.search(":");
    const colon6 = bankField3.search(":");

    const loc =
      '"' +
      bankField2.slice(0, colon5).toLowerCase().trim() +
      '"' +
      ':"' +
      bankField2.slice(colon5 + 1, bankField2.length - 1).trim() +
      '",';

    const gock = loc.replace(/\r?\n|\r/g, "");

    const negro =
      '"' +
      bankField3.slice(0, colon6).toLowerCase().trim() +
      '"' +
      ':"' +
      bankField3.slice(colon6 + 1, bankField3.length).trim() +
      '"';

    const begro = negro.replace(" type", "Type");

    const bankBody = "{" + gock + begro + "}";

    //lead.bankruptcy = JSON.parse(bankBody);
  }
  lead.age = string.match(/(?<=[(]Age:\s*).*?(?=\s*[)])/gs)
  
  if (lead.age) {
    lead.age = lead.age[0].toString()
  }
  
    lead.dob = string
    .match(/(?<=[-]XXXX\s*).*?(?=\s*[(]Age:)/gs)

    if(lead.dob){
      lead.dob = lead.dob[0].toString().trim().substring(0, 7);
    }

if(lead.filingDate){
  lead.filingDate = lead.filingDate.replace(":", "").trim();
}
  

  lead.ssn = string.slice(string.indexOf('Email')).toString().match(/.+?(?=XXXX)/)

  if(lead.ssn){
   lead.ssn = lead.ssn[0]
  }

  const regex = new RegExp("/((^[A-Z][,][A-Z]))/", "g");

  lead.emailAddresses = emails.filter(distinct);

  lead.otherliens = formattedLiens

  lead.city1 = finalcity
  lead.address1 = addressa

  console.log(lead.address.trim().substr(0,lead.address.indexOf(' ')-1).toLowerCase())

  console.log(lead.amount.replace("$","").replace(",", ""))

  console.log( lead.lastName.replace("-","").toLowerCase() )
  lead.mailKey = lead.address.trim().substr(0,lead.address.indexOf(' ')-1).toLowerCase() + lead.amount.replace("$","").replace(",", "") + lead.lastName.replace("-","").toLowerCase() 

  if(lead.mailKey.startsWith("p")){
    lead.mailKey = lead.mailKey.substring(0, 1) + 'o' + lead.mailKey.substring(1,lead.mailKey.length);
  }

  const {
    fullName,
    ssn,
    address,
    plaintiff,
    state,
    amount,
    filingDate,
    stateRelease,
    fedRelease,
    emailAddresses,
    type,
    city1,
    county,
    phones,
    zip4,
    city,
    mailKey,
    firstName,
    lastName,
    real,
    bankruptcy,
    age,
    dob,
    otherliens
  } = lead;

const scrapeDate = new Date(moment())
const dupId = uuidv4()
const newLead = new Lead({
    fullName,
    ssn,
    address,
    mailKey,
    plaintiff,
    state,
    amount,
    filingDate,
    stateRelease,
    fedRelease,
    emailAddresses,
    mailKey,
    county,
    phones,
    dupId,
    zip4,
    type,
    city,
    scrapeDate,
    firstName,
    lastName,
    real,
    bankruptcy,
    age,
    dob,
    otherliens,
    city1,
  });

 const leada = await newLead.save();

 res.json(leada)

  console.log(lead)
   
});
router.get("/", async (req, res) => {
  // console.log(req);

  const today = moment().startOf("day");

  const prospects = await Lead.find({  scrapeDate: {
      $gte: today.toDate(),
      $lte: moment(today).endOf("day").toDate(),
    }
  });

  console.log(prospects)
const filterUnwanted = (arr) => {
   const required = arr.filter(el => {
      return el.otherliens;
   });
   return required;
};

  const result = prospects.map(({fullName, filingDate, firstName, mailKey, lastName, type, address, city1, state,zip4, county, plaintiff, amount, age, dob, ssn, otherliens, phones, emailAddresses}) => {
  let obj = {
    fullName: fullName,
    First_Name: firstName,
    Last_Name: lastName,
    Address: address.replace(city1,''),
    city:city1,
    State: state,
    Zip_4: zip4,
    file_date: filingDate,
    mailKey: mailKey,
    County: county,
    plaintiff: plaintiff,
    lien_type: type,
    Amount: amount,
    age: age,
    dob: dob,
    ssn: ssn
  };

 phones.forEach((phone, i) => obj[`phone${i+1}`] = phone)
 emailAddresses.forEach((addr, i) => obj[`emailAddress${i+1}`] = addr)
 otherliens.filter((e)=> e.plaintiff && e.plaintiff.includes("Internal Revenue") || e.plaintiff && e.plaintiff.includes("State of") || e.plaintiff && e.plaintiff.includes("IRS")).forEach(({plaintiff, amount}, i) => {
    obj[`plaintiff${i+1}`] = plaintiff;
    obj[`amount${i+1}`] = amount;
  });

  return obj;
})



 const json2csvParser = new Parser();
 const csv = json2csvParser.parse(result);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'blackballedproductions@gmail.com',
    pass: 'Pay@ttention35!' // naturally, replace both with your real credentials or an application-specific password
  }
});

   const attachment2 = {
          filename: `lexisScrape${new Date(Date.now())}.csv`,
          content: csv,
        };
  const mailer2 = {
    title: "list",
    from: "mickey",
    to: ["mickeygray85@hotmail.com","poakes@nattaxexperts.com","arios@nattaxexperts.com","mforde@nattaxexperts.com"],
    subject: `what if i emailed these people`,
    text: `with one toll free that goes straight to my desk at home and then i hot pipe em in and if they close hey im a better lead source than the shit you pay  500 dollars for. `,
    attachments:[attachment2]
  };

  transporter.sendMail(mailer2);

});
router.post("/lexis", async (req, res) => {
  const string = Object.keys(req.body).toString();

  let real1 = string.match(/(?<=\d+\.\s*).*?(?=\s*\d+\.)/gs);

  const lexs = []
  const amounts = []
  const addresses = []
  const lasts = []
for(var i = 0; i < real1.length; i++)
{
  
  let reg = /(?<=LexID\(sm\):\D*)\d+/gm
  let reg2 = /Amount:([\S]+)/gim;  
  let reg3 = /\d+/;


  const laster = real1[i].replace("            ","").trim().toLowerCase()

  lasts.push(laster.split(",")[0])
  lexs.push(real1[i].match(reg))
  amounts.push(real1[i].match(reg2).toString().replace('Amount:', '').replace('$', '').replace(',', ''))
  addresses.push(real1[i].match(reg3).filter(e=> typeof e == "string"));

}


var newArray = lexs.map(function(value, index) {
  return { lexs: value , mailKey: amounts[index] + addresses[index] + lasts[index]};
}).filter(e=> !e.mailKey.includes(' ')).filter(e=> e.lexs !== null)


const keys = await LexKey.insertMany(newArray);

res.json(keys)
console.log(newArray)

});


router.put("/:id", async (req, res) => {

  const matches = await Lead.find({mailKey:req.body.mailKey})


  //console.log(matches)
  const dupIds = matches.map(m => m.dupId) 

  const finalLeadArr = []
 dupIds.forEach(id =>{
    
    if(id != req.body.dupId){
      matches.filter(e=>e.dupId === id).map(e =>{

        const enriched = matches.filter(e=>e.dupId === req.body.dupId)[0]

       // console.log(e)

       //console.log(enriched)

        const { dob, age, ssn, phones, emailAddresses, otherliens, stateRelease, fedRelease } = enriched
         
        const { _id,fullName, firstName, lastName, address, city, state, zip, dupId, filingDate,amount,county,plaintiff, fileType,mailKey, loadDate,entityType, pinCode,} = e
        
        
        const obj = {
          _id: _id,
          phones: phones,
          emailAddresses: emailAddresses,
          fullName: fullName,
          firstName: firstName,
          lastName: lastName,
          address: address,
          city: city,
          state: state,
          zip: zip,
          dupId: dupId,
          filingDate: filingDate,
          amount: amount,
          county: county,
          plaintiff: plaintiff,
          fileType: fileType,
          mailKey: mailKey,
          loadDate: loadDate,
          entityType: entityType,
          pinCode: pinCode,
          otherliens: otherliens,
          phones:phones,
          emailAddresses:emailAddresses,
          dob:dob,
          dupId:dupId,
          age:age,
          ssn:ssn,
          stateRelease:stateRelease,
          fedRelease:fedRelease
        }

       return finalLeadArr.push(obj)
      
      })

    }
  })

  const newLead = finalLeadArr[0]

  console.log(newLead)

  const finalLead=   await Lead.findByIdAndUpdate(newLead._id, {
    "$set": {

          phones: newLead.phones,
          emailAddresses:  newLead.emailAddresses,
          fullName:  newLead.fullName,
          firstName:  newLead.firstName,
          lastName:  newLead.lastName,
          address:  newLead.address,
          city:  newLead.city,
          state:  newLead.state,
          zip:  newLead.zip,
          dupId:  newLead.dupId,
          filingDate:  newLead.filingDate,
          amount:  newLead.amount,
          county:  newLead.county,
          plaintiff:  newLead.plaintiff,
          fileType:  newLead.fileType,
          mailKey:  newLead.mailKey,
          loadDate:  newLead.loadDate,
          entityType:  newLead.entityType,
          pinCode:  newLead.pinCode,
          otherliens:  newLead.otherliens,
          phones:  newLead.phones,
          emailAddresses:  newLead.emailAddresses,
          dob: newLead.dob,
          dupId: newLead.dupId,
          age: newLead.age,
          ssn: newLead.ssn,
          stateRelease: newLead.stateRelease,
          fedRelease: newLead.fedRelease
    },
  }) 

  Lead.findOneAndRemove({"dupId":req.body.dupId }, 
    function (err, docs) { 
    if (err){ 
        console.log(err) 
    } 
    else{ 
        console.log("Removed Lead : ", docs); 
    } 
}); 
    console.log(finalLead)
    res.json(finalLead)

    
    })
    



module.exports = router;
