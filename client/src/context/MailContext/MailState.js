import React, { useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import MailContext from "./mailContext";
import mailReducer from "./mailReducer";
import axios from "axios"
import {
  UPLOAD_FILE,
  CREATE_DIRECTMAIL,
  CREATE_DIRECTMAILSCHEDULE,
  SET_DMAILLIBRARY,
  GET_DIRECTMAIL,
  GET_DIRECTMAILSCHEDULE,
  SET_DIRECTMAILITEM,
  SEND_MAIL,
  SET_DIRECTMAILSCHEDULE,
  SET_LETTER,
  VIEW_MAILITEM,
  CLEAR_FILTER,
  FILTER_LETTERS,
  SUBMIT_ZIPS,
  DELETE_SCHEDULEITEM,
  DELETE_LETTER
} from "../types";

const MailState = (props) => {
  const initialState = {
    mailItem: {},
    mailLibrary: [],
    letter: null,
    invoices: null,
    mailEntry: [],
    filtered:null,
    scheduleObj: {},
    mailCosts: [],
    mailSchedule: [],
  };

  const [state, dispatch] = useReducer(mailReducer, initialState);



const deleteScheduleItem = async (_id) =>{

        const res = await axios.delete(`/api/mail/schedule/${_id}`);
            dispatch({
      type: DELETE_SCHEDULEITEM,
      payload: res.data,
    });
 getDirectMailSchedule()
} 

const deleteLetter = async (_id) =>{

        const res = await axios.delete(`/api/mail/${_id}`);
            dispatch({
      type: DELETE_LETTER,
      payload: res.data,
    });

    getDirectMailLibrary()
} 
const submitZips = async (file) =>{
   const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(`/api/mail/zips`, file, config);

    dispatch({
      type: SUBMIT_ZIPS,
      payload: res.data,
    });
}

 const uploadFile = async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    data.forEach(function (element) {
      element.status = "new";
    });

    console.log(data)
    const res = await axios.post(`/api/leads`, data, config);

    dispatch({
      type: UPLOAD_FILE,
      payload: res.data,
    });
  };


 const filterLetters = (text) => {
    dispatch({ type: FILTER_LETTERS, payload: text });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  const createDirectMailItem = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await axios.post(`/api/mail`, formData, config);

    dispatch({
      type: CREATE_DIRECTMAIL,
      payload: res.data,
    });
  };

  const createDirectMailSchedule = async (entry, unit) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const reqObj = { entry, unit };
    const res = await axios.post(`/api/mail/schedule`, reqObj, config);

    dispatch({
      type: CREATE_DIRECTMAILSCHEDULE,
      payload: res.data,
    });
  };

  const setDirectMailLibrary = (mailLibrary) => {
    dispatch({
      type: SET_DMAILLIBRARY,
      payload: mailLibrary,
    });
  };
  const getDirectMailLibrary = async () => {
    const res = await axios.get(`/api/mail`);

    dispatch({
      type: GET_DIRECTMAIL,
      payload: res.data,
    });

    setDirectMailLibrary(res.data);
  };
  //Get Direct Mail Calendar
  const getDirectMailSchedule = async () => {
    const res = await axios.get(`/api/mail/schedule`);

    console.log(res.data);
    dispatch({
      type: GET_DIRECTMAILSCHEDULE,
      payload: res.data,
    });

    setDirectMailSchedule(res.data);
  };

  //
  //Set Current Direct Mail Item
  const setDirectMailItem = (mailItem) => {
    dispatch({
      type: SET_DIRECTMAILITEM,
      payload: mailItem,
    });
  };

  const setDirectMailSchedule = (mailSchedule) => {
    var scheduleObj = mailSchedule.reduce(function (r, o) {
      var k = o.scheduleDate;
      if (r[k] || (r[k] = [])) r[k].push(o);
      return r;
    }, {});

    dispatch({
      type: SET_DIRECTMAILSCHEDULE,
      payload: scheduleObj,
    });
  };
 const sendMail = async () => {
    const res = await axios.post("/api/mail/delivery");

    dispatch({
      type: SEND_MAIL,
      payload: res.data,
    });
  };
  const setLetter = (letter) => {
    console.log(letter);
    dispatch({
      type: SET_LETTER,
      payload: letter,
    });
  };
  //View Current Direct Mail Item

  const viewMailItem = async (title) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob",
    };

    console.log(title);
    const res = await axios.get(`/api/mail/mailItem?q=${title}`, config);
    dispatch({
      type: VIEW_MAILITEM,
      payload: res.data,
    });

    setLetter(res.data);
  };

  return (
    <MailContext.Provider
      value={{
      uploadFile,
      createDirectMailItem,
      createDirectMailSchedule,
      getDirectMailSchedule,
      filterLetters,
      deleteLetter,
      clearFilter,
      submitZips,
      deleteScheduleItem,
      getDirectMailLibrary,
      setDirectMailLibrary,
      setDirectMailItem,
      setLetter,
      sendMail,
      viewMailItem,
      submitZips,
      mailLibrary: state.mailLibrary,
      mailCosts: state.mailCosts,
      filtered: state.filtered,
      invoices: state.invoices,
      scheduleObj: state.scheduleObj,
      mailItem: state.mailItem,
      mailEntry: state.mailEntry,
      letter: state.letter,
      mailSchedule: state.mailSchedule,
      }}>
      {props.children}
    </MailContext.Provider>
  );
};

export default MailState;
