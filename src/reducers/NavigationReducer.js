import {
    UPDATE_TABBAR,
    INIT_INITIAL_SCREEN
} from './../actions/types';

const INITIAL_STATE = {
    navbarTitle: '',
    navIndex: 0,
    navbarIcon:'add'
};

export default (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_TABBAR:
            return {
                ...state,
                tabIndex: action.payload.tabIndex,
                navbarTitle: action.payload.navbarTitle,
                navbarIcon: action.payload.navbarIcon,
                navbarPage: action.payload.navbarPage
            }
        case INIT_INITIAL_SCREEN:
            return {
                ...state,
                navbarTitle: action.payload
            }
        default:
            return state;
    }
}