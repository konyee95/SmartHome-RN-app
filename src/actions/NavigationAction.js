import {
    UPDATE_TABBAR,
    INIT_INITIAL_SCREEN
} from './types';

export const updateTabbar = (tabIndex, navbarTitle, navbarIcon,navbarPage) => {
    return dispatch => {
        dispatch({
            type: UPDATE_TABBAR,
            payload: {
                tabIndex,
                navbarTitle,
                navbarIcon,
                navbarPage
            }
        })
    }
}

export const initInitialScreen = () => {
    return dispatch => {
        dispatch({
            type: INIT_INITIAL_SCREEN,
            payload: "Home"
        })
    }
}