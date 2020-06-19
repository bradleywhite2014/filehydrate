import {
    SET_USER_INFO,
    FETCH_MERGE_FIELDS,
    FETCH_MERGE_FIELDS_SUCCESS,
    UPDATE_MERGE_FIELD,
    SUBMIT_MERGE_FIELDS_SUCCESS,
    SUBMIT_MIRAKL_DETAILS_SUCCESS,
    GET_MIRAKL_TOKEN_STATUS_SUCCESS,
    SET_FILE_ID,
    PERFORM_FILE_SEARCH_SUCCESS,
    PERFORM_FILE_SEARCH_ERROR,
    REMOVE_MESSAGE,
    PUT_ERROR_MESSAGE,
    LOGOUT_USER,
    CHANGE_MERGE_STYLE,
    UPDATE_MIRAKL_TOKEN,
    UPDATE_MIRAKL_URL,
    SEARCH_MIRAKL_ORDERS_SUCCESS,
    LOGIN_PENDING,
    PARSE_TOKENS_FROM_URL,
    LOGOUT_USER_SUCCESS,
    SHOW_GLOBAL_MODAL,
    HIDE_GLOBAL_MODAL,
    SET_GLOBAL_MODAL_INFO,
    CLEAR_GLOBAL_MODAL_INFO,
    ON_TAG_CLICK
  } from '../utils/constants'

import _ from 'underscore';

import {convertMergeFieldsToFormFields, convertGoogleFileResponseToAutocompleteFields, genMsgId, parseTokenFromUrl, parseJwt, mapMiraklOrders, convertResultsToMappingFields} from '../utils/index'

  const initializeState = () => {
    return {
        userInfo: {
            name: '',
            imageUrl: ''
        },
        accessToken: '',
        mappingFields: [],
        formFields: {},
        docId: '',
        fileList: [],
        messages: [],
        loadingFields: false,
        mergeStyle: "manual",
        miraklApiToken: "",
        miraklUrlHost: "",
        miraklOrders: [],
        authState: 'PENDING',
        userPhotoUrl: '',
        storedMiraklTokens: false,
        showGlobalModal: false,
        globalModal: {
            header: '',
            title: '',
            content: ''
        }
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
      case SHOW_GLOBAL_MODAL: {
        return Object.assign({}, state, {
            showGlobalModal: true
        })
      }
      case HIDE_GLOBAL_MODAL: {
        return Object.assign({}, state, {
            showGlobalModal: false
        })
      }
      case SET_GLOBAL_MODAL_INFO: {
        const globalModalInfo = action.payload
        return Object.assign({}, state, {
            globalModal: globalModalInfo
        })
      }
      case CLEAR_GLOBAL_MODAL_INFO: {
        return Object.assign({}, state, {
            globalModal: {
                header: '',
                title: '',
                content: ''
            }
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
      case GET_MIRAKL_TOKEN_STATUS_SUCCESS: {
        return Object.assign({}, state, {
            storedMiraklTokens: action.payload
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
      case SUBMIT_MIRAKL_DETAILS_SUCCESS: {
        let currentMessages = state.messages;
        currentMessages.push({
            id: genMsgId(),
            type: 'success',
            message: 'Successfully stored token information!'
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
        const resp = action.payload
        const orderList = mapMiraklOrders(resp);
        return Object.assign({}, state, {
            miraklOrders: orderList,
            mappingFields: convertResultsToMappingFields(orderList)
        })
      }
      case ON_TAG_CLICK: {
        const field = action.payload
        let temp = state.mappingFields
        temp[field].open_tag = !temp[field].open_tag
        return Object.assign({}, state, {
            mappingFields: temp
        })
       
      }
      case LOGIN_PENDING: {
        return Object.assign({}, state, {
            authState: 'PENDING'
        })
      }

      case PARSE_TOKENS_FROM_URL: {
        const {accessToken, idToken } = parseTokenFromUrl();
        const jwt = parseJwt(idToken)
        window.location.href = window.origin // lets go to root, we got this token in our sessionstorage
        return Object.assign({}, state, {
            authState: 'VALID',
            userPhotoUrl: jwt ? jwt.picture : ''
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
      case LOGOUT_USER_SUCCESS: {
        // Remove any old data from sessionStorage
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('idToken');
        localStorage.removeItem('documerge_state');
        
        return Object.assign({}, state, initializeState());
      }
      default:  
        return Object.assign({}, state,loadState())
    }
  }
  
export default reducer