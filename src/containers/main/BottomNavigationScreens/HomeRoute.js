import React, { Component } from 'react';
import { 
  ActivityIndicator,
  Dimensions, 
  Text, 
  TouchableOpacity,
  View, 
  WebView, 
  StyleSheet 
} from 'react-native';

import { connect } from 'react-redux';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph, Switch } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ActionButton } from '../../../components/common';
import { Actions } from 'react-native-router-flux';

const mic = <Ionicons name="ios-mic" size={24} color="#202020" />
const { width, height } = Dimensions.get('window');

class HomeRoute extends Component {

  constructor(props) {
    super(props)
    this.state = {
      uri: "http://175.138.164.43:8080/stream/video.mjpeg",
      loaded: false,
      loading: false,
      deviceLocation: "Living Room",
      visible: false,
      error: ""
    }
  }

  renderFrames() {
    return (
      `
        <html style="margin: 0;">
          <body style="margin: 0;">
            <img 
              src=${this.state.uri} 
              style="width: 100%; height: 100%;" />
          </body>
        </html>
      `
    )
  }

  _showDialog = error => this.setState({ visible: true, error });
  _hideDialog = () => this.setState({ visible: false })

  renderError = () => {
    const { visible } = this.state;
    return (
      <View>
        <Dialog
          visible={visible}
          onDismiss={this._hideDialog}>
          <DialogTitle>Oops</DialogTitle>
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

  onLoadStart = () => this.setState({ loading: false })

  onLoadEnd = () => this.setState({ loading: true })

  renderTrafficLight = () => {
    const { trafficLightOn, trafficLightLoading, trafficLightOff } = styles;
    const { loaded, loading } = this.state;
    if (loading === true) {
      return trafficLightOn
    } else if (loaded === false && loading === false) {
      return trafficLightOff
    } else if (loaded === true && loading === false) {
      return trafficLightLoading
    }
  }

  renderHeader = () => {
    const { spaceBetween, transclucentBackground, headerContainer, headerStyle, trafficLight } = styles;
    return (
      <View style={[headerContainer, spaceBetween, transclucentBackground]}>
        <Text style={headerStyle}>{this.state.deviceLocation}</Text>
        <View style={[trafficLight, this.renderTrafficLight()]} />
      </View>
    )
  }

  renderLoading = () => {
    const { centerEverything, videoStyle, transclucentBackground } = styles;
    return (
      <View style={[centerEverything, videoStyle, transclucentBackground]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  renderWebView = () => {
    const { videoStyle, transclucentBackground } = styles;
    return (
      <View style={[videoStyle, transclucentBackground]}>
        <WebView
          scrollEnabled={false}
          scalesPageToFit={true}
          startInLoadingState={true}
          allowsInlineMediaPlayback={true}
          renderLoading={this.renderLoading}
          automaticallyAdjustContentInsets={true}
          onLoadStart={this.onLoadStart}
          onLoadEnd={this.onLoadEnd}
          ref={webView => this.webView = webView}
          source={{ html: this.renderFrames(), baseUrl: "/" }}
        />
      </View>
    )
  }

  /* dynamically returns toggle button icon */
  renderToggleButtonIcon = () => {
    const { loaded, loading } = this.state;
    if (loading === true) {
      return "pause"
    } else if (loaded === false && loading === false) {
      return "play-arrow"
    } else if (loaded === true && loading === false) {
      return "graphic-eq"
    }
  }

  /* make sure there is internet connection before streaming */
  renderToggleButton = () => {
    if (this.props.app.networkStatus === true) {
      this.setState({ loaded: !this.state.loaded, loading: !this.state.loading })
    } else {
      this._showDialog("Please make sure internet connection is available!")
    }
  }

  renderControlPanelContainer = () => {
    const { spaceBetween, controlPanelContainer, transclucentBackground } = styles;
    return (
      <View style={[controlPanelContainer, transclucentBackground, spaceBetween]}>
        <TouchableOpacity onPress={this.renderToggleButton}>
          <Icon 
            size={28} 
            color="grey"
            name={this.renderToggleButtonIcon()} />
        </TouchableOpacity>
      </View>
    )
  }

  renderVideoStream() {
    const { centerEverything, videoContainer, videoStyle, transclucentBackground } = styles;
    return (
      <View style={[videoContainer]}>
        {this.renderHeader()}

        {this.state.loaded === true ? this.renderWebView() :
          <View style={[videoStyle, centerEverything, transclucentBackground]}>
            <Text>Press play button below to load video</Text>
          </View>
        }

        {this.renderControlPanelContainer()}
      </View>
    )
  }

  render() {
    const { container } = styles;
    return (
      <View style={[container]}>
        {this.renderError()}
        {this.renderVideoStream()}
        <ActionButton 
          propStyle={{ position: 'absolute', bottom: 10, right: 20 }}
          onPress={() => Actions.voiceModal()}
          actionButtonChild={mic} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  testShit: {
    borderWidth: 2,
    borderColor: 'red'
  },
  centerEverything: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'#EDEDED'
  },
  transclucentBackground: {
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'white',
    shadowColor: 'silver',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  videoContainer: {
    flex: 0.5,
    width: width*0.9,
    marginTop: 20
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerContainer: {
    minHeight: height*0.08,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  headerStyle: {
    fontSize: 20,
    fontWeight: "800",
  },
  trafficLight: {
    height: 20,
    width: 20,
    borderRadius: 30,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  trafficLightOn: {
    backgroundColor: "lime",
  },
  trafficLightLoading: {
    backgroundColor: "orange",
  },
  trafficLightOff: {
    backgroundColor: "red",
  },
  videoStyle: {
    height: height*0.26,
  },
  controlPanelContainer: {
    minHeight: height*0.08,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
})

const mapStateToProps = ({ app }) => {
  return {
    app
  }
}

export default connect(mapStateToProps, null)(HomeRoute);