import React, { useState, useContext, useEffect } from "react";
import { pdfjs } from "react-pdf";

import MailContext from "../context/MailContext/mailContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const PDFViewer = () => {
  const mailContext = useContext(MailContext);

  const { letter, entry, setLetter } = mailContext;
  const [file, setFile] = useState(null);
  useEffect(() => {
    if (letter != null) {
      console.log(letter);
      setFile(
        URL.createObjectURL(new Blob([letter], { type: "application/pdf" }))
      );
    }
  }, [letter]);

    useEffect(() => {
    if (entry != null) {
      console.log(letter);
      setFile(
        URL.createObjectURL(new Blob([entry], { type: "application/pdf" }))
      );
    }
  }, [letter]);

  return (
    <div>
      {letter ? (
        <div>
          {" "}
          <button
            className='btn-dark btn-sm btn'
            onClick={() => setLetter(null)}>
            Clear Letter
          </button>
          <iframe
            style={{ width: "563px", height: "666px" }}
            src={file}
            type='application/pdf'
            title='title'
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default PDFViewer;
