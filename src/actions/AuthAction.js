import qs from 'qs';
import axios from 'axios';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import {
    FIREBASE_AUTHENTICATED,
    FIREBASE_NOT_AUTHENTICATED,
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    PULL_USER_DATA,
    SIGN_OUT_SUCCESS,
    SIGN_OUT_FAIL,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    CLEAR_ERROR_MESSAGE
} from './types';

// remember to replace url to production url!
const SERVER_ENDPOINT = "https://deepeye-dot-deepeye-200003.appspot.com";
// const SERVER_ENDPOINT = "http://192.168.0.188:8080";
const SERVER_CONFIG = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

export const trainModelRequest = (rpid, username, blobPath) => {
    return async dispatch => {
        try {
            let data = qs.stringify({ rpid, type: "trainModel", username, blobPath })
            console.log(data)
            let response = axios.post(SERVER_ENDPOINT, data, SERVER_CONFIG)
            console.log(response)
        } catch (error) {
            console.log(error.response)
        }
    }
}

export const clearErrorMessage = () => {
    return dispatch =>{
        dispatch({ type: CLEAR_ERROR_MESSAGE })
    }
}

export const checkFirebaseAuth = () => {
    return dispatch => {
        firebase.auth().onAuthStateChanged(user => {
            if (user !== null) {
                dispatch({ type: FIREBASE_AUTHENTICATED })
                Actions.main({ type: 'reset' })
                initNotification(dispatch)
            } else {
                dispatch({ type: FIREBASE_NOT_AUTHENTICATED })
                Actions.auth({ type: 'reset' })
            }
        })
    }
}

const initNotification = dispatch => {
    const { currentUser } = firebase.auth();
    firebase.messaging().requestPermission() // request permission for notification
    firebase.messaging().getToken()
        .then(pushToken => {
            firebase.database().ref(`/Users/${currentUser.uid}`).update({ pushToken })
                .then(() => console.log("Push notification token updated!"))
                .then(() => console.log(pushToken))
                .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
}

export const loginUser = ({ email, password }) => {
    return dispatch => {
        firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
            .then(user => loginUserSuccess(dispatch, user))
            .catch(e => loginUserFail(dispatch, e))
    }
}

const loginUserSuccess = (dispatch, user) =>{
    dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: user
    });
}

const loginUserFail = (dispatch, e) => {
    console.log(e)
    if (e.code ==="auth/user-not-found") {
        dispatch({ 
            type:LOGIN_USER_FAIL,
            payload: "User account not found. Have you created this user account before?" })
    } else {
        dispatch({ type: LOGIN_USER_FAIL });
    }
};


export const registerUser = (username, email, password, rp_id) => {
    return(dispatch) => { 
        console.log(username, email, password, rp_id)
        firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password)
            .then(user => {
                registerUserSuccess(dispatch, username, email, rp_id)
            })
            .catch((error) => registerUserFail(dispatch, error));
    };
};

const registerUserSuccess = (dispatch, username, email, rp_id) => {
    createUserRef(dispatch, username, email, rp_id)
};

const registerUserFail = (dispatch, e) => {
    console.log(e)
    if (e.code ==="auth/weak-password") {
        dispatch({ 
            type:REGISTER_USER_FAIL,
            payload: "This password is too weak. Password entered should be at least 6 characters." })
    } else {
        dispatch({ type: REGISTER_USER_FAIL });
    }
};

const createUserRef = (dispatch, username, email, rp_id) => {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/Users/${currentUser.uid}`).set({ email, username, rp_id })
        .then(snapshot => createRpidRef(dispatch, rp_id))
        .catch(e => dispatch({ type: REGISTER_USER_FAIL, payload: e }))
}

/* update the list of RPID, this is for notification 
 * everyone who shares the same RPID will get notified if intruder is detected
 */
const createRpidRef = (dispatch, rp_id) => {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/RPID/${rp_id}/${currentUser.uid}`).set(true)
        .then(snapshot => dispatch({ type: REGISTER_USER_SUCCESS }))
        .catch(e => dispatch({ type: REGISTER_USER_FAIL, payload: e }))
}

export const pullUserData = () => {
    return dispatch => {
        const { currentUser } = firebase.auth();
        firebase.database().ref(`/Users/${currentUser.uid}`).once('value')
            .then(snapshot => dispatch({ type: PULL_USER_DATA, payload: snapshot.val()}))
            .catch(e => console.log(e))
    }
}

export const signOut = () =>{
    return (dispatch) => {
        firebase.auth().signOut()
            .then(() => {
                dispatch({ type:SIGN_OUT_SUCCESS })
                Action.auth({ type:'reset'});
             })
            .catch(e => {
                dispatch({ type:SIGN_OUT_FAIL })
             })
    }
};
