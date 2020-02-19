import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter , Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux'
import './assets/styles/index.css';
import App from './App';
import { createStore, applyMiddleware } from 'redux'
import reducer from './reducers';
import rootSagas from './middleware/sagas';
import Home from './homepage/Home';
import createSagaMiddleware from 'redux-saga'

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

// render the application

render((
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path='/' exact={true} render={(props) => <Home/> } />
                <Route path='/merge' exact={true} render={(props) => <Home mainSection={'merge'} /> } />
                <Route path='/fileSelect' exact={true} render={(props) => <Home mainSection={'fileSelect'} /> } />
            </Switch>
        </BrowserRouter>
    </Provider>
), document.getElementById('root'));