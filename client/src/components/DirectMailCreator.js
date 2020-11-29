import React, { useContext, useEffect, useState } from "react";
import MailContext from '../context/MailContext/mailContext'
import { v4 as uuidv4 } from "uuid";
const DirectMailCreator = () => {
  const mailContext = useContext(MailContext);

  const { createDirectMailItem } = mailContext;
  useEffect(() => {
    setLetter({
      title: "",
      mailHouse: "",
      vendor: "",
      type: "",
      colorPaper: "",
      colorInk: "",
      image: "",
      key: uuidv4(),
      taxChart: "",
      lienType: "",
      lienAmount: "",
      zipCodeSuppress: "",
      postageCeiling: "",
      unitCost: "",
      theme: "",
      tracking: "",

    });
  }, []);

  const [letter, setLetter] = useState({
    title: "",
    mailHouse: "",
    vendor: "",
    type: "",
    colorPaper: "",
    colorInk: "",
    image: "",
    taxChart: "",
    lienType: "",
    lienAmount: "",
    zipCodeSuppress: "",
    key: "",
    postageCeiling: "",
    unitCost: "",
    tracking: "",
    theme: "",
  
  });

  
  const [startDate, setStartDate] = useState(new Date(Date.now()))  

  const {
    title,
    mailHouse,
    vendor,
    type,
    colorPaper,
    colorInk,
    image,
    taxChart,
    key,
    lienType,
    lienAmount,
    zipCodeSuppress,
    postageCeiling,
    unitCost,
    tracking,
  } = letter;


  const [zipCode, setZipCode] = useState([]);
  const [file, setFile] = useState("");
  const onChange = (e) => {

    setLetter({
      ...letter,
      [e.target.name]: e.target.value,
    });
  }
  ;



  const onChange2 = (e) => {
    function filterByCount(array, count) {
      return array.filter(function (value) {
        return (
          array.filter(function (v) {
            return v === value;
          }).length === count
        );
      });
    }

    setZipCode(filterByCount([...zipCode, e.target.value], 1));
  };



  const onChange3 = (e) => {
    setFile(e.target.files[0]);
  };

   const onChange4 = e => {     setStartDate(Intl.DateTimeFormat("fr-CA", 
                      { timeZone: "America/Los_Angeles" },{
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                }).format(new Date(e.target.value.replace(/-/, '/').replace(/-/, '/'))),
    );
}
  const clearAll = () => {
    setLetter({
      title: "",
      mailHouse: "",
      vendor: "",
      type: "",
      colorPaper: "",
      colorInk: "",
      image: "",
      taxChart: "",
      lienType: "",
      lienAmount: "",
      zipCodeSuppress: "",
      theme: "",
      postageCeiling: "",
      unitCost: "",
      tracking: "",

    });

    setStartDate('');
    setFile("");
    setZipCode([]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", letter.title);
    formData.append("fs", file);
    formData.append("mailHouse", letter.mailHouse);
    formData.append("vendor", letter.vendor);
    formData.append("type", letter.type);
    formData.append("key", letter.key);
    formData.append("colorPaper", letter.colorPaper);
    formData.append("colorInk", letter.colorInk);
    formData.append("image", letter.image);
    formData.append("taxChart", letter.taxChart);
    formData.append("lienType", letter.lienType);
    formData.append("lienAmount", letter.lienAmount);
    formData.append("zipCodeSuppress", letter.zipCodeSuppress);
    formData.append("zipCode", zipCode);
    formData.append("postageCeiling", letter.postageCeiling);
    formData.append("unitCost", letter.unitCost);
    formData.append("tracking", letter.tracking);

    formData.append("startDate", startDate);
    createDirectMailItem(formData);
    clearAll();
  };

  return (
    <div className='card'>
      <form action='post' onSubmit={onSubmit}>
  
          <div>
            <label htmlFor='title'>Piece Title</label>
            <input
              placeholder='Title'
              type='text'
              name='title'
              onChange={onChange}
            />
            <label htmlFor='title'>Mail House</label>
            <select onChange={onChange} name='mailHouse' id='mailHouse'>
              <option value=''></option>
              <option value='adv'>Advantage</option>
              <option value='csp'>CSP</option>
              <option value='wb'>Wizbang!</option>
            </select>

     
            <label htmlFor='title'>Lien Type</label>
            <select onChange={onChange} name='lienType' id='lienType'>
              <option value=''></option>
              <option value='state'>State Tax Lien Only</option>
              <option value='federal'>Federal Tax Lien Only</option>
              <option value='both'>Both State and Federal Tax Liens</option>
              <option value='any'>Any Available Mailing Address</option>
            </select>
            <label htmlFor='title'>Lien Amount</label>
            <select onChange={onChange} name='lienAmount' id='lienAmount'>
              <option value=''></option>
              <option value='any'>All Lien Amounts</option>
              <option value='15000'>$5,000-$15,000</option>
              <option value='25000'>$15,000-$25,000</option>
              <option value='50000'>$25,000-$50,000</option>
              <option value='100000'>$50,000-$100,000</option>
              <option value='10000000'>$100,000 plus</option>
            </select>

            <label htmlFor='tracking'>Toll Free Number</label>
            <input type='text' name='tracking' onChange={onChange} />
            <label htmlFor='startDate'>Start Date</label>
            <input
              type='date'
              name='startDate'
              value={
                letter.startDate &&
                Intl.DateTimeFormat("fr-CA", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                }).format(new Date(letter.startDate))
              }
              id='startDate'
              onChange={onChange4}
            />
            <div className='grid-2'>
              <div>            <label htmlFor='title'>Postage Ceiling</label>
            <select
              onChange={onChange}
              name='postageCeiling'
              id='postageCeiling'>
              <option value=''></option>
              <option value='.439'>42.9 Cents</option>

              <option value='.276'>27.6 Cents</option>
            </select></div>
              <div>        <label htmlFor='title'>Unit Cost</label>
            <input
              type='text'
              name='unitCost'
              id='unitCost'
              onChange={onChange}
            /></div>
            </div>
            <div className='text-center'>
            <label htmlFor='file'>Attach PDF Proof</label>
            <br/>
            <input type='file' name='fs' id='fs' onChange={onChange3} />
            </div>
            <input
              type='submit'
              value='Create Direct Mail Campaign'
              className='btn-dark btn-block btn m-1 all-center'
     
            />
          </div>
        
        <div>
          <label htmlFor='title'>Zip Code Suppression Type</label>
          <select
            onChange={onChange}
            name='zipCodeSuppress'
            id='zipCodeSuppress'>
            <option value=''></option>
            <option value='all'>All Zip Codes</option>
            <option value='suppressSelect'>Remove Selected Areas</option>
            <option value='keepSelect'>Keep Only Selected Areas</option>
          </select>
          <label htmlFor='title'>Zip Code Suppression Area</label>
          <select name='zipCode' id='zipCode' onChange={onChange2} multiple>
            <option value='highDensity0x'>
              High Density 0x - CT, MA, ME, NH, NJ, PR, RI, VT
            </option>
            <option value='lowDensity0x'>
              Low Density 0x - CT, MA, ME, NH, NJ, PR, RI, VT
            </option>
            <option value='highDensity1x'>High Density 1x - DE, NY, PA</option>
            <option value='lowDensity1x'>Low Density 1x - DE, NY, PA</option>
            <option value='highDensity2x'>
              High Density 2x - DC, MD, NC, SC, VA, WV
            </option>
            <option value='lowDensity2x'>
              Low Density 2x - DC, MD, NC, SC, VA, WV
            </option>
            <option value='highDensity3x'>
              High Density 3x - AL, FL, GA, MS, TN
            </option>
            <option value='lowDensity3x'>
              Low Density 3x - AL, FL, GA, MS, TN
            </option>
            <option value='highDensity4x'>
              High Density 4x - IN, KY, MI, OH
            </option>
            <option value='lowDensity4x'>
              Low Density 4x - IN, KY, MI, OH
            </option>
            <option value='highDensity5x'>
              High Density 5x - IA, MN, MT, ND, SD, WI
            </option>
            <option value='lowDensity5x'>
              Low Density 5x - IA, MN, MT, ND, SD, WI
            </option>
            <option value='highDensity6x'>
              High Density 6x - IL, KS, MS, NE
            </option>
            <option value='lowDensity6x'>
              Low Density 6x - IL, KS, MS, NE
            </option>
            <option value='highDensity7x'>
              High Density 7x - AR, LA, OK, TX
            </option>
            <option value='lowDensity7x'>Low Density 7x - AR,LA,OK,TX</option>
            <option value='highDensity8x'>
              High Density 8x - AZ, CO ,ID, NM, NV, UT, WY
            </option>
            <option value='lowDensity8x'>
              Low Density 8x - AZ, CO ,ID, NM, NV, UT, WY
            </option>
            <option value='highDensity9x'>
              High Density 9x - AK, CA, HI, OR, WA{" "}
            </option>
            <option value='lowDensity9x'>
              Low Density 9x - AK, CA, HI, OR, WA Wyoming
            </option>
          </select>
          <div>
            Currently Selected Areas:{" "}
            <b>
              {" "}
              {zipCode.map(
                (zipCode) =>
                  zipCode
                    .replace(/([A-Z])/g, (match) => ` ${match}`)
                    .replace(/^./, (match) => match.toUpperCase())
                    .replace(/([0-9])/, (match) => ` ${match}`) + ", "
              )}
            </b>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DirectMailCreator;
