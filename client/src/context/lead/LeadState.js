import React, { useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import LeadContext from "./leadContext";
import leadReducer from "./leadReducer";
import axios from "axios"
import {
UPLOAD_FILES,
SEND_TODAYS,
UPLOAD_DAILY,
UPLOAD_SUPPRESS,
DELETE_DUPS,
CLEAR_LEADS,
UPLOAD_SCRAPES,
POST_LEADS, 
GET_DUPS,
SET_LEADS,
GET_LEXS,
SET_KEYS,
GET_RELEASES	
} from "../types";

const LeadState = (props) => {
  const initialState = {
   leads: [],
   keys: []	  
}

  const [state, dispatch] = useReducer(leadReducer, initialState);

const uploadFiles = async (files) => {

     const res = await axios.post(`/api/leads/lexis`, files);

    dispatch({
      type: UPLOAD_FILES,
      payload: res.data,
    });
  };

const uploadScrapes = async (files) => {

     const res = await axios.put(`/api/leads`, files);

    dispatch({
      type: UPLOAD_SCRAPES,
      payload: res.data,
    });
  };  




 const uploadSuppress = async (data) => {

     const res = await axios.post(`/api/leads/`, data);

    dispatch({
      type: UPLOAD_SUPPRESS,
      payload: res.data,
    });

    setLeads(res.data)
  };  


  const clearLeads = () => {
    dispatch({ type: CLEAR_LEADS });
  };

  const setLeads = (leads) => {
    dispatch({ type: SET_LEADS, payload: leads });
  };
  const deleteDup = async (lead) => {

    console.log(lead.dupId)

  
    try {
      await axios.delete(`/api/leads?q=${lead.dupId}`);

      dispatch({
        type: DELETE_DUPS,
        payload: lead.dupId,
      });
    } catch (err) {
      console.log(err);
    }

    
  }; 

const uploadDaily = async (data) => {

     const res = await axios.post(`/api/leads/new`, data);

    dispatch({
      type: UPLOAD_DAILY,
      payload: res.data,
    });
    setLeads(res.data)
    
  };


  const postLeads = async (leads) => {

     const res = await axios.post(`/api/leads/dup`, leads);

    dispatch({
      type: POST_LEADS,
      payload: res.data,
    });
  };

 const putDup = async (lead) => {

    const dupObj = {
      mailKey: lead.mailKey,
      dupId:lead.dupId
    }

     const res = await axios.put(`/api/leads/${lead._id}`, dupObj);

    dispatch({
      type: POST_LEADS,
      payload: res.data,
    });
  };

 const sendTodays = async () =>{
   const res = await axios.get(`/api/leads`)
   dispatch({
     type: SEND_TODAYS,
     payload:res.data
   })
 } 

  const getDups = async () =>{
   const res = await axios.get(`/api/leads/dups`)
   dispatch({
     type: GET_DUPS,
     payload:res.data
   })
       setLeads(res.data)
 } 

  const getLexs = async (dates) =>{

   	  
   const res = await axios.get(`/api/leads/lexs?q=${JSON.stringify(dates)}`)
   

  dispatch({
    type:GET_LEXS,
    payload:res.data	   
   })
     
   setKeys(res.data)	  
  }

   const setKeys = (keys) =>{


   dispatch({
    type:SET_KEYS,
    payload:keys	   
   })

   }

   const getReleases = async (dates) =>{

    console.log(dates)
    const res = await axios.get(`/api/leads/releases?q=${JSON.stringify(dates)}`)
     dispatch({
      type:GET_RELEASES,
      payload:res.data
     })
    setLeads(res.data) 	   
   
   }

  return (
    <LeadContext.Provider
      value={{
      uploadFiles,
      getReleases,		      
      sendTodays,      
      uploadDaily,
      setLeads,
      uploadScrapes,
      uploadSuppress,
      deleteDup,
      postLeads,
      getDups,  
      clearLeads,
      putDup,
      getLexs,
      setKeys,
      keys: state.keys,		      
      leads:state.leads
      }}>
      {props.children}
    </LeadContext.Provider>
  );
};

export default LeadState;
