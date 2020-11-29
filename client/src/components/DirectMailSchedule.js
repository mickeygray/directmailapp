import React, { useContext } from "react";
import MailContext from '../context/MailContext/mailContext'
import DirectMailEntry from "./DirectMailEntry";
import DirectMailEntryItem from "./DirectMailEntryItem";

const DirectMailSchedule = (props) => {
  const mailContext = useContext(MailContext);

  const { scheduleObj } = mailContext;

  const sched = Object.assign(
    {},
    ...Object.keys(scheduleObj).map((k) => ({
      [k]: scheduleObj[k].map((entry) => (
        <DirectMailEntryItem key={entry._id} entry={entry} />
      )),
    }))
  );

  console.log(
    Object.assign(
      {},
      ...Object.keys(scheduleObj)
      .map((k) => ({
        [k]: scheduleObj[k].map((entry) => entry),
      }))
    )
  );

  return (
    <div >
      <div>
        <DirectMailEntry />
      </div>

      <div>
        {Object.entries(sched)
          .sort((a, b) => (a > b ? 1 : -1))
          .map((sched) => (
            <div style={{ display: "flex" }}>{sched}</div>
          ))}
      </div>
    </div>
  );
};

export default DirectMailSchedule;
