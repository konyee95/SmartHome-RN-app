import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
const { height, width } = Dimensions.get('window');

class AboutSmartHome extends Component {
    render() {
        const { testShit, centerEverything, scrollViewStyle, container, iconStyle, titleContainer, titleStyle, subTitleStyle,
            descriptionContainer, descriptionTitleText, descriptionItem, descriptionIcon, descriptionItemContainer, descriptionItemTitle, descriptionItemText, descriptionText } = styles;
        return (
            <ScrollView style={scrollViewStyle}>
                <View style={[container]}>
                    <Image
                        source={require('../../../images/cpu.png')}
                        style={[iconStyle]} />

                    <View style={[titleContainer, centerEverything]}>
                        <Text style={titleStyle}>SmartHome with DeepEye</Text>
                        <Text style={subTitleStyle}>Real-time AI Surveillance Solution</Text>
                    </View>

                    {/* <View style={[descriptionContainer]}>
                        <Text style={descriptionTitleText}>
                            SmartHome with DeepEye provides a solution that is able to protect your house by intelligently identifying intruders.
                        </Text>
                    </View> */}

                    <View style={[descriptionContainer]}>
                        <View style={descriptionItem}>
                            <Image
                                source={require('../../../images/cctv.png')}
                                style={[descriptionIcon]} />
                            <View style={[descriptionItemContainer]}>
                                <Text style={descriptionItemTitle}>Live Streaming</Text>
                                <Text style={descriptionItemText}>Video On-Demand streaming allows you to monitor your home in real-time</Text>
                            </View>
                        </View>

                        <View style={descriptionItem}>
                            <Image
                                source={require('../../../images/drone.png')}
                                style={[descriptionIcon]} />
                            <View style={[descriptionItemContainer]}>
                                <Text style={descriptionItemTitle}>Remote Control</Text>
                                <Text style={descriptionItemText}>Control IoT-enabled devices, even if you are towns away</Text>
                            </View>
                        </View>

                        <View style={descriptionItem}>
                            <Image
                                source={require('../../../images/ai2.png')}
                                style={[descriptionIcon]} />
                            <View style={[descriptionItemContainer]}>
                                <Text style={descriptionItemTitle}>Artificial Intelligence</Text>
                                <Text style={descriptionItemText}>Seamless integration with DeepEye, an AI intruder system that alerts you when an intruder is detected</Text>
                            </View>
                        </View>

                        <TouchableWithoutFeedback onPress={() => Actions.trainModel()}>
                            <View style={descriptionItem}>
                                <Image
                                    source={require('../../../images/facial-recognition.png')}
                                    style={[descriptionIcon]} />
                                <View style={[descriptionItemContainer]}>
                                    <Text style={descriptionItemTitle}>Face Recognition</Text>
                                    <Text style={descriptionItemText}>Build your own face recognition model with DeepEye</Text>
                                    <Text style={[descriptionItemText, { fontWeight: 'bold' }]}>Tap here to train your model.</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </ScrollView>
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
    scrollViewStyle: {
        flex: 1, 
        backgroundColor: '#fff'
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
        marginTop: 24,
        fontSize: 22,
        fontWeight: "800",
        letterSpacing: 0.5,
        textAlign: 'center'
    },
    subTitleStyle: {
        marginTop: 4,
        fontSize: 14,
        textAlign: 'center'
    },
    descriptionContainer: {
        width: width*0.85,
        marginTop: 30
    },
    descriptionText: {
        fontSize: 18,
        fontWeight: "500",
        textAlign: 'justify'
    },
    descriptionItem: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 20
        // alignItems: 'center'
    },
    descriptionIcon: {
        flex: .15,
        width: width * 0.12,
        height: width * 0.12,
        alignSelf: 'flex-start',
        marginTop: 5
    },
    descriptionItemContainer: {
        flex: .85,
        paddingLeft: 20
    },
    descriptionItemTitle: {
        fontSize: 18,
        fontWeight: "700"
    },
    descriptionItemText: {
        fontSize: 14,
    },
    descriptionText: {
        paddingLeft: 20
    }
})

export default AboutSmartHome;