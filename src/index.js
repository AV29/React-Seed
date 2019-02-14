import 'babel-polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/App';
import ContextProvider from './components/context-provider/ContextProvider';
import './styles/styles.less';

ReactDOM.render(
  <ContextProvider>
    <App/>
  </ContextProvider>,
  document.getElementById('application-root')
);
