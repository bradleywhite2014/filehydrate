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
export const createBlankGoogleDoc = (payload) => ({type: constants.CREATE_BLANK_GOOGLE_DOC, payload});
export const createBlankGoogleDocSuccess = (payload) => ({type: constants.CREATE_BLANK_GOOGLE_DOC_SUCCESS, payload});
export const updateDocTemplateName = (payload) => ({type: constants.UPDATE_DOC_TEMPLATE_NAME, payload});
export const removeMessage = (payload) => ({type: constants.REMOVE_MESSAGE, payload});
export const changeMergeStyle = (payload) => ({type: constants.CHANGE_MERGE_STYLE, payload});
export const updateMiraklToken = (payload) => ({type: constants.UPDATE_MIRAKL_TOKEN, payload});
export const updateMiraklUrl = (payload) => ({type: constants.UPDATE_MIRAKL_URL, payload});
export const onTagClick = (payload) => ({type: constants.ON_TAG_CLICK, payload});
export const onTableClick = (payload) => ({type: constants.ON_TABLE_CLICK, payload});
export const onCheckClick = (payload) => ({type: constants.ON_TAG_CHECK_CLICK, payload});
export const onTableBackClick = (payload) => ({type: constants.ON_TABLE_BACK_CLICK, payload});


export const getMiraklTokenStatus = (payload) => ({type: constants.GET_MIRAKL_TOKEN_STATUS, payload});
export const getMiraklTokenStatusSuccess = (payload) => ({type: constants.GET_MIRAKL_TOKEN_STATUS_SUCCESS, payload});
export const submitMiraklHostAndToken = (payload) => ({type: constants.SUBMIT_MIRAKL_DETAILS, payload});
export const submitMiraklHostAndTokenSuccess = (payload) => ({type: constants.SUBMIT_MIRAKL_DETAILS_SUCCESS, payload});
export const searchMiraklOrders = (payload) => ({type: constants.SEARCH_MIRAKL_ORDERS, payload});
export const searchMiraklOrdersSuccess = (payload) => ({type: constants.SEARCH_MIRAKL_ORDERS_SUCCESS, payload});

export const submitUserTemplate = (payload) => ({type: constants.SUBMIT_USER_TEMPLATE, payload});
export const submitUserTemplateSuccess = (payload) => ({type: constants.SUBMIT_USER_TEMPLATE_SUCCESS, payload});
export const loadUserTemplateForFile = (payload) => ({type: constants.LOAD_USER_TEMPLATE_FOR_FILE, payload});
export const loadUserTemplateForFileSuccess = (payload) => ({type: constants.LOAD_USER_TEMPLATE_FOR_FILE_SUCCESS, payload});

//auth
export const checkAuthState = (payload) => ({type: constants.CHECK_AUTH_STATUS, payload});
export const setAuthStateSuccess = (payload) => ({type: constants.SET_AUTH_STATE, payload});
export const setAuthStateError = (payload) => ({type: constants.SET_AUTH_STATE_ERROR, payload});
export const parseTokens =(payload) => ({type: constants.PARSE_TOKENS_FROM_URL, payload});
export const loginPending = (payload) => ({type: constants.LOGIN_PENDING, payload});
export const logoutUser = (payload) => ({type: constants.LOGOUT_USER, payload});
export const logoutUserSuccess = (payload) => ({type: constants.LOGOUT_USER_SUCCESS, payload});
export const loginUser = (payload) => ({type: constants.LOGIN_USER, payload});

//error
export const putErrorMessage = (payload) => ({type: constants.PUT_ERROR_MESSAGE, payload});

//modal
export const showModal = (payload)  => ({type: constants.SHOW_GLOBAL_MODAL, payload});
export const hideModal = (payload)  => ({type: constants.HIDE_GLOBAL_MODAL, payload});
export const setModalInfo = (payload)  => ({type: constants.SET_GLOBAL_MODAL_INFO, payload});
export const clearModalInfo = (payload)  => ({type: constants.CLEAR_GLOBAL_MODAL_INFO, payload});

//data modal
export const hideDataModal = (payload) => ({type: constants.HIDE_DATA_MODAL, payload});

//firebase
export const setFirebase = (payload) => ({type: constants.SET_FIREBASE, payload});
export const kickoffCheckout = (payload) => ({type: constants.KICKOFF_CHECKOUT, payload});
export const resetCheckout = (payload) => ({type: constants.RESET_CHECKOUT, payload});

export const findOrCreateUserSubStatus = (payload) => ({type: constants.FIND_OR_CREATE_SUB_STATUS, payload});
export const findOrCreateSubStatusSuccess = (payload) => ({type: constants.FIND_OR_CREATE_SUB_STATUS_SUCCESS, payload});
