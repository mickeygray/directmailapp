const express = require("express");
const router = express.Router();
var cron = require('node-cron');
const GridFsStorage = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const crypto = require("crypto");
const config = require("config");
const path = require("path");
const mongodb = require("mongodb");
const BSON = require("bson");
const keya = require("../config/key.json");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const db = config.get("mongoURI");
const Grid = require("gridfs-stream");
var smtpTransport = require('nodemailer-smtp-transport');
const Binary = require("mongodb").Binary;
const multer = require("multer");
const Zip = require("../models/Zip");
const Mail = require("../models/Mail");
const Lead = require("../models/Lead");
const Schedule = require("../models/Schedule");
const moment = require("moment");
const mergeWith = require("lodash.mergewith");
const { Parser } = require("json2csv");

const { Duplex } = require("stream");
const _ = require("lodash");


const { isArrayLikeObject, update } = require("lodash");
const zip = require("express-zip");
const nodemailer = require("nodemailer");
const storage = new GridFsStorage({
  url: db,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = req.body.title;
        const fileInfo = {
          filename: filename,
          bucketName: "fs",
        };
        resolve(fileInfo);
      });
    });
  },
});

const storage2 = new GridFsStorage({
  url: db,
  options: { useUnifiedTopology: true },
  file: (req, attachment) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }

     //  console.log(attachment);
        const filename = attachment.filename;
        const fileInfo = {
          filename: filename,
          bucketName: "fs",
        };
        resolve(fileInfo);

      ///  console.log(fileInfo);
      });
    });
  },
});
const upload2 = multer({ storage2 });

const upload = multer({ storage });


