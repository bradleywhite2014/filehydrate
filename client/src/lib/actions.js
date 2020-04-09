import * as constants from '../utils/constants'
//actionS
export const setUserInfo = (payload) => ({type: constants.SET_USER_INFO, payload});
export const removeUserInfo = (payload) => ({type: constants.REMOVE_USER_INTO,payload});
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


