import React,{useContext} from "react";
import LeadContext from "../context/lead/leadContext.js"
import KeyItem from "./KeyItem"
const KeyModal = (props) =>{ 
     const {keys} = props
   const leadContext = useContext(LeadContext)
   const {setKeys}= leadContext	
console.log(keys)
       return(
    <div className='bg-light container card'>      
   <button onClick={()=>setKeys([])}>X</button>
    <div style={{ overflowY:'scroll', height:'66vh' }}>
      
           
	       { keys.map((k) => (
              <KeyItem  k={k} />
            ))}  
        
        
    </div>
  </div>
)
}
;
export default KeyModal;

