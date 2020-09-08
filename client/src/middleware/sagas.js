/* global URL */
import {takeEvery,takeLatest, fork, put, call, all} from 'redux-saga/effects'

import * as constants from '../utils/constants'
import * as actions from '../lib/actions'
import {randomString} from '../utils'

import {appConfig} from '../config'

import {get, post, httpPut} from './http'

  
export function* fetchMergeFields({payload}) {
  try{
    const mergeFields = yield call(get, 'https://lipyjnw0f8.execute-api.us-east-2.amazonaws.com/main' + '?docId=' + payload + '&access_token=' + sessionStorage.getItem('accessToken'))
    
    if(mergeFields.error){
      if(mergeFields.error.code === 401 || mergeFields.error.code === 403) {
        //lets go a head and get logged out
        yield put(actions.logoutUser())
      }
      yield put(actions.putErrorMessage(mergeFields.error.message))
    }else {
      yield put(actions.fetchMergeFieldsSuccess(mergeFields))
    }
  }catch(e){
    yield put(actions.putErrorMessage(e))
  }
    
    
}
//https://fxr009j313.execute-api.us-east-2.amazonaws.com/main
export function* submitMergeFields({payload}) {
  try{
    const results = yield call(post,'https://lipyjnw0f8.execute-api.us-east-2.amazonaws.com/main'  + '?docId=' + payload.docId + '&access_token=' + sessionStorage.getItem('accessToken'), payload.formFields)
    
    if(results.error){
      if(results.error.code === 401 || results.error.code === 403) {
        //lets go a head and get logged out
        yield put(actions.logoutUser())
      }
      yield put(actions.putErrorMessage(results.error.message))
    }else {
      if(results.message && results.message === 'Internal server error'){
        yield put(actions.putErrorMessage(results.error.message))
      }else{
        yield put(actions.setModalInfo({
          header: 'Success!',
          title: 'Document Links',
          content: results
        }))
        yield put(actions.showModal())
      }
      
    }
  }catch(e){
    yield put(actions.putErrorMessage(e))
  }
  
}

export function* getMiraklTokenStatus({payload}) {
  try{
    const results = yield call(get,'https://fxr009j313.execute-api.us-east-2.amazonaws.com/main')
    if(results.Message){
      //lambda error, not authorized
      yield put(actions.logoutUser())
    }
    if(results.error){
      if(results.error.code === 401 || results.error.code === 403) {
        //lets go a head and get logged out
        yield put(actions.logoutUser())
      }
      yield put(actions.putErrorMessage(results.error.message))
    }else {
      if(results.status === 'found'){
        //user already stored tokens, ready to search
        yield put(actions.getMiraklTokenStatusSuccess(true))
      }else{
        yield put(actions.getMiraklTokenStatusSuccess(false))
      }
      
    }
  }catch(e){
    yield put(actions.putErrorMessage(e))
  }
  
}

export function* submitMiraklHostAndToken({payload}) {
  try{
    const results = yield call(post,'https://fxr009j313.execute-api.us-east-2.amazonaws.com/main' , payload.userDetails)
    
    if(results.error){
      if(results.error.code === 401 || results.error.code === 403) {
        //lets go a head and get logged out
        yield put(actions.logoutUser())
      }
      yield put(actions.putErrorMessage(results.error.message))
    }else {
      yield put(actions.submitMiraklHostAndTokenSuccess())
    }
  }catch(e){
    yield put(actions.putErrorMessage(e))
  }
  
}

//loadUserTemplateForFile
export function* loadUserTemplateForFile({payload}) {
  try{
    const results = yield call(get,'https://03i7mcv6l6.execute-api.us-east-2.amazonaws.com/main' + '?docId=' + payload)
    
    if(results.error){
      if(results.error.code === 401 || results.error.code === 403) {
        //lets go a head and get logged out
        yield put(actions.logoutUser())
      }
      yield put(actions.putErrorMessage(results.error.message))
    }else {
      yield put(actions.loadUserTemplateForFileSuccess(results))
    }
  }catch(e){
    yield put(actions.putErrorMessage(e))
  }
  
}

//submitUserTemplate
export function* submitUserTemplate({payload}) {
  try{
    const results = yield call(post,'https://03i7mcv6l6.execute-api.us-east-2.amazonaws.com/main' , payload.userDetails)
    
    if(results.error){
      if(results.error.code === 401 || results.error.code === 403) {
        //lets go a head and get logged out
        yield put(actions.logoutUser())
      }
      yield put(actions.putErrorMessage(results.error.message))
    }else {
      yield put(actions.submitUserTemplateSuccess())
    }
  }catch(e){
    yield put(actions.putErrorMessage(e))
  }
  
}

