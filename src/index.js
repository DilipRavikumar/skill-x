import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ProfileProvider } from './components/ProfileContext'; // Import ProfileProvider
import { ChakraProvider } from "@chakra-ui/react"; // Import ChakraProvider

ReactDOM.render(
  <React.StrictMode>
    <ProfileProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ProfileProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
