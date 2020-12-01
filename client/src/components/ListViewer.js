import React, { useState,useContext, useEffect } from "react";
import ListItem from "./ListItem";
import KeyModal from "./KeyModal";
import LeadContext from "../context/lead/leadContext";

const ListViewer = () => {
  const leadContext = useContext(LeadContext);

  const { leads, clearLeads, getLexs, keys, postLeads, getDups,sendTodays,getReleases } = leadContext;

  const [startDate, setStartDate] = useState('')  
  const [endDate, setEndDate] = useState('') 


  const onChange = e =>{
	 setStartDate(Intl.DateTimeFormat("fr-CA", 
                      { timeZone: "America/Los_Angeles" },{
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                }).format(new Date(e.target.value)).replace(/-/, '/').replace(/-/, '/'))
  } 

  const onChange2 = e =>{
	 setEndDate(Intl.DateTimeFormat("fr-CA", 
                      { timeZone: "America/Los_Angeles" },{
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                }).format(new Date(e.target.value)).replace(/-/, '/').replace(/-/, '/'))
  }	  

  const dates = {startDate, endDate}	


  return (
<div>
      <div className='text-center'>
    <button className="p-2 btn btn-sm btn-danger" onClick={()=>getDups()}> Get All Dups </button>  
       <button className="p-2 btn btn-sm btn-success" onClick={()=>sendTodays()}>Send Todays Scrapes</button>
    <button className="p-2 btn btn-sm btn-primary" onClick={()=>getReleases(dates)}>Get Range Releases</button>    
      <button className="btn btn-sm btn-dark" onClick={()=>getLexs(dates)}>Get Range Lexis Info</button>

        </div>

        
	  <div className='grid-2'>
           
	  <div>
      <form>
	    <h4 style={{paddingTop:'15px', marginBottom:'-15px'}} className='text-center'>Enter Start Date</h4>
           
                <input
              type='date'
              name='startDate'
              className='m-2'
              value={startDate}
              id='startDate'
              onChange={onChange}
            />
            </form> 
           </div>
	  <div>
    <form>
      <h4 style={{paddingTop:'15px', marginBottom:'-15px'}} className='text-center'>Enter End Date</h4>
	     <input
              type='date'
              name='endDate'
              className='m-2'
              value={endDate}
              id='endDate'
              onChange={onChange2}
            />
	  
    </form>
    </div>
	  </div>
	  

    {keys.length > 0 ? <KeyModal keys={keys}/> :''}	  
      <br/>
      <br/>
            
      {leads.length > 0 ? 
      
      <div className='grid-2'>
        <div> <button onClick={()=>clearLeads()} className='btn btn-dark btn-block'>Clear Leads</button></div>
        <div> <button onClick={()=>postLeads(leads)}className='btn btn-success btn-block'>Post Leads</button></div>

      
      </div>:''}
      <div className = 'grid-2'>

       <div>      {leads.length > 0 ?         leads.filter(function(item) {
           return item["dob"] === undefined;
        
          }).sort((a, b) => {
        let fa = a.mailKey.toLowerCase(),
        fb = b.mailKey.toLowerCase();

    if (fa < fb) {
        return -1;
    }
    if (fa > fb) {
        return 1;
    }
    return 0;
}).map((lead) => <ListItem key={lead.dupId} lead={lead} />)
        : ""}</div>
       <div>      
         {leads.length > 0 ?
         
         leads.filter(function(item) {
           return item["dob"] !== undefined;
        
          }).map((lead) => <ListItem key={lead.dupId} lead={lead} />)
        
        : ""}</div> 


        </div>
    </div>
  );
};

export default ListViewer;
