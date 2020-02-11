import {
    SET_USER_INFO,
    REMOVE_USER_INTO
  } from '../utils/constants'

  const initializeState = () => {
    return {
        userInfo: {
            name: '',
            imageUrl: ''
        },
        accessToken: ''
    }
};

const loadState = () => {
    try {
        let serializedState = localStorage.getItem("documerge_state");

        if (serializedState === null) {
            return initializeState();
        }

        return JSON.parse(serializedState);
    }
    catch (err) {
        return initializeState();
    }
}
  
const initialState = initializeState();
  
const reducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_USER_INFO: {
        // Remove any old data from sessionStorage
        sessionStorage.removeItem('accessToken');
        // Save new key
        sessionStorage.setItem('accessToken', action.payload.tokenObj.id_token);
        const userInfo = action.payload.profileObj
        return Object.assign({}, state, {
            userInfo: {
              name: userInfo.name,
              imageUrl: userInfo.imageUrl
            },
            accessToken: action.payload.tokenObj.id_token
        })
        
      }
      case REMOVE_USER_INTO: {
          // Remove any old data from sessionStorage
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('documerge_state');

        return Object.assign({}, state, initializeState());
      }
      default:  
        return Object.assign({}, state,loadState())
    }
  }
  
export default reducer