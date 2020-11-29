import React, {
  useContext,
  useEffect,
  Fragment,
  useCallback,
  useState,
} from "react";
import DirectMailLibrary from "./DirectMailLibrary";
import DirectMailSchedule from "./DirectMailSchedule";
import MailContext from "../context/MailContext/mailContext";

const Dunder = () => {
  const mailContext = useContext(MailContext);

  const {
    getDirectMailLibrary,
    getDirectMailSchedule,
    mailLibrary,
    mailSchedule,
    sendMail,
  } = mailContext;
  useEffect(() => {
    getDirectMailLibrary();
    getDirectMailSchedule();
  }, []);

  // <DirectMailSchedule mailSchedule={mailSchedule} />
  return (

      <div className='grid-2'>
        <div>
          <DirectMailLibrary mailLibrary={mailLibrary} />
        </div>

        <div>
        
          <DirectMailSchedule mailSchedule={mailSchedule} />
        </div>
      </div>

  );
};

export default Dunder;
