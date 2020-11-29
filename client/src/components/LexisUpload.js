import React,{useState, useContext} from 'react'
import LeadContext from "../context/lead/leadContext"
const LexisUpload = () => {
    
  
  const leadContext = useContext(LeadContext)

  const {uploadScrapes} = leadContext
  const [files, setFiles] = useState([]);

function readmultifiles (e) {
  const files = e.target.files;
  Object.keys(files).forEach(i => {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = (e) => {
       uploadScrapes(reader.result)
    }
    reader.readAsBinaryString(file);
  })
};

  


    
    return (
        <div>
            <input type='file' onChange={readmultifiles} style={{ width: "200px" }} multiple/>
       
        </div>
    )
}

export default LexisUpload
