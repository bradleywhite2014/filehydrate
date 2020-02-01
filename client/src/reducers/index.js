import {
    SET_USER_INFO
  } from '../utils/constants'
  
  const initialState = {
    userInfo: {
      name: '',
      imageUrl: ''
    }
  }
  
const reducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_USER_INFO: {
        const userInfo = action.payload.profileObj
        return Object.assign({}, state, {
            userInfo: {
              name: userInfo.name,
              imageUrl: userInfo.imageUrl
            }
        })
        
      }
      default:
        return state
    }
  }
  
export default reducer