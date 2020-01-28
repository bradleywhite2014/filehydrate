/* global URL */
import {takeEvery, fork, put, call, all} from 'redux-saga/effects'

import * as constants from '../utils/constants'
import * as actions from '../lib/actions'

import {appConfig} from '../config'

import {get, post, httpPut} from './http'

  
export function* getTeams() {
    const teams = yield call(get, '/api/getTeams')
    if(teams === '401') {
      yield put(actions.getTeamsSuccess([]))
    }else {
      yield put(actions.getTeamsSuccess(teams))
    }
}

export function* getGames() {
  const games = yield call(get, '/api/games')
  if(games === '401') {
    yield put(actions.getGamesSuccess([]))
  }else {
    yield put(actions.getGamesSuccess(games))
  }
}

export function* getCurrentRound() {
  const currentRound = yield call(get, '/api/currentRound')
  if(currentRound === '401') {
    yield put(actions.getCurrentRoundSuccess([]))
  }else {
    yield put(actions.getCurrentRoundSuccess(currentRound))
  }
}

export function* makePick({payload}) {
  console.log(payload)
  const result = yield call(post, '/api/pick', {
    "game_id" : payload.game_id,
    "winner" : payload.team_id,
    "byhowmuch": payload.byhowmuch
  })
  if(result && result === '200') {
    yield put(actions.makePickSuccess())
  }else {
    console.log(result)
    if(result && result.status && result.message){
      yield put(actions.makePickError("Error " + result.status + " - " + result.message))
    }else{
      yield put(actions.makePickError("Error 500 - Internal Server Error"))
    }
    
  }
  
}

function * watcher () {
  if (appConfig.OFFLINE_MODE) {
    // going to use mocked out versions
    //yield takeEvery(constants.GET_IMPORT_DATES, mockSagas.getImportDates)
  } else {
    yield takeEvery(constants.GET_TEAMS, getTeams)
    yield takeEvery(constants.GET_GAMES, getGames)
    yield takeEvery(constants.MAKE_PICK, makePick)
    yield takeEvery(constants.GET_CURRENT_ROUND, getCurrentRound)
  }
}

export default function * rootSagas () {
  yield all([
    fork(watcher)
  ])
}