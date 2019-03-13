import { 
    FIREBASE_AUTHENTICATED,
    FIREBASE_NOT_AUTHENTICATED,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER,
    PULL_USER_DATA,
    SIGN_OUT_SUCCESS,
    SIGN_OUT_FAIL,
    CLEAR_ERROR_MESSAGE
} from './../actions/types';

import { REHYDRATE } from 'redux-persist/constants';

const INITIAL_STATE = {
    authenticated: false,
    username: '',
    email: '',
    password: '',
    error: '',
    rp_id: '',
    loading: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FIREBASE_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            }
        case FIREBASE_NOT_AUTHENTICATED:
            return {
                ...state,
                authenticated: false
            }
        case LOGIN_USER:
            return {
                ...state,
                loading: true, 
                error: '' 
            };
        case LOGIN_USER_SUCCESS:
            return { 
                ...state,
                authenticated: true 
            };
        case LOGIN_USER_FAIL:
            return { 
                ...state, 
                error: action.payload,
                password: '', 
                loading: false, 
                authenticated: false 
            };
        case PULL_USER_DATA:
            return {
                ...state,
                email: action.payload.email,
                rp_id: action.payload.rp_id,
                username: action.payload.username
            }
        case REGISTER_USER_SUCCESS:
            return { 
                ...state,  
                authenticated: true 
            };
        case REGISTER_USER_FAIL:
            return { 
                ...state, 
                error: action.payload,
                password: '', 
                loading: false, 
                authenticated: false 
            };
        case SIGN_OUT_SUCCESS:
            return{
                INITIAL_STATE,
            };
        case SIGN_OUT_FAIL:
            return{
                ...state
            };
        case CLEAR_ERROR_MESSAGE:
            return{
                ...state,
                error: ''
            }
        case REHYDRATE:
            var incoming = action.payload.auth;
            if (incoming) return { ...state, ...incoming }
            return state
        default:
            return state;
    }
};