import * as constants from '../utils/constants'
//actionS
export const setUserInfo = (payload) => ({type: constants.SET_USER_INFO, payload});
export const fetchMergeFields = (payload) => ({type: constants.FETCH_MERGE_FIELDS, payload});
export const fetchMergeFieldsSuccess = (payload) => ({type: constants.FETCH_MERGE_FIELDS_SUCCESS, payload});
export const updateMergeField = (payload) => ({type: constants.UPDATE_MERGE_FIELD, payload});
export const submitMergeFields = (payload) => ({type: constants.SUBMIT_MERGE_FIELDS, payload});
export const submitMergeFieldsSuccess = (payload) => ({type: constants.SUBMIT_MERGE_FIELDS_SUCCESS, payload});
export const setFileId = (payload) => ({type: constants.SET_FILE_ID, payload});
export const setFileText = (payload) => ({type: constants.SET_FILE_TEXT, payload});
export const performFileSearch = (payload) => ({type: constants.PERFORM_FILE_SEARCH, payload});
export const performFileSearchSuccess = (payload) => ({type: constants.PERFORM_FILE_SEARCH_SUCCESS, payload});
export const performFileSearchFailure = (payload) => ({type: constants.PERFORM_FILE_SEARCH_FAILURE, payload});
export const removeMessage = (payload) => ({type: constants.REMOVE_MESSAGE, payload});
export const changeMergeStyle = (payload) => ({type: constants.CHANGE_MERGE_STYLE, payload});
export const updateMiraklToken = (payload) => ({type: constants.UPDATE_MIRAKL_TOKEN, payload});
export const updateMiraklUrl = (payload) => ({type: constants.UPDATE_MIRAKL_URL, payload});
export const searchMiraklOrders = (payload) => ({type: constants.SEARCH_MIRAKL_ORDERS, payload});
export const searchMiraklOrdersSuccess = (payload) => ({type: constants.SEARCH_MIRAKL_ORDERS_SUCCESS, payload});

//auth
export const isAuthed = (payload) => ({type: constants.CHECK_AUTH_STATUS, payload});
export const parseTokens =(payload) => ({type: constants.PARSE_TOKENS_FROM_URL, payload});
export const loginPending = (payload) => ({type: constants.LOGIN_PENDING, payload});
export const logoutUser = (payload) => ({type: constants.LOGOUT_USER, payload});
export const logoutUserSuccess = (payload) => ({type: constants.LOGOUT_USER_SUCCESS, payload});
export const loginUser = (payload) => ({type: constants.LOGIN_USER, payload});

//error
export const putErrorMessage = (payload) => ({type: constants.PUT_ERROR_MESSAGE, payload});

