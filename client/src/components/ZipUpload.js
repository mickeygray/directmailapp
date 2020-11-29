import React,{useState, useContext} from 'react'
import MailContext from '../context/MailContext/mailContext'

const ZipUpload = () => {
 const [file, setFile] = useState("");

  const onUpload = (e) => {
     submitZips(e.target.files[0]);
  };

  const mailContext = useContext(MailContext)

  const {submitZips} = mailContext
 

    return (
        <div>
             <input type='file' onChange={onUpload} style={{ width: "200px" }} />
        </div>
    )
}

export default ZipUpload
