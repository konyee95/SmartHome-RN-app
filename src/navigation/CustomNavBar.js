import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import Icon from "react-native-vector-icons/MaterialIcons";

class CustomNavBar extends Component {

  renderTitle() {
    return (
      <View>
        <Text style={styles.navbarTitle}>{this.props.nav.navbarTitle}</Text>
      </View>
    )
  }

  renderRightButton() {
      return (
        <TouchableOpacity onPress={this.props.nav.navbarPage}>
            <Icon name={this.props.nav.navbarIcon} size={28} color="grey" />
        </TouchableOpacity>
      )
  }

  render() {
    return (
        <View style={[styles.container]}>
          {this.renderTitle()}
          {this.renderRightButton()}
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 88,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff'
  },
  navbarTitle: {
      fontSize: 28,
      fontWeight: "800"
  }
})

const mapStateToProps = ({ nav }) => {
    return {
        nav
    }
}

export default connect(mapStateToProps, null)(CustomNavBar)