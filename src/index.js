// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ProfileProvider } from './components/ProfileContext'; // Import ProfileProvider

ReactDOM.render(
  <React.StrictMode>
    <ProfileProvider>
      <App />
    </ProfileProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
