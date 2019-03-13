import axios from 'axios';
import firebase from 'react-native-firebase';
import {
    NO_DEVICE_FOUND,
    REGISTER_DEVICE_SUCCESS,
    REGISTER_DEVICE_FAIL,
    UPDATE_DEVICE_SUCCESS,
    UPDATE_DEVICE_FAIL,
    PULL_DEVICE_DATA,
    CLEAR_DEVICE_ERROR_MESSAGE,
    CLEAR_UPDATE_DEVICE_ERROR_MESSAGE,
} from './types';

import { Actions } from 'react-native-router-flux';

const SERVER_ENDPOINT = "https://deepeye-200003.appspot.com";
const SERVER_CONFIG = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export const clearDeviceErrorMessage = () => {
    return dispatch => {
        dispatch({ type: CLEAR_DEVICE_ERROR_MESSAGE })
    }
}

export const clearUpdateDeviceErrorMessage = () => {
    return dispatch => {
        dispatch({ type: CLEAR_UPDATE_DEVICE_ERROR_MESSAGE })
    }
}

export const toggleLightbulb = (email, password, bulbName, bulbState, brightness) => {
    return async dispatch => {
        try {
            let data = { email, password, bulbName, bulbState, brightness }
            let response = await axios.post(SERVER_ENDPOINT, data, SERVER_CONFIG)

            if (response.status === 200) {
                updateDeviceStateToFirebase(dispatch,{ bulbName, bulbState, brightness})
            }
        } catch (error) {
            const { status, data } = error.response;
            if (status === 400 || status === 401 || status === 500) {
                triggerUpdates(dispatch, bulbName, data.message)
            }
            if (status === 404) {
                triggerUpdates(dispatch, bulbName, "We are so sorry about this! Our server is down at the moment!")
            }
        }
    }
}

/* temporary mitigate the switch issue, this is the stupidest method, please revise in the future 
 * this is because the way we toggle individual switch in DeviceItem is by
 * monitoring props changes from Firebase 
 */
const triggerUpdates = (dispatch, bulbName, message) => {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/Devices/${currentUser.uid}/deviceList/${bulbName}`)
        .update({ toggling: true })
            .then(() => {
                firebase.database().ref(`/Devices/${currentUser.uid}/deviceList/${bulbName}`)
                    .update({ toggling: false })
                        .then(() => dispatch({ type: UPDATE_DEVICE_FAIL, payload: message }))
                        .catch(e => dispatch({ type: UPDATE_DEVICE_FAIL, payload: "Something is wrong, please try again later" }))
            })
            .catch(e => dispatch({ type: UPDATE_DEVICE_FAIL, payload: "Something is wrong, please try again later" }))
}

const updateDeviceStateToFirebase = (dispatch, { bulbName, bulbState, brightness }) => {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/Devices/${currentUser.uid}/deviceList/${bulbName}`)
        .update({ bulbState, brightness })
            .then(() => dispatch({ type: UPDATE_DEVICE_SUCCESS }))
            .catch(e => dispatch({ type: UPDATE_DEVICE_FAIL, payload: "Something is wrong, please try again later" }))
}

export const registerDevice = (deviceEmail, devicePassword, deviceName, deviceState, deviceLocation) => {
    return async dispatch => {
        try {
            /* data required to authenticated a device through AppEngine server */
            let data = { 
                email: deviceEmail, 
                password: devicePassword, 
                bulbName: deviceName
            }

            /* initial data to submit to firebase, once device is authenticated */
            let firebaseData = {
                email: deviceEmail,
                password: devicePassword,
                bulbName: deviceName,
                bulbState: deviceState,
                bulbLocation: deviceLocation,
                brightness: 0
            }
            
            let response = await axios.post(SERVER_ENDPOINT, data, SERVER_CONFIG)

            if (response.status === 200) {
                addDeviceToFirebase(dispatch, firebaseData)
            }

        } catch (error) {
            console.log(error)
            const { status, data } = error.response;
            if (status === 400 || status === 401 || status === 500) {
                dispatch({ type: REGISTER_DEVICE_FAIL, payload: data.message })
            }
            if (status === 404) {
                dispatch({ type: REGISTER_DEVICE_FAIL, payload: "We are so sorry about this! Our server is down at the moment!"})
            }
        }
    }
}

/* add device to firebase
 * once success, pull updated device list from firebase
 * return to previous screen
 */
const addDeviceToFirebase = (dispatch, { email, password, bulbName, bulbState, bulbLocation, brightness }) => {
    const { currentUser } = firebase.auth();
    firebase
        .database()
        .ref(`/Devices/${currentUser.uid}/deviceList/${bulbName}`)
        .set({ email, password, bulbName, bulbState, bulbLocation, brightness, toggling: false })
            .then(() => dispatch({ type: REGISTER_DEVICE_SUCCESS })) 
            .then(() => pullDeviceData())
            .then(() => Actions.pop())
            .catch(e => dispatch({ type: REGISTER_DEVICE_FAIL, payload: 'Firebase error'}))
}

/* pull device list (object) from firebase, return as an array to redux store */
export const pullDeviceData = () => {
    const { currentUser } = firebase.auth();
    return (dispatch) => {
        firebase.database().ref(`/Devices/${currentUser.uid}/deviceList`)
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    dispatch({
                        type: PULL_DEVICE_DATA,
                        payload: Object.values(snapshot.val())
                    });
                } else {
                    console.log("This user has not registered any device!")
                    dispatch({ type: NO_DEVICE_FOUND })
                }
            });
    };
}