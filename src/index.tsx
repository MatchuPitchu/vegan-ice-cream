import React from 'react';
import ReactDOM from 'react-dom';
import Context from './context/Context';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Context>
      <App />
    </Context>
  </React.StrictMode>,
  document.getElementById('root')
);