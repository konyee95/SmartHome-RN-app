import React, { Component } from 'react';
import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Moment from 'moment';
import { connect } from 'react-redux';
import { toggleLightbulb, clearUpdateDeviceErrorMessage } from '../../actions';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Voice from 'react-native-voice';
var Spinner = require('react-native-spinkit');

import { ActionButton } from '../../components/common';
const { height, width } = Dimensions.get('window');
const mic = <Ionicons name="ios-mic" size={24} color="#202020" />


class VoiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recognized: false,
      error: '',
      end: false,
      started: false,
      results: ["Switch on the lights in bedroom"],
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.device.updateDeviceError !== nextProps.device.updateDeviceError) {
      if (nextProps.device.updateDeviceError !== "") {
        this.witError(nextProps.device.updateDeviceError)
      }
    }
    // this.witError(nextProps.device.updateDeviceError)
  }

  onSpeechStart(e) {
    this.setState({
      started: true,
    });
  }

  onSpeechRecognized(e) {
    this.setState({
      recognized: true,
    });
  }

  onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
  }

  onSpeechEnd(e) {
    this.setState({
      end: true,
      started: null,
    });
  }

  async _startRecognizing(e) {
    this.props.clearUpdateDeviceErrorMessage()
    this.setState({
      recognized: false,
      error: '',
      results: [],
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  async _stopRecognizing(e) {
    try {
      await Voice.stop();
      this.formatRequest(this.state.results[0]);
    } catch (e) {
      console.error(e);
    }
  }

  formatRequest(requestString) {
    const currentDate = Moment(new Date()).format('YYYYMMDD').toString()
    const query = requestString.replace(/ /g, '%20')
    const headers = {
      'Authorization': 'Bearer X5N5D4VGLJCJGOQBCL4FWFO5T3C65BBT'
    };
    const options = {
      url: 'https://api.wit.ai/message?v=' + currentDate + '&q=' + query,
      headers: headers
    }

    this.fetchWit(options)
  }

  fetchWit(options) {
    fetch(options.url, {
      method: 'POST',
      headers: options.headers
    }).then(res => res.json())
      .then(json => this.processWitResult(json))
      .catch(error => console.log(error))
  }

  processWitResult(result) {
    console.log(result)
    console.log(Object.keys(result.entities).length)
    this.setState({ started: false })
    if (Object.keys(result.entities).length < 3) {
      this.witError("Sorry, something went wrong. Please try again");
    } else {
      if (result.entities.intent[0].value === "device") {
        const deviceLocation = result.entities.device_location[0].value.toLowerCase()
        const deviceState = result.entities.device_state[0].value
        
        for (let i = 0; i < this.props.device.deviceList.length; i++) {
          const bulbLocation = this.props.device.deviceList[i].bulbLocation.toLowerCase()

          if (deviceLocation === bulbLocation) {
            const newBulbState = (deviceState === "on" ? 1 : 0)
            const { email, password, bulbName, brightness } = this.props.device.deviceList[i]
            this.props.toggleLightbulb(email, password, bulbName, newBulbState, brightness)
            this.witSuccess("Ok! It's done!")
          }
        }
      }
    }
  }

  witSuccess = resultString => this.setState({ results: [resultString] })

  witError = resultString => this.setState({ results: [resultString] })

  renderVoiceButton(){
    switch (this.state.started) {
      case false:
        return(
          <ActionButton 
            onPress={this._startRecognizing.bind(this)}
            // onPress={() => {
            //   this.props.clearUpdateDeviceErrorMessage()
            //   this.formatRequest("Switch on the light bulb in the bedroom")
            // }}
            actionButtonChild={mic} />
        )
        break;
      case null:
        return(
          <TouchableOpacity 
            style={styles.spinnerBox}>
            <Spinner 
              isVisible={true} 
              size={60} 
              type="Bounce" 
              color="#202020" />
          </TouchableOpacity>
        )
        break;
      case true:
        return(
          <TouchableOpacity 
            style={styles.spinnerBox}
            onPress={this._stopRecognizing.bind(this)}>
            <Spinner 
              isVisible={this.state.started} 
              size={60} 
              type="ChasingDots" 
              color="#202020" />
          </TouchableOpacity>
        )
      default:
        break;
    }
  }

  render() {
    const { centerEverything, container, voiceTitleContainer, voiceTitle, iconStyle, textStyle, buttonStyle } = styles;
    return (
      <View style={[container]}>
        <View style={[voiceTitleContainer, centerEverything]}>
          <Text style={[voiceTitle]}>Hi, I'm Kola!</Text>
          {this.state.results.map((result, index) => {
            return (
              <Text 
                key={`result-${index}`}
                style={[textStyle]}>
                {result}
              </Text>
            )
          })}
        </View>
        {this.renderVoiceButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerEverything: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'white',
    justifyContent: 'space-around'
  },
  voiceTitleContainer: {
    
  },
  voiceTitle: {
    fontSize: Math.floor(width*0.08),
    fontFamily: 'HelveticaNeue-Light',
    letterSpacing: 2,
    textAlign: 'center'
  },
  iconStyle: {
    width: width * 0.75,
    height: width * 0.75,
    alignItems: 'center',
    marginTop: 24
  },
  textStyle: {
    paddingTop: 28,
    // fontWeight:'600',
    fontSize: 18,
    fontStyle: 'italic',
    width: width * 0.75,
    textAlign: 'center',
    // color: '#2bbd7e',
    letterSpacing: 0.4
  },
  buttonStyle: {
    width: 30,
    height: 30,
    justifyContent: 'flex-end',
  },
  spinnerBox: {
    height: 70,
    width: 70,
  },
})

const mapStateToProps = ({ device }) => {
  return {
    device
  }
}

export default connect(mapStateToProps, { toggleLightbulb, clearUpdateDeviceErrorMessage })(VoiceModal);