import React from 'react'
import CsvViewer from "react-csv-viewer";
const CsvViewModal = (props) => {
    return (
        <div>
                     <button style={{flex:'right'}} onClick={props.toggleModal}>X</button>
            <CsvViewer/>
        </div>
    )
}

export default CsvViewModal
