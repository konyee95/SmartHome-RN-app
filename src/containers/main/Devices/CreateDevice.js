import React, { Component } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { TextInput, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph } from 'react-native-paper';
import { registerDevice, clearDeviceErrorMessage } from './../../../actions';

const { height, width } = Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard')

class CreateDevice extends Component{
    constructor(props){
        super(props)
        this.state = {
            deviceEmail: 'deepeyeimdc@gmail.com',
            devicePassword: '9508230702',
            deviceName: 'R-Bulb',
            deviceLocation: 'Home',
            visible: false,
            deviceError: '',
            deviceState: 0,
            submitting: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.device.deviceError !== nextProps.device.deviceError) {
            if (nextProps.device.deviceError !== "") {
                this._showDialog(nextProps.device.deviceError)
            }
        }
    }

    _showDialog = deviceError => this.setState({ visible: true, deviceError, submitting: false });
    _hideDialog = () => {
        this.setState({ visible: false })
        this.props.clearDeviceErrorMessage()
    }

    validateEmail = email => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email);
    };


    processRegisterDevice = () => {
        const { deviceEmail, devicePassword, deviceName , deviceState, deviceLocation } = this.state;
        if (deviceEmail === '' || devicePassword === '' || deviceName === '' || deviceLocation === '' ) {
            this._showDialog('Please make sure you have filled in all fields')
        } else if (!this.validateEmail(deviceEmail)) {
            this._showDialog('Please make sure you have a proper email.')
        } else {
            this.setState({ submitting: true })
            this.props.registerDevice(deviceEmail, devicePassword, deviceName, deviceState, deviceLocation);
        }
    }

    
    renderError() {
        const { visible } = this.state;
        return (
            <View>
                <Dialog
                    visible={visible}
                    onDismiss={this._hideDialog}>
                    <DialogTitle>Alert</DialogTitle>
                    <DialogContent>
                        <Paragraph>{this.state.deviceError}</Paragraph>
                    </DialogContent>
                    <DialogActions>
                        <Button onPress={this._hideDialog}>Done</Button>
                    </DialogActions>
                </Dialog>
            </View>
        );
    }

    render(){
        const { testShit, container, centerEverything, iconImageStyle, inputContainer, textInputContainer, iconContainer,
            iconInputStyle, textInputStyle, buttonContainer, buttonStyle } = styles;
        return(
            <KeyboardAvoidingView style={[container,centerEverything]} behavior='padding'>
                <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
                    <View style={[centerEverything]}>
                        <Image
                            source={require('../../../images/bulb.png')}
                            style={[iconImageStyle]} />
                    
                        <View style={[inputContainer]}>
                            <View style={[textInputContainer]}> 
                                <View style={[iconContainer]}>
                                    <Image
                                        source={require('../../../images/mail.png')}
                                        style={[iconInputStyle]} />
                                </View>
                                <TextInput 
                                    label=" TP-Link Email Address"
                                    keyboardType="email-address"
                                    placeholder="email@gmail.com"
                                    onChangeText={deviceEmail => this.setState({ deviceEmail })}
                                    value={this.state.deviceEmail}
                                    style={[textInputStyle]}
                                />
                            </View>

                            <View style={[textInputContainer]}> 
                                <View style={[iconContainer]}>
                                    <Image
                                        source={require('../../../images/padlock.png')}
                                        style={[iconInputStyle]} />
                                </View>
                                <TextInput
                                    secureTextEntry 
                                    label="TP-Link Password"
                                    placeholder="password"
                                    onChangeText={devicePassword => this.setState({ devicePassword })}
                                    value={this.state.devicePassword}
                                    style={[textInputStyle]}
                                />
                            </View>

                            <View style={[textInputContainer]}> 
                                <View style={[iconContainer]}>
                                    <Image
                                        source={require('../../../images/bulbInput.png')}
                                        style={[iconInputStyle]} />
                                </View>
                                <TextInput 
                                    label="Bulb Name"
                                    placeholder="My Smart Bulb"
                                    onChangeText={deviceName => this.setState({ deviceName })}
                                    value={this.state.deviceName}
                                    style={[textInputStyle]}
                                />
                            </View>

                            <View style={[textInputContainer]}> 
                                <View style={[iconContainer]}>
                                    <Image
                                        source={require('../../../images/location.png')}
                                        style={[iconInputStyle]} />
                                </View>
                                <TextInput 
                                    label="Location"
                                    placeholder="Living room"
                                    onChangeText={deviceLocation => this.setState({ deviceLocation })}
                                    value={this.state.deviceLocation}
                                    style={[textInputStyle]}
                                />
                            </View>

                            <View style={[centerEverything, buttonContainer]}>
                                <Button 
                                    raised 
                                    color='#3F51B5'
                                    loading={this.state.submitting}
                                    style={[buttonStyle]}
                                    onPress={() => this.processRegisterDevice()}>
                                    Add Device
                                </Button>
                            </View>
                        </View>
                        {this.renderError()}
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    testShit: {
        borderColor:'red',
        borderWidth:2
    },
    container: {
        flex:1,
        backgroundColor:'#fff'
    },
    centerEverything: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconImageStyle:{
        width: 80,
        height: 80,
        alignItems: 'center'
    },
    inputContainer: {
        width,
        paddingHorizontal: 40,
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        flex: .2,
        alignItems: 'center'
    },
    iconInputStyle:{
        width: 30,
        height: 30,
        alignItems: 'center',
    },
    textInputStyle: {
        flex: .8
    },
    buttonContainer: {
        paddingTop: 10
    },
    buttonStyle: {
        borderRadius:30, 
        width: 150
    }
})

const mapStateToProps = ({ device }) => {
    return {
        device
    }
}

export default connect(mapStateToProps, { registerDevice, clearDeviceErrorMessage })(CreateDevice);