import React, { useContext } from "react";
import LeadContext from "../context/lead/leadContext";

const ListItem = ({ lead }) => {
  const leadContext = useContext(LeadContext);

  const {deleteDup, putDup} = leadContext
  const {
    fullName,
    address,
    plaintiff,
    mailKey,
    ssn,
    dob,
    amount,
    fedRelease,
    stateRelease,
  } = lead;



  return (
    <div className='card bg-light'>
      {stateRelease ? <h4 className='text-danger'>{stateRelease}</h4> : ''}
      {fedRelease ? <h4 className='text-danger'>{fedRelease}</h4> : ''}
      <h5 className='text-danger text-left'>{fullName}</h5>{" "}
      <ul className='list grid-4' style={{ fontSize: ".8rem" }}>
         <li>
          Full Name:
          <br />
          {fullName}
        </li>
        <li>
          Address:
          <br />
          {address}
        </li>
        <li>
          Lien Amount:
          <br /> {amount}
        </li>
         <li>
          Plaintiff:
          <br /> {plaintiff}
        </li>
                 <li>
          Mail Key:
          <br /> {mailKey}
        </li>


        {ssn ? <li>
          SSN:
          <br /> {ssn}
        </li>: ''}

        {dob ? <li>
          DOB:
          <br /> {dob}
        </li>: ''}

      </ul>
{stateRelease || fedRelease ? 

           <button className='btn btn-danger btn-sm' onClick={() => deleteDup(lead)}>
     Delete Release
      </button> :

      <button className='btn btn-danger btn-sm' onClick={() => deleteDup(lead)}>
     Delete Dup
      </button>
      
      
      }
      {ssn || dob ? 
      <button className='btn btn-danger btn-sm' onClick={() => putDup(lead)}>
    Update Lead
      </button> : ''
      }
    </div>
  );
};

export default ListItem;
