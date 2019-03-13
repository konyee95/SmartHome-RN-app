import React, { Component } from 'react';
import { FlatList, Text, View, StyleSheet, Dimensions, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { pullDeviceData, clearUpdateDeviceErrorMessage } from '../../../actions';
import { TextInput, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paragraph } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceItem from '../Devices/DeviceItem';
import { ActionButton } from '../../../components/common';
import { Actions } from 'react-native-router-flux';

const mic = <Ionicons name="ios-mic" size={24} color="#202020" />

class IotDevicesRoute extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      updateDeviceError: ''
    }
  }

  componentWillMount() {
    this.props.pullDeviceData()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.device.updateDeviceError !== nextProps.device.updateDeviceError) {
      if (nextProps.device.updateDeviceError !== "") {
        this._showDialog(nextProps.device.updateDeviceError)
      }
    }
  }

  _showDialog = updateDeviceError => this.setState({ visible: true, updateDeviceError, submitting: false });
  _hideDialog = () => {
    this.setState({ visible: false })
    this.props.clearUpdateDeviceErrorMessage()
  }

  renderError() {
    const { visible } = this.state;
    return (
      <View>
        <Dialog
          visible={visible}
          onDismiss={this._hideDialog}>
          <DialogTitle>Oops</DialogTitle>
          <DialogContent>
            <Paragraph>{this.state.updateDeviceError}</Paragraph>
          </DialogContent>
          <DialogActions>
            <Button onPress={this._hideDialog}>Done</Button>
          </DialogActions>
        </Dialog>
      </View>
    );
  }

  render() {
    const { container, centerEverything } = styles;
    return (
      <View style={[container, centerEverything]}>
        <FlatList
          data={this.props.device.deviceList}
          keyExtractor={device => device.bulbName} 
          renderItem={device => <DeviceItem device={device} />}
        />
        {this.renderError()}
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
      flex:1,
      backgroundColor:'#EDEDED'
  },
  centerEverything: {
      justifyContent: 'center',
      alignItems: 'center'
  }
})

const mapStateToProps = ({ device }) => {
  console.log(device)
  return {
    device
  }
}

export default connect(mapStateToProps, { pullDeviceData, clearUpdateDeviceErrorMessage })(IotDevicesRoute);