router.post('/zips', async (req,res)=>{
   try {
    const zips = await Zip.insertMany(req.body);

   // console.log(zips);

    res.json(zips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("servererr");
  }
})


router.post("/", upload.single("fs"), async (req, res) => {
 // console.log(req.body);
  const {
    title,
    mailHouse,
    vendor,
    type,
    colorPaper,
    colorInk,
    key,
    image,
    taxChart,
    lienType,
    lienAmount,
    zipCodeSuppress,
    zipCode,
    postageCeiling,
    unitCost,
    theme,
    tracking,
    startDate,
  } = req.body;

  const { id } = req.file;

  //console.log(req.file);
  const fileid = id;

  const newMail = new Mail({
    title,
    mailHouse,
    vendor,
    type,
    colorPaper,
    colorInk,
    image,
    taxChart,
    theme,
    key,
    lienType,
    fileid,
    lienAmount,
    zipCodeSuppress,
    zipCode,
    postageCeiling,
    unitCost,
    tracking,
    startDate,
  });

  const mail = await newMail.save();

  res.json(mail);
});



router.post("/delivery", async (req,res)=>{
   const schedule = await Schedule.find();
  var scheduleObj = schedule.reduce(function (r, o) {
    var k = parseInt(o.lookBack);
    if (r[k] || (r[k] = [])) r[k].push(o);
    return r;
  }, {});

  
  
  var filterDates = Object.keys(scheduleObj).map((v) =>
     Intl.DateTimeFormat(
      "fr-CA",
      {
        timeZone: "America/Los_Angeles",
      },
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    ).format(new Date(moment().subtract(parseInt(v), "day").format('LL')
  )));


 

   let leads = await Lead.find({
    "loadDate": { "$in": filterDates },
  }); 
 
 

  console.log(leads.length)
//console.log(listObj)
  const mailSchedule  = schedule.reduce(function (r, o) {
    var k = o.lookBack;
    tracking = o.tracking,
    lienAmount = o.lienAmount,
    zipCodeSuppress = o.zipCodeSuppress,
    zipCode = o.zipCode,
    lienType = o.lienType,
    vendor = o.vendor,
    postageCeiling = o.postageCeiling,
    unitCost = o.unitCost,
    title = o.title,
    mailHouse = o.mailHouse,  	  
    loadDate  = Intl.DateTimeFormat(
      "fr-CA",
      {
        timeZone: "America/Los_Angeles",
      },
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    ).format(new Date(moment().subtract(parseInt(k), "day").format('LL')))
   mailList = leads	  
    if (r[loadDate] || (r[loadDate] = []))
      r[loadDate].push(
         {
          tracking,
          lienAmount,
          title,
          zipCodeSuppress,
          postageCeiling,
          unitCost,
          zipCode,
          lienType,
          vendor,
          tracking,
          mailHouse,
  	  mailList,
          loadDate,		 
        }     
     );

    return Object.values(r);
  }, {});

const updatedDrop = []
async function withForOf() {

  for (const tollFree of mailSchedule) 
	{

      
    
    
     
    
      let updatedList = []
      const {
        lienType,
        tracking,
        mailList,
        lienAmount,
        vendor,
	zipCode,      
        postageCeiling,
        unitCost,
        mailHouse,
        date,
	title, 
	loadDate,      
        zipCodeSuppress,
      } = tollFree[0]
	
	const scheduleDate = tollFree[0]


    
 

  let zips = await Zip.find({
    "class": { "$in": zipCode },
  });
   
  zips = zips.map(zip => zip.zip4)
console.log(zips)
switch (zipCodeSuppress) {
  case "keepSelect":
    updatedList = mailList.filter((e) => zips.includes(e.zip.substring(0,5)))
    break;
  case "suppressSelect":
    updatedList = mailList.filter((e) => zips.includes(e.zip.substring(0,5)))
  break;  
}
console.log(updatedList.length)
if(updatedList.length > 0){
switch (lienAmount) {
  case "15000":
    updatedList = updatedList.filter((e) => parseFloat(e.amount) <= 15000);
    break;
  case "25000":
    updatedList = updatedList.filter(
      (e) => parseFloat(e.amount) >= 15000 && parseFloat(e.amount) <= 25000
    );
    break;
  case "50000":
  updatedList = updatedList.filter((e) => parseFloat(e.amount) >= 25000 && e.amount <= 50000);
    break;
  case "100000":
    updatedList = updatedList.filter(
      (e) => parseFloat(e.amount) >= 50000 && parseFloat(e.amount) <= 100000
    );
    break;
  case "10000000":
   updatedList = updatedList.filter((e) => parseFloat(e.amount) > 100000);
    break;
}} else {
  switch (lienAmount) {
  case "15000":
    updatedList = mailList.filter((e) => parseFloat(e.amount) <= 15000);
    break;
  case "25000":
    updatedList = mailList.filter(
      (e) => parseFloat(e.amount) >= 15000 && parseFloat(e.amount) <= 25000
    );
    break;
  case "50000":
 updatedList = mailList.filter((e) => parseFloat(e.amount) >= 25000 && parseFloat(e.amount) <= 50000);
    break;
  case "100000":
   updatedList = mailList.filter(
      (e) => parseFloat(e.amount) >= 50000 && parseFloat(e.amount) <= 100000
    );
    break;
  case "10000000":
updatedList = mailList.filter((e) => parseFloat(e.amount) > 100000);
    break;
}
} 
console.log(updatedList.length)

if(updatedList.length > 0){

switch (vendor) {
  case "ftls":
     updatedList = updatedList.filter((e) => e.pinCode.length === 7);
    break;
  case "risk":
     updatedList = updatedList.filter((e) => e.pinCode.length === 10);
    break;
  case "advance":
       updatedList = updatedList.filter((e) => e.pinCode.length === 12);
    break;
  case "atype":
       updatedList = updatedList.filter((e) => e.pinCode.length === 15);
    break;
}
} else {
  switch (vendor) {
  case "ftls":
    updatedList = mailList.filter((e) => e.pinCode.length === 7);
    break;
  case "risk":
  updatedList = mailList.filter((e) => e.pinCode.length === 10);
    break;
  case "advance":
 updatedList = mailList.filter((e) => e.pinCode.length === 12);
    break;
  case "atype":
   updatedList = mailList.filter((e) => e.pinCode.length === 15);
    break;
}
}
console.log(updatedList.length)

if(updatedList.length > 0){
switch (lienType) {
  case "state":
updatedList = updatedList.filter((e) => e.fileType == "State Tax Lien");
    break;
  case "federal":
 updatedList = updatedList.filter((e) => e.fileType == "Federal Tax Lien");
    break;
}
} else {
  switch (lienType) {
  case "state":
    updatedList = mailList.filter((e) => e.fileType == "State Tax Lien");
    break;
  case "federal":
    updatedList = mailList.filter((e) => e.fileType == "Federal Tax Lien");
    break;
}
}

updatedList = updatedList.filter((e) => e.loadDate.toString() ===  new Date(loadDate).toString())

console.log(updatedList.length)

   const combinedCost = unitCost + postageCeiling
   const  dropItem = {
        updatedList,
        tracking,
        vendor,
        postageCeiling,
        combinedCost,
        unitCost,
        mailHouse,
        date,
        title, 
     }       
    updatedDrop.push(dropItem)
  }
     const conn = mongoose.connection;
    const gfs = Grid(conn.db, mongoose.mongo);
    const json2csvParser = new Parser();

const slop = updatedDrop.filter(e => e.updatedList.length > 0)
//console.log(slop)
slop.forEach((drop) =>{

 
    const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            type: "OAuth2",
            user: "lienunit@nattaxgroup.com",
            serviceClient: keya.client_id,
            privateKey: keya.private_key,
          },
           tls:{
        rejectUnauthorized:false
    }    
  })
gfs.files.find({ filename: drop.title }).toArray(function (err, files) {
      var readableStream = gfs.createReadStream({ filename: drop.title });
      let bufferArray = [];
      readableStream.on("data", function (chunk) {
        bufferArray.push(chunk);
      });
    
      let buffer = [];
      let result = [];
      readableStream.on("end", function () {
        buffer = Buffer.concat(bufferArray);

        const attachment1 = {
          filename: `${drop.title}.pdf`,
          content: new Buffer(buffer, "application/pdf"),
        };
        
  const result = drop.updatedList.map(({fullName, fileType, filingDate, firstName, mailKey, lastName, state,zip, city, county, plaintiff, amount, address, age, dob, ssn, otherliens, phones, emailAddresses}) => {
  let obj = {
    Full_Name: fullName,
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
    ssn: ssn,
    Five_Amount : parseFloat(amount) * 0.05.toFixed(2),
    Nine_Amount : parseFloat(amount) * 0.95.toFixed(2)

  };

 phones.forEach((phone, i) => obj[`phone${i+1}`] = phone)
 emailAddresses.forEach((addr, i) => obj[`emailAddress${i+1}`] = addr)
 otherliens.filter((e)=> e.plaintiff && e.plaintiff.includes("Internal Revenue") || e.plaintiff && e.plaintiff.includes("State of") || e.plaintiff && e.plaintiff.includes("IRS")).forEach(({plaintiff, amount}, i) => {
    obj[`plaintiff${i+1}`] = plaintiff;
    obj[`amount${i+1}`] = amount;
  });

  return obj;
})

//console.log(result)


     const csv =  json2csvParser.parse(result) 

        const tracker = drop.title;
        const dt = drop.date;

        const attachment2 = {
          filename: `${tracker}__ ${dt}.csv`,
          content: csv,
        };

     const mailer = {
          title: "Daily Mail Drop",
          from: "NTE",
          to: ["mickeygray85@hotmail.com"],
          subject: ` ${tracker} Daily Mail Drop `,
          attachments: [attachment1, attachment2],
          text: `Attached is the pdf and csv for the Direct Mail Campaign ${drop.title}. Thanks, NTE!`,
        };

  transporter.sendMail(mailer);  
}) 
})

}) 

}

