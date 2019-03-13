import React, { Component } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
const { height, width } = Dimensions.get('window');

class UploadingScreen extends Component {

    render() {
        const { testShit, centerEverything, container, iconStyle, titleContainer, titleStyle, subTitleStyle, uploadingContainer } = styles;
        return (
          <View style={[container, centerEverything]}>
              <Image
                  source={require('../../../images/cloud-computing.png')}
                  style={[iconStyle]} />

              <View style={[titleContainer, centerEverything]}>

                <View style={[uploadingContainer]}>
                  <Text style={titleStyle}>Uploading</Text>
                  <ActivityIndicator />
                </View>
                  
                <Text style={subTitleStyle}>Please wait while we upload your video to our private server</Text>
              </View>

          </View>
        );
    }
}

const styles = StyleSheet.create({
    testShit: {
        borderColor: 'red',
        borderWidth: 2
    },
    centerEverything: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    iconStyle: {
        width: width * 0.3,
        height: width * 0.3,
        alignItems: 'center',
        marginTop: 24
    },
    titleContainer: {
        width: width*0.9
    },
    titleStyle: {
        fontSize: 22,
        fontWeight: "800",
        letterSpacing: 0.5,
        paddingRight: 10
        // textAlign: 'center'
    },
    subTitleStyle: {
        marginTop: 4,
        fontSize: 14,
        textAlign: 'center'
    },
    uploadingContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 10
    }
})

export default UploadingScreen;