import * as constants from '../utils/constants'
//actionS
export const setUserInfo = (payload) => ({type: constants.SET_USER_INFO, payload});
export const removeUserInfo = (payload) => ({type: constants.REMOVE_USER_INTO,payload});
export const fetchMergeFields = (payload) => ({type: constants.FETCH_MERGE_FIELDS, payload});
export const fetchMergeFieldsSuccess = (payload) => ({type: constants.FETCH_MERGE_FIELDS_SUCCESS, payload});
