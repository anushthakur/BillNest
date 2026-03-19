import { StrictMode } from 'react'
import {Provider} from "react-redux";
import {store} from "./redux/store";
import ReactDOM from 'react-dom/client'
import App from './App';
import React from 'react';
import './styles/custom.css';


ReactDOM.createRoot(document.getElementById('root')).render(   
    <Provider store={store}>
      <App />
    </Provider>
);


