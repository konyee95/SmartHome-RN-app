import React from 'react';
import { View, Text, TouchableOpacity  } from 'react-native';

const deviceWidth = require('Dimensions').get('window').width;
const deviceHeight = require('Dimensions').get('window').height;

const ActionButton = ({ propStyle, onPress, actionButtonChild, actionButtonText  }) => {
  const { centerEverything, datePickerStyle, bitOfShadow, buttonText } = styles;
  return(
    <View style={[centerEverything, propStyle]}>
      <TouchableOpacity 
        style={[datePickerStyle, centerEverything, bitOfShadow]}
        onPress={onPress}>
        {actionButtonChild}
      </TouchableOpacity>
      <Text style={buttonText}>{actionButtonText}</Text>
    </View>
  )
}

const styles = {
  centerEverything: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerStyle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#fff'
  },
  bitOfShadow: {
    shadowColor: '#D3D3D3',
    shadowRadius: 20,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1
  },
  buttonText: {
    fontSize: 12,
    paddingTop: 6,
    backgroundColor: 'transparent'
  },
}

export { ActionButton };
