/* global URL */
import {takeEvery, fork, put, call, all} from 'redux-saga/effects'

import * as constants from '../utils/constants'
import * as actions from '../lib/actions'

import {appConfig} from '../config'

import {get, post, httpPut} from './http'

  
// export function* getTeams() {
//     const teams = yield call(get, '/api/getTeams')
//     if(teams === '401') {
//       yield put(actions.getTeamsSuccess([]))
//     }else {
//       yield put(actions.getTeamsSuccess(teams))
//     }
// }

function * watcher () {
  if (appConfig.OFFLINE_MODE) {
    // going to use mocked out versions
    //yield takeEvery(constants.GET_IMPORT_DATES, mockSagas.getImportDates)
  } else {
    //yield takeEvery(constants.GET_TEAMS, getTeams)
  }
}

export default function * rootSagas () {
  yield all([
    fork(watcher)
  ])
}