withForOf();
})
cron.schedule('0,30 * * * *', async () => {
  const schedule = await Schedule.find();
  var scheduleObj = schedule.reduce(function (r, o) {
    var k = parseInt(o.lookBack);
    if (r[k] || (r[k] = [])) r[k].push(o);
    return r;
  }, {});

  
  
  var filterDates = Object.keys(scheduleObj).map((v) =>
     Intl.DateTimeFormat(
      "fr-CA",
      {
        timeZone: "America/Los_Angeles",
      },
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    ).format(new Date(moment().subtract(parseInt(v), "day").format('LL')
  )));


 

   let leads = await Lead.find({
    "loadDate": { "$in": filterDates },
  }); 
 
 

  console.log(leads.length)
//console.log(listObj)
  const mailSchedule  = schedule.reduce(function (r, o) {
    var k = o.lookBack;
    tracking = o.tracking,
    lienAmount = o.lienAmount,
    zipCodeSuppress = o.zipCodeSuppress,
    zipCode = o.zipCode,
    lienType = o.lienType,
    vendor = o.vendor,
    postageCeiling = o.postageCeiling,
    unitCost = o.unitCost,
    title = o.title,
    mailHouse = o.mailHouse,  	  
    loadDate  = Intl.DateTimeFormat(
      "fr-CA",
      {
        timeZone: "America/Los_Angeles",
      },
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    ).format(new Date(moment().subtract(parseInt(k), "day").format('LL')))
   mailList = leads	  
    if (r[loadDate] || (r[loadDate] = []))
      r[loadDate].push(
         {
          tracking,
          lienAmount,
          title,
          zipCodeSuppress,
          postageCeiling,
          unitCost,
          zipCode,
          lienType,
          vendor,
          tracking,
          mailHouse,
  	  mailList,
          loadDate,		 
        }     
     );

    return Object.values(r);
  }, {});

const updatedDrop = []
async function withForOf() {

  for (const tollFree of mailSchedule) 
	{

      
    
    
     
    
      let updatedList = []
      const {
        lienType,
        tracking,
        mailList,
        lienAmount,
        vendor,
	zipCode,      
        postageCeiling,
        unitCost,
        mailHouse,
        date,
	title, 
	loadDate,      
        zipCodeSuppress,
      } = tollFree[0]
	
	const scheduleDate = tollFree[0]


    
 

  let zips = await Zip.find({
    "class": { "$in": zipCode },
  });
   
  zips = zips.map(zip => zip.zip4)
console.log(zips)
switch (zipCodeSuppress) {
  case "keepSelect":
    updatedList = mailList.filter((e) => zips.includes(e.zip.substring(0,5)))
    break;
  case "suppressSelect":
    updatedList = mailList.filter((e) => zips.includes(e.zip.substring(0,5)))
  break;  
}
console.log(updatedList.length)
if(updatedList.length > 0){
switch (lienAmount) {
  case "15000":
    updatedList = updatedList.filter((e) => parseFloat(e.amount) <= 15000);
    break;
  case "25000":
    updatedList = updatedList.filter(
      (e) => parseFloat(e.amount) >= 15000 && parseFloat(e.amount) <= 25000
    );
    break;
  case "50000":
  updatedList = updatedList.filter((e) => parseFloat(e.amount) >= 25000 && e.amount <= 50000);
    break;
  case "100000":
    updatedList = updatedList.filter(
      (e) => parseFloat(e.amount) >= 50000 && parseFloat(e.amount) <= 100000
    );
    break;
  case "10000000":
   updatedList = updatedList.filter((e) => parseFloat(e.amount) > 100000);
    break;
}} else {
  switch (lienAmount) {
  case "15000":
    updatedList = mailList.filter((e) => parseFloat(e.amount) <= 15000);
    break;
  case "25000":
    updatedList = mailList.filter(
      (e) => parseFloat(e.amount) >= 15000 && parseFloat(e.amount) <= 25000
    );
    break;
  case "50000":
 updatedList = mailList.filter((e) => parseFloat(e.amount) >= 25000 && parseFloat(e.amount) <= 50000);
    break;
  case "100000":
   updatedList = mailList.filter(
      (e) => parseFloat(e.amount) >= 50000 && parseFloat(e.amount) <= 100000
    );
    break;
  case "10000000":
updatedList = mailList.filter((e) => parseFloat(e.amount) > 100000);
    break;
}
} 
console.log(updatedList.length)

if(updatedList.length > 0){

switch (vendor) {
  case "ftls":
     updatedList = updatedList.filter((e) => e.pinCode.length === 7);
    break;
  case "risk":
     updatedList = updatedList.filter((e) => e.pinCode.length === 10);
    break;
  case "advance":
       updatedList = updatedList.filter((e) => e.pinCode.length === 12);
    break;
  case "atype":
       updatedList = updatedList.filter((e) => e.pinCode.length === 15);
    break;
}
} else {
  switch (vendor) {
  case "ftls":
    updatedList = mailList.filter((e) => e.pinCode.length === 7);
    break;
  case "risk":
  updatedList = mailList.filter((e) => e.pinCode.length === 10);
    break;
  case "advance":
 updatedList = mailList.filter((e) => e.pinCode.length === 12);
    break;
  case "atype":
   updatedList = mailList.filter((e) => e.pinCode.length === 15);
    break;
}
}
console.log(updatedList.length)

if(updatedList.length > 0){
switch (lienType) {
  case "state":
updatedList = updatedList.filter((e) => e.fileType == "State Tax Lien");
    break;
  case "federal":
 updatedList = updatedList.filter((e) => e.fileType == "Federal Tax Lien");
    break;
}
} else {
  switch (lienType) {
  case "state":
    updatedList = mailList.filter((e) => e.fileType == "State Tax Lien");
    break;
  case "federal":
    updatedList = mailList.filter((e) => e.fileType == "Federal Tax Lien");
    break;
}
}

updatedList = updatedList.filter((e) => e.loadDate.toString() ===  new Date(loadDate).toString())

console.log(updatedList.length)

   const combinedCost = unitCost + postageCeiling
   const  dropItem = {
        updatedList,
        tracking,
        vendor,
        postageCeiling,
        combinedCost,
        unitCost,
        mailHouse,
        date,
        title, 
     }       
    updatedDrop.push(dropItem)
  }
     const conn = mongoose.connection;
    const gfs = Grid(conn.db, mongoose.mongo);
    const json2csvParser = new Parser();

///const slop = updatedDrop.filter(e => e.updatedList.length > 0)
//console.log(slop)
updatedDrop.forEach((drop) =>{

 
    const transporter = nodemailer.createTransport({
       
        service: 'gmail',
     auth: {
    user: 'blackballedproductions@gmail.com',
    pass: 'Pay@ttention35!' // naturally, replace both with your real credentials or an application-specific password
  }
      
      /*   host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            type: "OAuth2",
            user: "lienunit@nattaxgroup.com",
            serviceClient: keya.client_id,
            privateKey: keya.private_key,
          },
           tls:{
        rejectUnauthorized:false
    }    */
  })
gfs.files.find({ filename: drop.title }).toArray(function (err, files) {
      var readableStream = gfs.createReadStream({ filename: drop.title });
      let bufferArray = [];
      readableStream.on("data", function (chunk) {
        bufferArray.push(chunk);
      });
    
      let buffer = [];
      let result = [];
      readableStream.on("end", function () {
        buffer = Buffer.concat(bufferArray);

        const attachment1 = {
          filename: `${drop.title}.pdf`,
          content: new Buffer(buffer, "application/pdf"),
        };
        
  const result = drop.updatedList.map(({fullName, fileType, filingDate, firstName, mailKey, lastName, state,zip, city, county, plaintiff, amount, address, age, dob, ssn, otherliens, phones, emailAddresses}) => {
  let obj = {
    Full_Name: fullName,
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
    ssn: ssn,
    Five_Amount : parseFloat(amount) * 0.05.toFixed(2),
    Nine_Amount : parseFloat(amount) * 0.95.toFixed(2)

  };

 phones.forEach((phone, i) => obj[`phone${i+1}`] = phone)
 emailAddresses.forEach((addr, i) => obj[`emailAddress${i+1}`] = addr)
 otherliens.filter((e)=> e.plaintiff && e.plaintiff.includes("Internal Revenue") || e.plaintiff && e.plaintiff.includes("State of") || e.plaintiff && e.plaintiff.includes("IRS")).forEach(({plaintiff, amount}, i) => {
    obj[`plaintiff${i+1}`] = plaintiff;
    obj[`amount${i+1}`] = amount;
  });

  return obj;
})

//console.log(result)

/*
     const csv =  json2csvParser.parse(result) 

        const tracker = drop.title;
        const dt = drop.date;

        const attachment2 = {
          filename: `${tracker}__ ${Sdt}.csv`,
          content: csv,
        };
*/
     const mailer = {
          title: "Sorry Not Sorry",
          from: "NTE",
          to: ["poakes@nattaxexperts.com","mforde@nattaxexperts.com"],
          subject: ` Nope sorry we need to wait another year`,
         // attachments: [attachment1, attachment2],
          text: `Im tired of trying to reach you by using my hands.  so im just going to email you automatically from here until you get over your preciousness and let me fucking help. good fucking christ.`,
        };

  transporter.sendMail(mailer);  
}) 
})

}) 

}

withForOf();


});



