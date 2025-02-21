// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from './GlobalStyles';

// If you use react-slick for carousels:
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <GlobalStyles />
    <App />
  </>
);
