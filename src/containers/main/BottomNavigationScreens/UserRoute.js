import React, { Component } from 'react';
import { 
    Alert,
    Dimensions, 
    Image, 
    TouchableOpacity,
    StyleSheet, 
    Text, 
    View 
} from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { signOut } from '../../../actions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ActionButton } from '../../../components/common';
import { Actions } from 'react-native-router-flux';

const mic = <Ionicons name="ios-mic" size={24} color="#202020" />

const { height, width } = Dimensions.get('window');

class UserRoute extends Component {

    componentDidMount() {
        console.log(this.props.auth)
    }

    signOut = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure?",
            [
                {text: "Maybe later", onPress: () => console.log('Sign out cancel'), style: 'cancel'},
                {text: 'Sure', onPress: () => this.props.signOut()},
            ]
        )
    }

    render() {
        const { testShit, centerEverything, container, itemStyle, userContainer, userImageContainer, userInfoContainer, userNameStyle, rpiLocationStyle, 
            settingsContainer, settingText, contentContainer, leftContentContainer, userIcon, iconStyle, textStyle, actionIconStyle } = styles;
        return (
            <View style={[container]}>
                <View style={[userContainer, itemStyle, centerEverything]}>
                    <View style={[userImageContainer, centerEverything]}>
                        <Image
                            source={require('../../../images/users.png')}
                            style={[userIcon]} />
                    </View>
                    <View style={[userInfoContainer]}>
                        <Text style={userNameStyle}>{this.props.auth.username}</Text>
                        <Text style={rpiLocationStyle}>{this.props.auth.rp_id}</Text>
                    </View>
                </View>

                <Text style={[settingText]}>Setting</Text>
                <View style={[settingsContainer, itemStyle]}>

                    <View style={[contentContainer]}>
                        <View style={leftContentContainer}>
                            <Image
                                source={require('../../../images/mechanical.png')}
                                style={[iconStyle]} />
                            <Text style={[textStyle]}>About SmartHome</Text>
                        </View>
                        <TouchableOpacity onPress={() => Actions.aboutSmartHome()}>
                            <Image
                                source={require('../../../images/right-arrow.png')}
                                style={[actionIconStyle]} />
                        </TouchableOpacity>
                    </View>

                    <View style={[contentContainer]}>
                        <View style={leftContentContainer}>
                            <Image
                                source={require('../../../images/facial-recognition.png')}
                                style={[iconStyle]} />
                            <Text style={[textStyle]}>Train Model</Text>
                        </View>
                        <TouchableOpacity onPress={() => Actions.trainModel()}>
                            <Image
                                source={require('../../../images/right-arrow.png')}
                                style={[actionIconStyle]} />
                        </TouchableOpacity>
                    </View>

                    <View style={[contentContainer]}>
                        <View style={leftContentContainer}>
                            <Image
                                source={require('../../../images/exit.png')}
                                style={[iconStyle]} />
                            <Text style={[textStyle]}>Sign Out</Text>
                        </View>
                        <TouchableOpacity onPress={this.signOut}>
                            <Image
                                source={require('../../../images/right-arrow.png')}
                                style={[actionIconStyle]} />
                        </TouchableOpacity>
                    </View>
                </View>
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
        borderColor: 'red',
        borderWidth: 2
    },
    centerEverything: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#EDEDED',
        alignItems: 'center'
    },
    itemStyle: {
        borderRadius: 5,
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        shadowColor: 'silver',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    userContainer: {
        flexDirection: 'row',
        width: width * 0.9,
        height: 100,
        margin: 10
    },
    userImageContainer: {
        flex: .3
    },
    userIcon: {
        width: 50,
        height: 50,
    },
    userInfoContainer: {
        flex: .7,
    },
    userNameStyle: {
        textAlign: 'left',
        backgroundColor: 'transparent',
        fontSize: 20,
        fontWeight: "800",
    },
    rpiLocationStyle: {
        fontSize: 14,
    },
    settingsContainer: {
        width: width * 0.9,
    },
    settingText: {
        fontSize: 20,
        fontWeight: "800",
        paddingVertical: 10,
        marginLeft: width*0.05,
        alignSelf: 'flex-start'
    },
    contentContainer: {
        height: 60,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    leftContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        width: 30,
        height: 30,
        alignItems: 'center',
        paddingLeft: 10
    },
    textStyle: {
        fontSize: 16,
        fontWeight: "500",
        paddingLeft: 20
    },
    actionIconStyle: {
        width: 30,
        height: 30,
        justifyContent: 'flex-end',
    }
})

const mapStateToProps = ({ auth }) => {
    return {
        auth
    }
}

export default connect(mapStateToProps, { signOut }) (UserRoute);