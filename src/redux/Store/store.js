import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

//Main App Reducer.
import reducer from "../Reducer/reducer";

//Root Sage.
import rootSaga from '../Saga/rootSaga';

//Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

//Create store and moute sage on it,
const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware));

//Run the saga
sagaMiddleware.run(rootSaga);

export default store;