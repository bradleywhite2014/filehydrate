import {
    GET_TEAMS_SUCCESS,
    GET_GAMES_SUCCESS,
    MENU_TOGGLE,
    MENU_CLOSE,
    MAKE_PICK,
    MAKE_PICK_SUCCESS,
    MAKE_PICK_ERROR,
    GET_CURRENT_ROUND_SUCCESS
  } from '../utils/constants'
  
  const initialState = {
    teams: [],
    games: [],
    errors: [],
    currentRound: 0,
    menuOpen: false
  }
  
const reducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_TEAMS_SUCCESS: {
        const teams = action.payload
        return Object.assign({}, state, {
            teams: teams
        })
        
      }
      case GET_GAMES_SUCCESS: {
        const games = action.payload
        return Object.assign({}, state, {
            games: games
        }) 
      }
      case MENU_TOGGLE: {
        return Object.assign({}, state, {
            menuOpen: !state.menuOpen
        }) 
      }
      case MENU_CLOSE: {
        return Object.assign({}, state, {
          menuOpen: false
        }) 
      }
      case MAKE_PICK_SUCCESS: {
        return Object.assign({}, state, {
    
        })
      }
      case GET_CURRENT_ROUND_SUCCESS: {
        const round = action.payload
        return Object.assign({}, state, {
          currentRound: round
        }) 
      }
      case MAKE_PICK_ERROR: {
        const errorMsg = action.payload
        console.log(state.errors)
        const tempList = state.errors
        tempList.push(errorMsg)        
        return Object.assign({}, state, {
          errors: tempList
        })
      }
      default:
        return state
    }
  }
  
export default reducer