import React, { Component } from 'react';
import { NetInfo, View, Text } from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { updateNetworkStatus, updateTabbar, initInitialScreen, pullUserData } from '../../actions'

import firebase from 'react-native-firebase';
import type { Notification } from 'react-native-firebase';
import { BottomNavigation } from 'react-native-paper';

import HomeRoute from './BottomNavigationScreens/HomeRoute';
import IotDevicesRoute from './BottomNavigationScreens/IotDevicesRoute';
import MessageRoute from './BottomNavigationScreens/MessageRoute';
import UserRoute from './BottomNavigationScreens/UserRoute';


class HomePage extends Component {

    state = {
        index: 0,
        routes: [
            { key:'home', title:'Home', icon: 'home', rightIcon: 'add'},
            { key:'iotDevices', title:'Devices', icon: 'devices', rightIcon: 'add', rightPage:Actions.device},
            { key:'message', title:'Message', icon: 'mail', rightIcon: 'add'},
            { key:'user', title:'User', icon: 'account-circle', rightIcon: 'add'}
        ],
    };

    componentDidMount() {
        this.props.initInitialScreen()
        NetInfo.isConnected.addEventListener('connectionChange', this._handleNetworkChange);
        this.props.pullUserData()
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleNetworkChange);
    }

    _handleNetworkChange = isConnected => {
        this.props.updateNetworkStatus(isConnected)
    }

    _handleIndexChange = index => {
        this.setState({ index });
        this.props.updateTabbar(index, this.state.routes[index].title, this.state.routes[index].rightIcon, this.state.routes[index].rightPage)
    }

    _renderScene = BottomNavigation.SceneMap({
        home: HomeRoute,
        iotDevices: IotDevicesRoute,
        message: MessageRoute,
        user: UserRoute
    });

    render(){
        return(
            <View style={{ flex:1 }}>
                <BottomNavigation
                    navigationState={this.state}
                    onIndexChange={this._handleIndexChange}
                    renderScene={this._renderScene}
                />
            </View>
        );
    }
};

const mapStateToProps = ({ nav }) => {
    return {
        nav
    }
}

export default connect(mapStateToProps, { updateNetworkStatus, updateTabbar, initInitialScreen, pullUserData })(HomePage);