router.delete("/schedule/:id", async (req, res) => {
  try {
    let sched = await Schedule.findById(req.params.id);

    if (!sched) return res.status(404).json({ msg: "Contact not found" });

    await Schedule.findByIdAndRemove(req.params.id);

    res.json({ msg: "Campaign removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
      const conn = mongoose.connection;
  const gfs = Grid(conn.db, mongoose.mongo);

    const mail = await Mail.find({_id: req.params.id})
     
    const piece = mail[0]
    console.log(mail)

    if(piece){
    gfs.remove({_id:piece.fileid}, function (err) {})
    }
    await Mail.findByIdAndRemove(req.params.id);
    res.json({ msg: "Campaign removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/", async (req, res) => {
  const mail = await Mail.find();

  res.json(mail);
});


router.get("/mailItem", async (req, res) => {
  const conn = mongoose.connection;
  const gfs = Grid(conn.db, mongoose.mongo);

  console.log(req.query.q)
  gfs.files.find({ filename: req.query.q }).toArray(function (err, files) {
    if (err) {
      res.json(err);
    }

    if (files.length > 0) {
      var mime = files[0].contentType;
      var filename = files[0].filename;
      res.set("Content-Type", mime);
      res.set("Content-Disposition", "inline; filename=" + filename);
      var read_stream = gfs.createReadStream({ filename: filename });
      read_stream.pipe(res);
    } else {
      res.json("File Not Found");
    }
  });
  
});
router.get("/schedule", async (req, res) => {
  const schedule = await Schedule.find();
 // console.log(schedule.length);
  res.json(schedule);
});

router.post("/schedule", async (req, res) => {
 // console.log(req.body.entry.length, "1");

  let dropDay;
  if (req.body.unit.unitType === "weeks") {
    dropDay = new Date(moment().subtract(req.body.unit.amount, "weeks"));
  } else {
    dropDay = moment().subtract(req.body.unit.amount, "days");
  }
  const now = moment(new Date()); //todays date
  const duration = moment.duration(now.diff(dropDay));
  const lookBack = duration.asDays();
  const scheduleDate = req.body.unit.amount + " " + req.body.unit.unitType;

  let schedules = [];

  req.body.entry.forEach(function (element) {
    element.lookBack = lookBack;
    element.scheduleDate = scheduleDate;
    schedules.push(element);
  });
 // console.log(req.body.entry.length, "1");

 // console.log(schedules.length, "1");
  const schedule = await Schedule.insertMany(schedules);

  res.json(schedule);

 // console.log(schedule.length);
});

router.put("/costs", async (req, res) => {
 // console.log(req.body);

  let tot;

  const payobj = {
    costs: parseFloat(req.body.total),
    date: new Date(Date.now()),
  };

 // console.log(payobj);

  const mailer = await Mail.findOneAndUpdate(
    { "title": req.body.mailer },
    {
      "$push": {
        "costs": payobj,
      },
    }
  );

  res.json(mailer);
  ///console.log(mailer);
});



module.exports = router;
