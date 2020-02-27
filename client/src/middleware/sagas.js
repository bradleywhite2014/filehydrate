/* global URL */
import {takeEvery, fork, put, call, all} from 'redux-saga/effects'

import * as constants from '../utils/constants'
import * as actions from '../lib/actions'

import {appConfig} from '../config'

import {get, post, httpPut} from './http'

  
export function* fetchMergeFields({payload}) {
    const mergeFields = yield call(get, 'https://lipyjnw0f8.execute-api.us-east-2.amazonaws.com/main' + '?docId=' + payload + '&access_token=' + sessionStorage.getItem('accessToken'))
    yield put(actions.fetchMergeFieldsSuccess(mergeFields))
    
}

export function* submitMergeFields({payload}) {
  const results = yield call(post,'https://lipyjnw0f8.execute-api.us-east-2.amazonaws.com/main'  + '?docId=' + payload.docId + '&access_token=' + sessionStorage.getItem('accessToken'), payload.formFields)
  yield put(actions.submitMergeFieldsSuccess())
}

function * watcher () {
  if (appConfig.OFFLINE_MODE) {
    // going to use mocked out versions
    //yield takeEvery(constants.GET_IMPORT_DATES, mockSagas.getImportDates)
  } else {
    //yield takeEvery(constants.GET_TEAMS, getTeams)
    yield takeEvery(constants.FETCH_MERGE_FIELDS, fetchMergeFields)
    yield takeEvery(constants.SUBMIT_MERGE_FIELDS, submitMergeFields)
  }
}

export default function * rootSagas () {
  yield all([
    fork(watcher)
  ])
}