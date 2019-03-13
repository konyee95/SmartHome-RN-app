import React, { Component } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import firebase from 'react-native-firebase';
import Router from './Router';
import store from './store';

class App extends Component {

    componentWillMount() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyAjPecAPuJanZncREETb9lBgfuzmlJB7nk",
                authDomain: "deepeye-200003.firebaseapp.com",
                databaseURL: "https://deepeye-200003.firebaseio.com",
                projectId: "deepeye-200003",
                storageBucket: "deepeye-200003.appspot.com",
                messagingSenderId: "137630638142"
            });
        }
    }

    render(){
        return(
            <Provider store={store}>
                <PaperProvider>
                    <Router />
                </PaperProvider>     
            </Provider>
        );
    }
}

export default App;