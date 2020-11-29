import React, { Fragment, useContext } from "react";
import DirectMailCreator from "./DirectMailCreator";
import DirectMailItem from "./DirectMailItem";
import DMViewer from "./DMViewer";
import MailContext from '../context/MailContext/mailContext'
import Filter from "./Filter";

const DirectMailLibrary = (props) => {
  console.log(props);

  const mailContext = useContext(MailContext);

  const { letter,filtered } = mailContext;
  const { mailLibrary } = props;
  return (
    <Fragment>
      <div className='grid-2c'>
        <div>{letter === null ? <DirectMailCreator /> : <DMViewer />}</div>
        <div className='sidebar' style={{overflowY:'scroll', height:'100vh', width:'250px'}}>
        <Filter/>
          {filtered !== null
        ? filtered.map((mailItem) =>   <DirectMailItem key={mailItem._id} mailItem={mailItem} />)
        :    mailLibrary.map((mailItem) => (
              <DirectMailItem key={mailItem._id} mailItem={mailItem} />
            ))}
        </div>
      </div>
    </Fragment>
  );
};

export default DirectMailLibrary;
