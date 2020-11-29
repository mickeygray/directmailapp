import {
  UPLOAD_FILES,
  UPLOAD_DAILY,
  DELETE_DUPS,
  SEND_TODAYS,
  UPLOAD_SUPPRESS,
  CLEAR_LEADS,
  POST_LEADS,
  GET_DUPS,
  UPLOAD_SCRAPES,
  SET_LEADS,
  SET_KEYS,
  GET_LEXS,
  GET_RELEASES,	
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case UPLOAD_FILES:
      return {
        ...state,
        data: action.payload,
      };
    case GET_RELEASES: 
      return {
        ...state,
	leads:action.payload
      };	      
    case UPLOAD_SCRAPES:
      return {
        ...state,
        data: action.payload,
      };
    case SET_KEYS:
      return {
	      ...state,
	      keys: action.payload
      };
    case GET_LEXS:
      return {
	...state,
	keys: action.payload
      };	      
    case UPLOAD_DAILY:
      return {
        ...state,
        data: action.payload,
      };
    case POST_LEADS:
      return {
        ...state,
        leads: action.payload,
      };
      case GET_DUPS:
      return {
        ...state,
        leads: action.payload,
      };
     case SET_LEADS:
      return {
        ...state,
        leads: action.payload,
      };
    case CLEAR_LEADS:
      return {
        ...state,
        leads: [],
      };
    case SEND_TODAYS:
      return {
        ...state,
        todays: action.payload,
      };

    case UPLOAD_SUPPRESS:
      return {
        ...state,
        data: action.payload,
      };
    case DELETE_DUPS:
      return {
        ...state,
        leads: state.leads.filter(
          (lead) => lead.dupId !== action.payload
        ),
      };


    }
};
