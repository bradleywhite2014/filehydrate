import {
    SET_USER_INFO,
    REMOVE_USER_INTO,
    FETCH_MERGE_FIELDS_SUCCESS,
    UPDATE_MERGE_FIELD,
    SUBMIT_MERGE_FIELDS_SUCCESS,
    SET_FILE_ID
  } from '../utils/constants'

import {convertMergeFieldsToFormFields} from '../utils/index'

  const initializeState = () => {
    return {
        userInfo: {
            name: '',
            imageUrl: ''
        },
        accessToken: '',
        mergeFields: ['{{MY_WHATEVER}}', '{{MY_ADDRESS}}', '{{MY_PHONE}}', '{{MY_EMAIL}}', '{{DATE}}', '{{TO_NAME}}', '{{TO_TITLE}}', '{{TO_COMPANY}}', '{{TO_ADDRESS}}', '{{TO_NAME}}', '{{BODY}}', '{{MY_NAME}}'],
        formFields: {
            '{{MY_WHATEVER}}': '',
            '{{MY_ADDRESS}}': '',
            '{{MY_PHONE}}': '',
            '{{MY_EMAIL}}': '',
            '{{DATE}}': '',
            '{{TO_NAME}}': '',
            '{{TO_TITLE}}': '',
            '{{TO_COMPANY}}': '',
            '{{TO_ADDRESS}}': '',
            '{{TO_NAME}}': '',
            '{{BODY}}': '',
            '{{MY_NAME}}': '',
        },
        docId: ''
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
        // Remove any old data from sessionStorage
        sessionStorage.removeItem('accessToken');
        // Save new key
        sessionStorage.setItem('accessToken', action.payload.uc.access_token);
        sessionStorage.setItem('idToken', action.payload.tokenObj.id_token);
        const userInfo = action.payload.profileObj
        return Object.assign({}, state, {
            userInfo: {
              name: userInfo.name,
              imageUrl: userInfo.imageUrl
            },
            accessToken: action.payload.tokenObj.id_token
        })
        
      }
      case REMOVE_USER_INTO: {
          // Remove any old data from sessionStorage
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('documerge_state');

        return Object.assign({}, state, initializeState());
      }
      case FETCH_MERGE_FIELDS_SUCCESS: {
        const mergeFields = action.payload
        return Object.assign({}, state, {
            formFields: convertMergeFieldsToFormFields(mergeFields)
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
        console.log('WE DID THE SUBMIT THING!!')
        return state
      }
      case SET_FILE_ID: {
        return Object.assign({}, state, {
            docId: action.payload
        })
      }
      default:  
        return Object.assign({}, state,loadState())
    }
  }
  
export default reducer