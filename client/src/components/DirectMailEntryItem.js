import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  Fragment,
} from "react";
import MailContext from '../context/MailContext/mailContext'

const DirectMailEntryItem = (props) => {
  const mailContext = useContext(MailContext);

  const { entry,removeItem } = props;

  console.log(entry)

  const { viewMailItem, setDirectMailItem,deleteScheduleItem } = mailContext;


  
  const onClick = (e) => {
    viewMailItem(entry.title);
  };

  const onClick2 = e =>{
      if(entry._id){
    deleteScheduleItem(entry._id)
      }else{
    removeItem()
      }


  }

  return (
    <a
      onClick={onClick}
      className='bg-primary all-center m-1'
      style={{ height: "175px", width: "175px", display: "block" }}>
      <button style={{float:'right'}} onClick={onClick2}>X</button>
      <br/>
      {entry.title} <br />
      {entry.tracking} <br />
      {
        Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }).format(new Date(entry.startDate))}{" "}
      <br />
    </a>
  );
};

export default DirectMailEntryItem;
