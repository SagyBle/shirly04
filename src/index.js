import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './App.css';

import { BrowserRouter } from 'react-router-dom'

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <header className="App-header">
          <h1>Shirly04</h1>
      </header> */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
