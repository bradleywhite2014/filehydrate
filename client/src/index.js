import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter , Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux'
import './assets/styles/index.css';
import { createStore, applyMiddleware } from 'redux'
import reducer from './reducers';
import rootSagas from './middleware/sagas';
import Home from './screens/Home';
import createSagaMiddleware from 'redux-saga'
import LoginCallback from './screens/LoginCallback';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import "regenerator-runtime/runtime";

import ReactGA from 'react-ga';

function initializeReactGA() {
  ReactGA.initialize('UA-163141688-1');
  ReactGA.pageview('/');
}

const sagaMiddleware = createSagaMiddleware();


const saveState = (state) => {
    try {
        let serializedState = JSON.stringify(state);
        localStorage.setItem("documerge_state", serializedState);

    }
    catch (err) {
    }
}

const store = createStore(
   reducer,
   applyMiddleware(sagaMiddleware),
);


store.subscribe(() => {
    //this is just a function that saves state to localStorage
    saveState(store.getState());
}); 

sagaMiddleware.run(rootSagas);

initializeReactGA();

// render the application
render((
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path='/' exact={true} render={(props) => <Home/> } />
                <Route path='/implicit/callback' component={LoginCallback}/>
                <Route path='/merge' exact={true} render={(props) => <Home mainSection={'merge'} /> } />
                <Route path='/fileMerge' exact={true} render={(props) => <Home mainSection={'fileMerge'} /> } />
                <Route path='/apiconfiguration' exact={true} render={(props) => <Home mainSection={'apiconfiguration'} /> } />
                <Route path='/*' exact={true} render={(props) => <Home mainSection={'404'} /> } />
            </Switch>
        </BrowserRouter>
    </Provider>
), document.getElementById('root'));