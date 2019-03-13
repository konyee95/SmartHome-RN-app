import {
  UPDATE_NETWORK_STATUS
} from './types';

export const updateNetworkStatus = payload => {
  return {
    type: UPDATE_NETWORK_STATUS,
    payload
  }
}