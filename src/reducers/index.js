import { combineReducers } from 'redux';
import AppReducer from './AppReducer';
import AuthReducer from './AuthReducer';
import NavigationReducer from './NavigationReducer'
import DeviceReducer from './DeviceReducer';

export default combineReducers({
    app: AppReducer,
    auth: AuthReducer,
    nav: NavigationReducer,
    device: DeviceReducer
});