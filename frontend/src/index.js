import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import { GlobalProvider } from './context/globalContext.jsx'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <GlobalProvider>
      <App />
   </GlobalProvider>
);
