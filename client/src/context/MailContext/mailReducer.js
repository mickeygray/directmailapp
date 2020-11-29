import {UPLOAD_FILE,  CREATE_DIRECTMAIL,
  GET_DIRECTMAIL,
  VIEW_MAILITEM,
  SET_LETTER,
  SET_DIRECTMAILITEM,
  SUBMIT_COSTS,
  CREATE_DIRECTMAILSCHEDULE,
  GET_DIRECTMAILSCHEDULE,
  SET_MAILCOSTS,
  SEND_MAIL,
  SET_DIRECTMAILSCHEDULE,
  FILTER_LETTERS,
  CLEAR_FILTER,
  DELETE_SCHEDULEITEM,
  DELETE_LETTER,
SUBMIT_ZIPS} from '../types';

export default (state, action) => {
  switch (action.type) {
    case UPLOAD_FILE:
      return {
        ...state,
        data: action.payload,
      };

        case DELETE_SCHEDULEITEM:
      return {
        ...state,
        mailSchedule: state.mailSchedule.filter(
          (letter) => letter._id !== action.payload
        ),
      }; 
      
      case DELETE_LETTER:
      return {
        ...state,
        mailLibrary: state.mailSchedule.filter(
          (letter) => letter._id !== action.payload
        ),
      };  
    case FILTER_LETTERS:
      return {
        ...state,
        filtered: state.mailLibrary.filter((letter) => {
          const regex = new RegExp(`${action.payload}`, "gi");
          return letter.title.match(regex);
        }),
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null,
      };
          case SUBMIT_ZIPS:
      return {
        ...state,
        file: action.payload,
      };
       case CREATE_DIRECTMAIL:
      return {
        ...state,
        mailItem: action.payload,
      };
    case CREATE_DIRECTMAILSCHEDULE:
      return {
        ...state,
        mailSchedule: action.payload,
      };
    case SEND_MAIL:
      return {
        ...state,
        mailSchedule: action.payload,
      };

    case SUBMIT_COSTS:
      return {
        ...state,
        costs: action.payload,
      };
    case GET_DIRECTMAIL:
      return {
        ...state,
        mailLibrary: action.payload,
      };


    case SET_MAILCOSTS:
      return {
        ...state,
        mailCosts: action.payload,
      };

    case GET_DIRECTMAILSCHEDULE:
      return {
        ...state,
        mailSchedule: action.payload,
      };
    case SET_DIRECTMAILSCHEDULE:
      return {
        ...state,
        scheduleObj: action.payload,
      };
    case SET_DIRECTMAILITEM:
      return {
        ...state,
        mailItem: action.payload,
      };
    case VIEW_MAILITEM:
      return {
        ...state,
        letter: action.payload,
      };
    case SET_LETTER:
      return {
        ...state,
        letter: action.payload,
      };
    default:
      return state;
  }
};