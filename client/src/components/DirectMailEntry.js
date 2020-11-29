import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  Fragment,
} from "react";
import Moment from "react-moment";
import MailContext from '../context/MailContext/mailContext'
import DirectMailEntryItem from "./DirectMailEntryItem";

const DirectMailEntry = () => {
  const [entry, setEntry] = useState([]);

  const mailContext = useContext(MailContext);

  const { mailItem, createDirectMailSchedule, sendMail } = mailContext;

  const mailId = mailItem._id;

  const entryItem = {
    mailId,
    title: mailItem.title,
    mailHouse: mailItem.mailHouse,
    vendor: mailItem.vendor,
    type: mailItem.type,
    colorPaper: mailItem.colorPaper,
    colorInk: mailItem.colorInk,
    image: mailItem.image,
    taxChart: mailItem.taxChart,
    lienType: mailItem.lienType,
    key: mailItem.key,
    lienAmount: mailItem.lienAmount,
    fileid: mailItem.fileid,
    zipCodeSuppress: mailItem.zipCodeSuppress,
    zipCode: mailItem.zipCode,
    postageCeiling: mailItem.postageCeiling,
    unitCost: mailItem.unitCost,
    tracking: mailItem.tracking,
    startDate: mailItem.startDate,
  };

  const onClick2 = (e) => {
    setEntry([...entry, entryItem]);
  };

  const removeItem = useCallback(() => {
    setEntry(
      entry.splice(
        entry.findIndex((p) => p.key == entry.key),
        1
      )
    );
  }, []);

  console.log(entry);

  const [unit, setUnit] = useState({
    amount: 0,
    unitType: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    createDirectMailSchedule(entry, unit);
  };

  /*
    <div>
      <h3 className='all-center'>
      <button className='btn btn-dark btn block' onClick={()=>sendMail()}>Click Here To Manually Send Daily CSVs To Mail House</button>
      </h3>
      </div>
  */

  return (
    <Fragment>


        <div className='grid-2'>
          <div>          <button className='btn btn-block btn-dark' onClick={onClick2}>
          Add Items To Entry
          </button></div>
          <div><button className='btn btn-block btn-dark' onClick={() => createDirectMailSchedule(entry, unit)}>
        Add Entry To Schedule</button></div>
        </div>
           <div className='grid-2'>
        <div>
          <input
               style={{ marginTop: "7px" }}
            type='text'
            placeholder={"Enter A Number"}
            name='amount'
            onChange={(e) =>
              setUnit({ ...unit, [e.target.name]: e.target.value })
            }
          />{" "}
        </div>
        <div>
          <select
            style={{ marginTop: "7px" }}
            name='unitType'
            id=''
            onChange={(e) =>
              setUnit({ ...unit, [e.target.name]: e.target.value })
            }>
            <option value=''>Select An Interval....</option>
            <option value='days'>Days</option>{" "}
            <option value='weeks'>Weeks</option>
          </select>
        </div>
      </div>
      <div style={{display:'flex'}}>
        {entry.map((entry) => (
          <DirectMailEntryItem
            removeItem={removeItem}
            key={entry.key}
            entry={entry}
          />
        ))}{" "}
      </div>

    </Fragment>
  );
};

export default DirectMailEntry;
