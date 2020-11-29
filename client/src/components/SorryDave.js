import React, {
  useContext,
  useEffect,
  Fragment,
  useCallback,
  useState,
} from "react";
import LexisUpload from "./LexisUpload"
import NewUpload from "./NewUpload"
import SuppressUpload from "./SuppressUpload"
import ZipUpload from "./ZipUpload"
import BulkUpload from "./BulkUpload"
import ListViewer from "./ListViewer"
import LeadContext from "../context/lead/leadContext";

const SorryDave = () => {
  const leadContext = useContext(LeadContext);




  return (

      <div>
        <div className='grid-5'>
            <div className="card all-center">
             <p>Upload Suppression Leads CSV</p>
                <SuppressUpload/>
            </div>
            <div className="card all-center">
             <p>Upload Daily File CSV </p>
                <NewUpload/>
            </div>
            <div className="card all-center">
             <p>Upload Zip Suppression JSON</p>
                <ZipUpload/>
            </div>
            <div className="card all-center">
             <p>Upload Lexis Individual Text Files </p>
                <LexisUpload/>
            </div>
            <div className="card all-center">
             <p>Upload Lexis Key Collection Text Files </p>
                <BulkUpload/>
            </div>

 
        </div>
              <div className='container'>

        <ListViewer/>
      </div>
      </div>

  );
};

export default SorryDave;
