import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import UserContext from './context/UserContext'
import './index.css';

ReactDOM.render(
    <UserContext>
        <App />
    </UserContext>
    , document.getElementById('root'));
