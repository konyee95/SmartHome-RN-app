'use strict';
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, Image, Slider, TouchableWithoutFeedback } from 'react-native';
import { Switch } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import { toggleLightbulb } from '../../../actions';
import { connect } from 'react-redux';

const deviceWidth = require('Dimensions').get('window').width;
const deviceHeight = require('Dimensions').get('window').height;

class DeviceItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            brightness: this.props.device.item.brightness,
            toggling: this.props.device.item.toggling
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.toggling !== nextProps.device.item.toggling) {
            this.setState({ toggling: false })
        }
    }

    toggleDevice = () => {
        this.setState({ toggling: true })
        const { email, password, bulbName, bulbState, brightness } = this.props.device.item;
        this.props.toggleLightbulb(email, password, bulbName, 1-bulbState, brightness)
    }

    updateBrightness = brightness => {
        this.setState({ brightness })
        const { email, password, bulbName, bulbState } = this.props.device.item;
        this.props.toggleLightbulb(email, password, bulbName, bulbState, brightness)
    }

    render() {
        const {  email, password, bulbName, bulbState, bulbLocation, brightness } = this.props.device.item;
        const { testShit, centerEverything, container, imageContainer, iconImageStyle, contentContainer, rowContainer, 
            textContainer, deviceTitle, deviceLocation, sliderStyle, brightnessText } = styles;
        return (
            <TouchableWithoutFeedback>
                <View style={[container, centerEverything]}>
                    <View style={[imageContainer, centerEverything]}>
                        <Image
                            source={require('../../../images/bulb.png')}
                            style={[iconImageStyle]}
                        />
                    </View>
                
                    <View style={contentContainer}>
                        <View style={[rowContainer]}>
                            <View style={textContainer}>
                                <Text style={[deviceTitle]}>{bulbName}</Text>
                                <Text style={[deviceLocation]}>{bulbLocation}</Text>
                            </View>
                            
                            {this.state.toggling === false ?
                                <Switch
                                    value={bulbState === 0 ? false : true}
                                    onValueChange={() => this.toggleDevice()}
                                    color = '#00cc00'
                                /> : 
                                <ActivityIndicator style={{ paddingRight: 14 }} />
                            }
                        </View>

                        <View style={[rowContainer]}>
                            <Slider 
                                step={1}
                                minimumValue={0}
                                maximumValue={100}
                                value={brightness}
                                style={[sliderStyle]}
                                // maximumTrackTintColor='transparent'
                                // minimumTrackTintColor='transparent'
                                disabled={bulbState === 0 ? true : false}
                                onSlidingComplete={brightness => this.updateBrightness(brightness)}
                            />
                            <Text style={brightnessText}>{this.state.brightness}</Text>
                        </View>  
                    </View> 
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = {
    testShit: {
        borderWidth: 1,
        borderColor: 'red'
    },
    centerEverything: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        width: deviceWidth * 0.9,
        height: 100,
        borderRadius: 5,
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        shadowColor: 'silver',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    imageContainer: {
        flex: .2
    },
    iconImageStyle: {
        width: 45,
        height: 45
    },
    contentContainer: {
        flex: .8
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textContainer: {

    },
    deviceTitle: {
        textAlign: 'left',
        backgroundColor: 'transparent',
        fontSize: 20,
        fontWeight: "800",
        // letterSpacing: 1,
    },
    deviceLocation: {
        fontSize: 14,
        // fontFamily: 'HelveticaNeue-Light',
        // letterSpacing: 1,
    },
    sliderStyle: {
        width: deviceWidth*0.45,
    },
    brightnessText: {
        paddingRight: 14
    }
}

export default connect(null, { toggleLightbulb })(DeviceItem);