export function* performFileSearch({payload}) {
  try{
    var files = [];
    if(payload) {
      files = yield call(get, 'https://www.googleapis.com/drive/v3/files' + "?q=name contains " + "'" + payload + "'" , sessionStorage.getItem('accessToken'))
    } else {
      files = yield call(get, 'https://www.googleapis.com/drive/v3/files', sessionStorage.getItem('accessToken'))
    }
    if(files.error){
      if(files.error.code === 401 || results.error.code === 403) {
        //lets go a head and get logged out
        yield put(actions.logoutUser())
      }
      yield put(actions.putErrorMessage(files.error.message))
    }else {
      yield put(actions.performFileSearchSuccess(files)) 
    }
    
  }catch(e){
    yield put(actions.putErrorMessage(e))
  }
  
}

export function* performMiraklSearch({payload}) {
  try{
    var orders = [];
    orders = yield call(get,'https://6m5cadt7n1.execute-api.us-east-2.amazonaws.com/main')
    
    if(orders.error){
      if(orders.error.code === 401 || results.error.code === 403) {
        //lets go a head and get logged out
        yield put(actions.logoutUser())
      }
      yield put(actions.putErrorMessage(orders.error.message))
    }else {
      yield put(actions.searchMiraklOrdersSuccess(orders.orders)) 
    }
    
  }catch(e){
    yield put(actions.putErrorMessage(e))
  }
  
}

export function* performAuthCheck({payload}) {
  try {

  }catch(e){
    yield put(actions.putErrorMessage(e))
  }
}



export function* performLogin({payload}) {
  try {
    const googleScopes = 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive email profile'
    const generatedNonce = randomString(12)
    const authConfig = {
      'client_id': '382267252700-csiq3fr71ifkfckr39s6tdr3bqgpb3gn.apps.googleusercontent.com',
      'redirect_uri': window.origin += '/implicit/callback',
      'response_type': 'token id_token',
      'scope': googleScopes,
      'include_granted_scopes': 'true',
      'state': 'pass-through value',
      'nonce': generatedNonce,
    }

    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2RedirectEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth?';

    // Add form parameters as hidden input values.
    for (var key in authConfig) {
      if(key && authConfig[key]) {
        oauth2RedirectEndpoint += key + '=' + authConfig[key] + '&'; // we'll remove the last amp
      }
    }
    //remove extra amp
    var oauth2RedirectEndpoint = oauth2RedirectEndpoint.slice(0, -1)

    window.location.href = oauth2RedirectEndpoint; 

    yield put(actions.loginPending())

   

  }catch(e){
    yield put(actions.putErrorMessage(e))
  }
}

export function* performLogout({payload}) {
  try {

    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://oauth2.googleapis.com/revoke?token=' + sessionStorage.getItem('accessToken');
    console.log(oauth2Endpoint);
    const resp = yield call(post, oauth2Endpoint)

    if(resp.error){
      //if logout revoke fails, lets reset anyways
      yield put(actions.logoutUserSuccess())
    }else {
      yield put(actions.logoutUserSuccess()) 
    }

  }catch(e){
    yield put(actions.putErrorMessage(e))
  }
}

function * watcher () {
  if (appConfig.OFFLINE_MODE) {
    // going to use mocked out versions
    //yield takeEvery(constants.GET_IMPORT_DATES, mockSagas.getImportDates)
  } else {
    //yield takeEvery(constants.GET_TEAMS, getTeams)
    yield takeEvery(constants.FETCH_MERGE_FIELDS, fetchMergeFields)
    yield takeEvery(constants.SUBMIT_MERGE_FIELDS, submitMergeFields)
    yield takeLatest(constants.PERFORM_FILE_SEARCH, performFileSearch)
    yield takeEvery(constants.SEARCH_MIRAKL_ORDERS, performMiraklSearch)
    yield takeEvery(constants.CHECK_AUTH_STATUS, performAuthCheck)
    yield takeEvery(constants.LOGIN_USER, performLogin)
    yield takeEvery(constants.LOGOUT_USER, performLogout)

    //userDetails rest
    yield takeEvery(constants.GET_MIRAKL_TOKEN_STATUS, getMiraklTokenStatus)
    yield takeEvery(constants.SUBMIT_MIRAKL_DETAILS, submitMiraklHostAndToken)
    yield takeEvery(constants.SUBMIT_USER_TEMPLATE, submitUserTemplate)
    yield takeEvery(constants.LOAD_USER_TEMPLATE_FOR_FILE, loadUserTemplateForFile)
    
  }
}

export default function * rootSagas () {
  yield all([
    fork(watcher)
  ])
}