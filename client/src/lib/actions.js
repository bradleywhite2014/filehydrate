import * as constants from '../utils/constants'
//actionS
export const getTeams = (payload) => ({type: constants.GET_TEAMS, payload})
export const getTeamsSuccess = (payload) => ({type: constants.GET_TEAMS_SUCCESS, payload})
export const getGames = (payload) => ({type: constants.GET_GAMES, payload})
export const getGamesSuccess = (payload) => ({type: constants.GET_GAMES_SUCCESS, payload})
export const toggleMenu = () => ({type: constants.MENU_TOGGLE})
export const closeMenu = () => ({type: constants.MENU_CLOSE})
export const makePick = (payload) => ({type: constants.MAKE_PICK, payload})
export const makePickSuccess = (payload) => ({type: constants.MAKE_PICK_SUCCESS})
export const makePickError = (payload) => ({type: constants.MAKE_PICK_ERROR, payload})
export const getCurrentRound = () => ({type: constants.GET_CURRENT_ROUND})
export const getCurrentRoundSuccess = (payload) => ({type: constants.GET_CURRENT_ROUND_SUCCESS, payload});
