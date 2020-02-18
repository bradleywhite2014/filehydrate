/* global URL */
import {takeEvery, fork, put, call, all} from 'redux-saga/effects'

import * as constants from '../utils/constants'
import * as actions from '../lib/actions'

import {appConfig} from '../config'

import {get, post, httpPut} from './http'

  
export function* fetchMergeFields() {
    const teams = yield call(get, '/api/getTeams')
    yield put(actions.fetchMergeFieldsSuccess(teams))
    
}

export function* submitMergeFields(fields) {
  const results = yield call(get,'https://lipyjnw0f8.execute-api.us-east-2.amazonaws.com/main')
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