import React, { Component } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { Title, TextInput, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph } from 'react-native-paper';
import { Card } from '../../components/common';
import { registerUser, clearErrorMessage } from '../../actions';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const { height, width } = Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard')

class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            email: '',
            password: '',
            rp_id: '',
            visible: false,
            error: ''
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.error !== nextProps.error){
            if (nextProps.error !== "") {
                this._showDialog(nextProps.error)
            }
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

    processRegister = () => {
        const { username, email, password, rp_id } = this.state;
        if (username === '' || email === '' || password === '' || rp_id === '') {
            this._showDialog('Please make sure you have filled in all fields')
        } else if (!this.validateEmail(email)) {
            this._showDialog('Please make sure you have a proper email.')
        } else {
            this.props.registerUser(username, email, password, rp_id);
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
        const { testShit, container, centerEverything, iconImageStyle, inputContainer, 
            textInputContainer, iconContainer, iconInputStyle, textInputStyle } = styles;
        return(
            <KeyboardAvoidingView style={[container,centerEverything]} behavior='position'>
                <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
                    <View style={[centerEverything]}>
                        <Image
                            source={require('../../images/house.png')}
                            style={[iconImageStyle]} />

                        <View style={[inputContainer]}>
                            <View style={[textInputContainer]}>
                                <View style={[iconContainer]}>
                                    <Image
                                        source={require('../../images/assistance.png')}
                                        style={[iconInputStyle]} />
                                </View>
                                <TextInput 
                                    label="Username"
                                    placeholder="Username"
                                    autoCapitalize="none"
                                    onChangeText={username => this.setState({ username })}
                                    value={this.state.username}
                                    style={[textInputStyle]}
                                />
                            </View>

                            <View style={[textInputContainer]}>
                                <View style={[iconContainer]}>
                                    <Image
                                        source={require('../../images/mail.png')}
                                        style={[iconInputStyle]} />
                                </View>
                                <TextInput 
                                    label="Email Address"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    placeholder="email@gmail.com"
                                    onChangeText={email => this.setState({ email })}
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
                                    value={this.state.password}
                                    style={[textInputStyle]}
                                />
                            </View>

                            <View style={[textInputContainer]}>
                                <View style={[iconContainer]}>
                                    <Image
                                        source={require('../../images/laptop.png')}
                                        style={[iconInputStyle]} />
                                </View>
                                <TextInput 
                                    label="RaspberryPi ID"
                                    placeholder="rpid0001"
                                    autoCapitalize="none"
                                    onChangeText={rp_id => this.setState({ rp_id })}
                                    value={this.state.rp_id}
                                    style={[textInputStyle]}
                                />
                            </View>
                        </View>

                        <View>
                            <Button raised onPress={() => this.processRegister()} color='#3F51B5' style={{ borderRadius:30, width: 150}}>
                                Create Account
                            </Button>
                        </View>

                        {this.renderError()}
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
    titleStyle: {
        fontSize: 20,
        fontWeight: "800",
        paddingTop: 10
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
    }
})

export default connect(mapStateToProps,{ registerUser, clearErrorMessage })(SignUp);