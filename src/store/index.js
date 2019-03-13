import { compose, createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import reducers from '../reducers';

const middlewares = [ReduxThunk];

const store = createStore(reducers, {}, compose(applyMiddleware(...middlewares), autoRehydrate()));

persistStore(store, { storage: AsyncStorage })

export default store;