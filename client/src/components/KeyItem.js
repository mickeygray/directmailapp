import React, {useState,useContext } from "react";


const KeyItem = ({k}) => {

  


  const [keyStyle, setKeyStyle] = useState({
  backgroundColor:'yellow',
  })	

 console.log(k.mailKey)
  return (
    <div style={keyStyle}>
     <ul>
     <li>
      MailKey:{k.mailKey}
     </li>
     <li>
     Lexis Info:<a onClick={() => {navigator.clipboard.writeText(k.lexisInfo)}}>{k.lexisInfo}</a>	  
     </li>
     <li>
     Full Name:{k.fullName}	  
     </li>	  
     <li>
     Address:{k.address}
     </li>
     </ul>	  
     
     <div>
         <button className='btn btn-sm btn-dark p-2' onClick={()=>setKeyStyle({backgroundColor:'green'})}>Match Found</button>
         <button className='btn btn-sm btn-success p-2' onClick={()=>setKeyStyle({backgroundColor:'red'})}>No Match Found</button>		  
     </div>
     </div>
     
  );
};

export default KeyItem;

