import React, { Component } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';


class SplashScreen extends Component{
    
    componentDidMount() {
        this.props.checkFirebaseAuth()
    }

    render(){
        return(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    return{
        auth
    }
}

export default connect(mapStateToProps, actions)(SplashScreen);