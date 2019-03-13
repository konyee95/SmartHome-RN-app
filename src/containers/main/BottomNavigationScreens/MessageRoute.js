import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ActionButton } from '../../../components/common';
import { Actions } from 'react-native-router-flux';

const mic = <Ionicons name="ios-mic" size={24} color="#202020" />
const { height, width } = Dimensions.get('window');

class MessageRoute extends Component{
  render() {
    const { container, userIcon } = styles;
    return (
      <View style={[container]}>
        <Image 
          source={require('../../../images/no-noti.gif')}
          style={[userIcon]}
        />
        <ActionButton 
          propStyle={{ position: 'absolute', bottom: 10, right: 20 }}
          onPress={() => Actions.voiceModal()}
          actionButtonChild={mic} />
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
    width: width * 0.3,
    height: width * 0.3,
    alignItems: 'center',
    marginTop: 24
  }, 
})

export default MessageRoute;