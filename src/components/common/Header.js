// Import libraries for making a component
import React from 'react';
import { Text, View } from 'react-native';

// Make a component
const Header = (props) => {
    const { textStyle, viewStyle } = styles;

    return (
        <View style = { viewStyle }>
            <Text style = { textStyle }>{props.headerText}</Text>
        </View>
    );
};

const styles = {
    viewStyle:{
        backgroundColor: '#b3ffff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        paddingTop: 15,
        shadowColor:'#000',
        shadowOffset:{
            width: 0,
            height: 20
        },
        shadowOpacity: 0.2,
        elevation:2,
        position:'relative'
    },
    textStyle:{
        fontSize:20
    }
};

//  Make the component available to the other part of the app
export { Header };