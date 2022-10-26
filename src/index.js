import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './App.css';

import { BrowserRouter } from 'react-router-dom'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <header className="App-header">
          <h1>Shirly04</h1>
      </header>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
