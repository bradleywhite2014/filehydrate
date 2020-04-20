/* global URL */
import {takeEvery,takeLatest, fork, put, call, all} from 'redux-saga/effects'

import * as constants from '../utils/constants'
import * as actions from '../lib/actions'

import {appConfig} from '../config'

import {get, post, httpPut} from './http'

  
export function* fetchMergeFields({payload}) {
  try{
    const mergeFields = yield call(get, 'https://lipyjnw0f8.execute-api.us-east-2.amazonaws.com/main' + '?docId=' + payload + '&access_token=' + sessionStorage.getItem('accessToken'))
    
    if(mergeFields.error){
      if(mergeFields.error.code === 401) {
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

export function* submitMergeFields({payload}) {
  try{
    const results = yield call(post,'https://lipyjnw0f8.execute-api.us-east-2.amazonaws.com/main'  + '?docId=' + payload.docId + '&access_token=' + sessionStorage.getItem('accessToken'), payload.formFields)
    
    if(results.error){
      if(results.error.code === 401) {
        //lets go a head and get logged out
        yield put(actions.logoutUser())
      }
      yield put(actions.putErrorMessage(results.error.message))
    }else {
      yield put(actions.submitMergeFieldsSuccess())
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
      if(files.error.code === 401) {
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

    orders = yield call(get, payload.url + '/api/orders', payload.token, false)
    
    console.log(orders)
    if(orders.error){
      if(orders.error.code === 401) {
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
  }
}

export default function * rootSagas () {
  yield all([
    fork(watcher)
  ])
}