import {
    SET_USER_INFO,
    FETCH_MERGE_FIELDS,
    FETCH_MERGE_FIELDS_SUCCESS,
    UPDATE_MERGE_FIELD,
    SUBMIT_MERGE_FIELDS,
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
    SEARCH_MIRAKL_ORDERS,
    SEARCH_MIRAKL_ORDERS_SUCCESS,
    LOGIN_PENDING,
    PARSE_TOKENS_FROM_URL,
    LOGOUT_USER_SUCCESS,
    SHOW_GLOBAL_MODAL,
    HIDE_GLOBAL_MODAL,
    SET_GLOBAL_MODAL_INFO,
    CLEAR_GLOBAL_MODAL_INFO,
    ON_TAG_CLICK,
    ON_TAG_CHECK_CLICK,
    ON_TABLE_CLICK,
    LOAD_USER_TEMPLATE_FOR_FILE_SUCCESS,
    LOAD_USER_TEMPLATE_FOR_FILE,
    SUBMIT_USER_TEMPLATE,
    SUBMIT_USER_TEMPLATE_SUCCESS,
    HIDE_DATA_MODAL,
    ON_TABLE_BACK_CLICK
  } from '../utils/constants'

  import SearchDataTable from '../components/SearchDataTable'
import _ from 'underscore';

