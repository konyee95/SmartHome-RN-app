import React, { Component } from 'react';
import { Dimensions, TouchableOpacity, StyleSheet  } from 'react-native';
import { Actions, Scene, Router }  from 'react-native-router-flux';
import RNShakeEvent from 'react-native-shake-event';

import SplashScreen from './containers/SplashScreen';

import LoginForm from './containers/auth/LoginForm';
import SignUp from './containers/auth/SignUp';

import HomePage from './containers/main/HomePage';
import CreateDevice from './containers/main/Devices/CreateDevice';
import AboutSmartHome from './containers/main/TrainModel/AboutSmartHome';
import TrainModel from './containers/main/TrainModel/TrainModel';
import VoiceModal from './containers/main/VoiceModal.js';
import UploadingScreen from './containers/main/TrainModel/UploadingScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomNavBar from './navigation/CustomNavBar';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class RouterComponent extends Component {
    
    componentWillMount() {
        RNShakeEvent.addEventListener('shake', () => {
            Actions.voiceModal();
        });
    }

    componentWillUnmount() {
        RNShakeEvent.removeEventListener('shake');
    }

    renderBackButton = () => {
        return (
          <TouchableOpacity style={[styles.navBarButton]} onPress={() => Actions.pop()}>
            <Ionicons name="md-arrow-back" size={26} color="#323232" />
          </TouchableOpacity>
        )
    }

    render() {
        return(
            <Router>
                <Scene key="root" hideNavBar>
    
                    <Scene key="splashScreen" component={SplashScreen} />
    
                    <Scene key="auth">
                        <Scene key="login" component={LoginForm} hideNavBar initial />
                        <Scene key="signUp" component={SignUp} title="Create User Account"  renderBackButton={this.renderBackButton} />
                    </Scene>
    
                    <Scene key="main">
                        <Scene 
                            key="home" 
                            component={HomePage} 
                            title="SmartHome"
                            navBar={CustomNavBar} />
                        <Scene key="device" component={CreateDevice} title="Add New Device" />
                        <Scene key="aboutSmartHome" component={AboutSmartHome} title="SmartHome" />
                        <Scene key="trainModel" component={TrainModel} title="Train Model" />
                        <Scene key="voiceModal" schema="modal" component={VoiceModal} direction="vertical" title="Speech Recognition"/>
                        <Scene key="uploadingScreen" component={UploadingScreen} title="Uploading Video" hideNavBar panHandlers={null} />
                    </Scene>
                </Scene>
            </Router>
        );
    }
}

const styles = StyleSheet.create ({
    navBarButton: {
        width: deviceWidth * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
      }
})

export default RouterComponent;