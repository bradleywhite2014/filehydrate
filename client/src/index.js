import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import './assets/styles/index.css';
import App from './App';
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducer from './reducers';
import rootSagas from './middleware/sagas';
import Home from './homepage/Home';
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
   reducer,
   applyMiddleware(sagaMiddleware),
);
sagaMiddleware.run(rootSagas);

// render the application

render((
    <BrowserRouter>
    <Provider store={store}>
        <Home/>
    </Provider>
    </BrowserRouter>
), document.getElementById('root'));