import React, { Component } from 'react';
import { Dimensions, View, Text, TouchableWithoutFeedback, Image, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { TextInput, Button, Title, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph } from 'react-native-paper';
import { loginUser, clearErrorMessage } from '../../actions';
import { Card, CardSection, Spinner } from '../../components/common';
import { Actions } from 'react-native-router-flux';

const { height, width } = Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard')

class LoginForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: 'admin@smarthome.com',
            password: 'password',
            visible: false,
            error: ''
        }
    }

    componentWillReceiveProps(nextProps){ 
        if(this.props.error !== nextProps.error){
            this._showDialog(nextProps.error)
        }
    }

    _showDialog = error => this.setState({ visible: true, error });
    _hideDialog = () => {
        this.setState({ visible: false })
        this.props.clearErrorMessage()
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email);
      };
    

    onButtonPress() {
        const { email, password } = this.state;

        if (email === '' || password === '') {
            this._showDialog('Please make sure you have filled in email and password.')
        } else if (!this.validateEmail(email)) {
            this._showDialog('Please make sure you have a proper email.')
        } else {
            this.props.loginUser({ email, password });
        }
    }

    renderButton(){
        if(this.props.loading){
            return <Spinner size="large" />;
        }

        return(
            <View style={[styles.buttonContainer]} >
                <Button raised onPress={this.onButtonPress.bind(this)} color='#3F51B5' style={{ borderRadius:30, width: 150}}>
                     Sign In
                 </Button>

                 <Button raised onPress={() => Actions.signUp()} color='#3F51B5' style={{ borderRadius:30, width: 150}}>
                    Sign Up
                </Button>
            </View>
            
        );
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
                            <Paragraph>{this.state.error}</Paragraph>
                        </DialogContent>
                        <DialogActions>
                            <Button onPress={this._hideDialog}>Done</Button>
                        </DialogActions>
                    </Dialog>
                </View>
            );
    }

    render() {
        const { container, centerEverything, iconImageStyle, titleStyle, inputContainer, textInputStyle,
            textInputContainer, iconContainer, iconInputStyle, testShit } = styles;
        return (
            <KeyboardAvoidingView style={[container,centerEverything]} behavior="padding">
                <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
                    <View style={[centerEverything]}>
                        <Image
                            source={require('../../images/house.png')}
                            style={[iconImageStyle]}
                        />

                        <Title style={[titleStyle]}>Smart Home</Title>

                        <View style={[inputContainer]}>
                            <View style={[textInputContainer]}>
                                <View style={[iconContainer]}>
                                    <Image
                                        source={require('../../images/mail.png')}
                                        style={[iconInputStyle]} />
                                </View>
                                <TextInput
                                    label="Email"
                                    keyboardType="email-address"
                                    placeholder="email@gmail.com"
                                    autoCapitalize="none"
                                    onChangeText={email => this.setState({ email })}
                                    underlineColor="black"
                                    value={this.state.email}
                                    style={[textInputStyle]}
                                />
                            </View>

                            <View style={[textInputContainer]}>
                                <View style={[iconContainer]}>
                                    <Image
                                        source={require('../../images/padlock.png')}
                                        style={[iconInputStyle]} />
                                </View>
                                <TextInput
                                    secureTextEntry
                                    label="Password"
                                    placeholder="password"
                                    onChangeText={password => this.setState({ password })}
                                    underlineColor="black"
                                    value={this.state.password}
                                    style={[textInputStyle]} 
                                />
                            </View>
                        </View>

                        {this.renderError()}

                        {this.renderButton()}
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    const { error, loading } = auth;

    return{ error, loading };
};

const styles = StyleSheet.create({
    testShit: {
        borderColor: 'red',
        borderWidth: 2
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    titleStyle: {
        fontSize: 28,
        fontWeight: "800",
        paddingTop: 10
    },
    inputContainer: {
        width,
        paddingHorizontal: 40,
    },
    buttonContainer:{
        flexDirection: 'row',
        paddingTop: 20
    },
    iconImageStyle:{
        width: 150,
        height: 150,
        alignItems: 'center'
    },
    centerEverything:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconContainer: {
        flex: .2,
        alignItems: 'center',
        marginTop: 20
    },
    iconInputStyle:{
        width: 30,
        height: 30,
        alignItems: 'center',
    },
    textInputStyle: {
        flex: .8
    }
})

export default connect(mapStateToProps,{ loginUser, clearErrorMessage })(LoginForm);