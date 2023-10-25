import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-intl-redux';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import { createStore, applyMiddleware, compose } from 'redux';
// babel-polyfill should be imported before createSagaMiddleware to provide
// ES6 generators in older browsers like IE 10
import 'babel-polyfill';
import 'element-closest'; // IE closest polyfill
import 'classlist-polyfill'; // IE polyfill
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import logger from './utils/logger';
import rootReducer from './features/app/reducers/reducers';
import { rootSaga } from './features/app/effects/sagas';

import App from './features/app/app';
import '../styles/app.scss';
import messagesEnCA from '../i18n/locales/en-CA.json';
import { setLocale } from './features/app/actions';

const isProduction = process.env.NODE_ENV === 'production';


// Creating store
let store = null;

const initialState = {
  intl: {
    defaultLocale: 'fr-CA',
    locale: 'en-CA',
    messages: messagesEnCA,
  },
};

const sagaMiddleware = createSagaMiddleware();

if (isProduction) {
  // In production adding only saga middleware
  const productionMiddleWares = applyMiddleware(thunk, sagaMiddleware);

  store = createStore(
    rootReducer,
    initialState,
    productionMiddleWares
  );
} else {
  // In development mode beside saga, logger and DevTools are added
  const middleWares = applyMiddleware(thunk, sagaMiddleware, logger);
  let enhancer;

  // Enable DevTools if browser extension is installed
  if (window.__REDUX_DEVTOOLS_EXTENSION__) { // eslint-disable-line
    enhancer = compose(
      middleWares,
      window.__REDUX_DEVTOOLS_EXTENSION__() // eslint-disable-line
    );
  } else {
    enhancer = compose(middleWares);
  }

  store = createStore(
    rootReducer,
    initialState,
    enhancer
  );

}

// Run the sagas
sagaMiddleware.run(rootSaga);

addLocaleData(en);
addLocaleData(fr);

window.setLocale = function (locale) {
  store.dispatch(setLocale(locale));
};

// Render it to DOM
ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
);