import {convertMergeFieldsToFormFields, convertGoogleFileResponseToAutocompleteFields, genMsgId, parseTokenFromUrl, parseJwt, convertResultsToMappingFields, convertMappingFieldsToForm, convertSnakedObjectToLabels, recurseSetNestedValue} from '../utils/index'

  const initializeState = () => {
    return {
        userInfo: {
            name: '',
            imageUrl: ''
        },
        accessToken: '',
        mappingFields: [],
        formFields: {},
        formToMappingFields: {},
        docId: '',
        fileList: [],
        messages: [],
        loadingFields: false,
        loadingOrders: false,
        loadingTemplate: false,
        mergeStyle: "manual",
        miraklApiToken: "",
        miraklUrlHost: "",
        miraklOrders: [],
        tableList: [],
        modalTableListKey: '',
        modalTableListKeyList: [],
        modalTableListIndexList: [],
        modalTableHeaders: [],
        modalTableList: [],
        authState: 'PENDING',
        userPhotoUrl: '',
        storedMiraklTokens: false,
        showGlobalModal: false,
        globalModal: {
            header: '',
            title: '',
            content: ''
        },
        miraklHeaders: []
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
      case ON_TABLE_CLICK: {
        const {property, id} = action.payload
        let index = -1
        let modalTableList;
        if(state.modalTableList && state.modalTableList.length > 0){
            //go with modal table list index
            index = state.modalTableList.findIndex(x => x["Order Id"] === id);
            modalTableList = state.modalTableList[index][property] 
        }else{
            index = state.tableList.findIndex(x => x["Order Id"] === id);
            modalTableList = state.tableList[index][property]
        }
        let headers = (modalTableList && modalTableList.length > 0) ? Object.keys(modalTableList[0]) : []
        let tempModalTableListKeyList = state.modalTableListKeyList;
        tempModalTableListKeyList.push(property);
        let tempModalTableListIndexList = state.modalTableListIndexList;
        tempModalTableListIndexList.push(index);
        return Object.assign({}, state, {
            modalTableListKey: property,
            modalTableListKeyList: tempModalTableListKeyList,
            modalTableListIndexList: tempModalTableListIndexList,
            modalTableHeaders: headers,
            modalTableList: modalTableList
        })
      }
      case ON_TABLE_BACK_CLICK : {
        let tempModalTableListKeyList = state.modalTableListKeyList;
        tempModalTableListKeyList.pop();
        let modalTableListIndexList = state.modalTableListIndexList;
        modalTableListIndexList.pop();

        const newTableListKey = tempModalTableListKeyList.length > 0 ? tempModalTableListKeyList[tempModalTableListKeyList.length -1] : ''
        let temp = state.tableList
        if(tempModalTableListKeyList.length > 0){
            //we have a sub-table we need to find, lets get it
            tempModalTableListKeyList.forEach((subKey, index) => {
                temp = temp[modalTableListIndexList[index]][subKey]
            });
        }

        let headers = (temp && temp.length > 0) ? Object.keys(temp[0]) : []
        
        return Object.assign({}, state, {
            modalTableListKey: newTableListKey,
            modalTableListKeyList: tempModalTableListKeyList,
            modalTableListIndexList: modalTableListIndexList,
            modalTableList: temp,
            modalTableHeaders: headers
        })
        }
      case HIDE_DATA_MODAL: {
        return Object.assign({}, state, {
            modalTableListKey: '',
            modalTableListKeyList: [],
            modalTableListIndexList: [],
            modalTableList: [],
            modalTableHeaders: []
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
            messages: currentMessages,
            loadingTemplate: false
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
      case SEARCH_MIRAKL_ORDERS: {
        return Object.assign({}, state, {
            loadingOrders: true
        })
      }
      case SEARCH_MIRAKL_ORDERS_SUCCESS: {
        const resp = action.payload
        const tableList = convertSnakedObjectToLabels(resp);

        let headers
        if(tableList.length > 0){
            tableList.forEach((row, index) => {
                if(index === 0){
                    headers = Object.keys(row)
                }else{
                    let currentRowHeaders = Object.keys(row)
                    let tempHeaders = headers.concat(currentRowHeaders)
                    tempHeaders = [...new Set(tempHeaders)];
                    headers = tempHeaders
                }
            })
        }else{
            headers = []
        }
        headers = headers.filter(item => (item !== "Created Date" && item !== "Order Id"));
        headers.unshift("Created Date");
        headers.unshift("Order Id");
        return Object.assign({}, state, {
            tableList,
            miraklHeaders: headers,
            mappingFields: convertResultsToMappingFields(tableList),
            loadingOrders: false
        })
      }
      case LOAD_USER_TEMPLATE_FOR_FILE: {
        return Object.assign({}, state, {
            loadingTemplate: true
        })
      }
      case LOAD_USER_TEMPLATE_FOR_FILE_SUCCESS: {
        const resp = action.payload
        let newObj = {}
        let path = []
        convertMappingFieldsToForm(resp[state.docId], newObj, path)
        return Object.assign({}, state, {
            mappingFields: resp[state.docId],
            formToMappingFields: newObj,
            loadingTemplate: false
        })
      }
      case SUBMIT_USER_TEMPLATE: {
        return Object.assign({}, state, {
            loadingTemplate: true
        })
      }
      case SUBMIT_MERGE_FIELDS: {
        return Object.assign({}, state, {
            loadingTemplate: true
        })
      }
      case SUBMIT_USER_TEMPLATE_SUCCESS: {
        const resp = action.payload
        return Object.assign({}, state, {
            loadingTemplate: false
        })
      }
      case ON_TAG_CLICK: {
        let tempModalTableListKeyList = state.modalTableListKeyList;
        let tempObj = state.mappingFields
        //create subjson which can be used to set the open tag
        tempModalTableListKeyList.forEach((key) => {
            tempObj = tempObj[key]
        })

        const field = action.payload
        tempObj[field].open_tag = !tempObj[field].open_tag

        return Object.assign({}, state, {
            mappingFields: state.mappingFields
        }) 
      }
      case ON_TAG_CHECK_CLICK: {
        const tagKey = action.payload.key
        const columnHeader = action.payload.columnHeader
        const selected = action.payload.selected
        let newVal = selected ? tagKey : ''
        let tempKeyList = state.modalTableListKeyList
        tempKeyList.push(columnHeader)
        tempKeyList.push('column_mapping')
        recurseSetNestedValue(state.mappingFields, tempKeyList, newVal)
        //remove the temp values because this is a reference not a new obj
        tempKeyList.pop()
        tempKeyList.pop()

        let newObj = {}
        let path = []
        convertMappingFieldsToForm(state.mappingFields, newObj, path)
        return Object.assign({}, state, {
            mappingFields: state.mappingFields,
            formToMappingFields: newObj
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