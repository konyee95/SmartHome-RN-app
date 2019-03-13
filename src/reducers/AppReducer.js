import {
  UPDATE_NETWORK_STATUS
} from '../actions/types';

const INITIAL_STATE = {
  networkStatus: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_NETWORK_STATUS:
      return { ...state, networkStatus: action.payload }
    default:
      return state
  }
}