import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter , Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux'
import './assets/styles/index.css';
import { createStore, applyMiddleware } from 'redux'
import reducer from './reducers';
import rootSagas from './middleware/sagas';
import createSagaMiddleware from 'redux-saga'
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import PricingPage from "./views/PricingPage/PricingPage.js";
import MergePage from "./views/MergePage/MergePage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import ProfilePage from "./views/ProfilePage/ProfilePage.js";
import TemplateManagement from "./views/TemplateManagement/TemplateManagement.js";
import APIManagement from "./views/APIManagement/APIManagement.js";

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
        localStorage.setItem("filehydrate_state", serializedState);

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
                <Route path='/' exact={true} render={(props) => <LandingPage/> } />
                <Route path='/merge' exact={true} render={(props) => <MergePage  /> } />
                <Route path='/template_management' exact={true} render={(props) => <TemplateManagement  /> } />
                <Route path='/api_management' exact={true} render={(props) => <APIManagement  /> } />
                <Route path='/profile' exact={true} render={(props) => <ProfilePage  /> } />
                <Route path='/fileMerge' exact={true} render={(props) => <LandingPage /> } />
                <Route path='/pricing' exact={true} render={(props) => <PricingPage /> } />
                <Route path='/apiconfiguration' exact={true} render={(props) => <LandingPage mainSection={'apiconfiguration'} /> } />
                <Route path='/*' exact={true} render={(props) => <LandingPage mainSection={'404'} /> } />
            </Switch>
        </BrowserRouter>
    </Provider>
), document.getElementById('root'));