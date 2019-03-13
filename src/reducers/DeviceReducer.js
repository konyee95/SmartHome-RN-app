import { 
    NO_DEVICE_FOUND,
    REGISTER_DEVICE_SUCCESS,
    REGISTER_DEVICE_FAIL,
    UPDATE_DEVICE_SUCCESS,
    UPDATE_DEVICE_FAIL,
    PULL_DEVICE_DATA,
    CLEAR_DEVICE_ERROR_MESSAGE,
    CLEAR_UPDATE_DEVICE_ERROR_MESSAGE
 } from './../actions/types';

 import { REHYDRATE } from 'redux-persist/constants';

 const INITIAL_STATE = {
     deviceList: [],
     deviceError: '',
     updateDeviceError: ''
 }

 export default (state = INITIAL_STATE, action) => {
     console.log(action)
     switch (action.type) {
        case NO_DEVICE_FOUND:
            return INITIAL_STATE;
        case REGISTER_DEVICE_SUCCESS:
            return { ...state };
        case REGISTER_DEVICE_FAIL:
            return { ...state, deviceError: action.payload };
        case UPDATE_DEVICE_SUCCESS:
            return { ...state };
        case UPDATE_DEVICE_FAIL:
            return { ...state, updateDeviceError: action.payload };
        case PULL_DEVICE_DATA:
            /* overriden existing deviceList in redux, only use data from firebase */
            return { ...state, deviceList: action.payload };
        case CLEAR_DEVICE_ERROR_MESSAGE:
            return { ...state, deviceError: '' };
        case CLEAR_UPDATE_DEVICE_ERROR_MESSAGE:
            return { ...state, updateDeviceError: '' };
        default:
            return state;
     }
 }
 