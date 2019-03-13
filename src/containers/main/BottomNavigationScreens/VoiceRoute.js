import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper';
const { height, width } = Dimensions.get('window');
import Voice from 'react-native-voice';

class VoiceRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart(e) {
    console.log('s')
    this.setState({
      started: '√',
    });
  }

  onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  }

  onSpeechResults(e) {
    console.log(e.value)
    this.setState({
      results: e.value,
    });
  }

  onSpeechEnd(e) {
    console.log('end')
    this.setState({
      end: '√',
    });
  }

  async _startRecognizing(e) {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: ''
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
    } catch (e) {
      console.error(e);
    }
  }
  render() {
    const { container, iconStyle, textStyle, buttonStyle } = styles;
    return (
      <View style={[container]}>
        <TouchableOpacity onPress={this._startRecognizing.bind(this)}>
          <Image
            source={require('../../../images/microphone-black-shape.png')}
            style={[buttonStyle]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this._stopRecognizing.bind(this)}>
          <Image
            source={require('../../../images/microphone-off.png')}
            style={[buttonStyle]} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'white'
  },
  iconStyle: {
    width: width * 0.75,
    height: width * 0.75,
    alignItems: 'center',
    marginTop: 24
  },
  textStyle: {
    paddingTop: 18,
    paddingLeft: 10,
    fontWeight:'800',
    fontSize: 18,
    width: width * 0.75,
    textAlign: 'center',
    color: '#2bbd7e',
    letterSpacing: 0.4
  },
  buttonStyle: {
    width: 30,
    height: 30,
    justifyContent: 'flex-end',
}
})

export default VoiceRoute;