import {
    SET_USER_INFO,
    FETCH_MERGE_FIELDS,
    FETCH_MERGE_FIELDS_SUCCESS,
    UPDATE_MERGE_FIELD,
    SUBMIT_MERGE_FIELDS_SUCCESS,
    SET_FILE_ID,
    PERFORM_FILE_SEARCH_SUCCESS,
    PERFORM_FILE_SEARCH_ERROR,
    REMOVE_MESSAGE,
    PUT_ERROR_MESSAGE,
    LOGOUT_USER,
    CHANGE_MERGE_STYLE,
    UPDATE_MIRAKL_TOKEN,
    UPDATE_MIRAKL_URL,
    SEARCH_MIRAKL_ORDERS_SUCCESS
  } from '../utils/constants'

import _ from 'underscore';

import {convertMergeFieldsToFormFields, convertGoogleFileResponseToAutocompleteFields, genMsgId} from '../utils/index'

  const initializeState = () => {
    return {
        userInfo: {
            name: '',
            imageUrl: ''
        },
        accessToken: '',
        mergeFields: [],
        formFields: {},
        docId: '',
        fileList: [],
        messages: [],
        loadingFields: false,
        mergeStyle: "manual",
        miraklApiToken: "",
        miraklUrlHost: "",
        miraklOrders: []
    }
    
};

const loadState = () => {
    try {
        let serializedState = localStorage.getItem("documerge_state");

        if (serializedState === null) {
            return initializeState();
        }

        return JSON.parse(serializedState);
    }
    catch (err) {
        return initializeState();
    }
}
  
const initialState = initializeState();
  
const reducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_USER_INFO: {
          console.log(action)
        // Remove any old data from sessionStorage
        sessionStorage.removeItem('accessToken');
        // Save new key
        sessionStorage.setItem('accessToken', action.payload.accessToken);
        sessionStorage.setItem('idToken', action.payload.tokenId);
        const userInfo = action.payload.profileObj
        return Object.assign({}, state, {
            userInfo: {
              name: userInfo.name,
              imageUrl: userInfo.imageUrl
            },
            accessToken: action.payload.tokenId
        })
        
      }
      case FETCH_MERGE_FIELDS: {
        return Object.assign({}, state, {
            loadingFields: true
        })
      }
      case FETCH_MERGE_FIELDS_SUCCESS: {
        const mergeFields = action.payload
        return Object.assign({}, state, {
            formFields: convertMergeFieldsToFormFields(mergeFields),
            loadingFields: false
        })
      }
      case UPDATE_MERGE_FIELD: {
          const fieldKey = action.payload.fieldKey
          const fieldVal = action.payload.fieldVal
          const updatedFormFields = state.formFields
          updatedFormFields[fieldKey] = fieldVal

        return Object.assign({}, state, {
            formFields: updatedFormFields
        })
      }
      case SUBMIT_MERGE_FIELDS_SUCCESS: {
        let currentMessages = state.messages;
        currentMessages.push({
            id: genMsgId(),
            type: 'success',
            message: 'Merge completed successfully!'
        })
        return Object.assign({}, state, {
            messages: currentMessages
        })
      }
      case SET_FILE_ID: {
        return Object.assign({}, state, {
            docId: action.payload
        })
      }
      case PERFORM_FILE_SEARCH_SUCCESS: {
        const resp = action.payload
        return Object.assign({}, state, {
            fileList: convertGoogleFileResponseToAutocompleteFields(resp.files)
        })
      }
      case CHANGE_MERGE_STYLE: {
        const newMergeStyle = action.payload
        return Object.assign({}, state, {
            mergeStyle: newMergeStyle
        })
      }
      case UPDATE_MIRAKL_TOKEN: {
        const newApiTokenValue = action.payload
        return Object.assign({}, state, {
            miraklApiToken: newApiTokenValue
        })
      }
      case UPDATE_MIRAKL_URL: {
        const newUrlValue = action.payload
        return Object.assign({}, state, {
            miraklUrlHost: newUrlValue
        })
      }
      case SEARCH_MIRAKL_ORDERS_SUCCESS: {
          console.log(action.payload)
        const resp = action.payload
        return Object.assign({}, state, {
            miraklOrders: resp
        })
      }
      case REMOVE_MESSAGE: {
        const removeId = action.payload
        let tempMessages = state.messages
        tempMessages = _.filter(tempMessages, (msg) => {
            return msg.id !== removeId
        })
        return Object.assign({}, state, {
            messages: tempMessages
        })
      }
      case PUT_ERROR_MESSAGE: {
        const errorMsg = action.payload
        let currentMessages = state.messages;
        currentMessages.push({
            id: genMsgId(),
            type: 'error',
            message: 'Error: ' + errorMsg
        })
        return Object.assign({}, state, {
            messages: currentMessages
        })
      }
      case LOGOUT_USER: {
        // Remove any old data from sessionStorage
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('documerge_state');

        return Object.assign({}, state, initializeState());
      }
      default:  
        return Object.assign({}, state,loadState())
    }
  }
  
export default reducer