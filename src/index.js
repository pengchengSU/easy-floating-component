import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles.css';
import ChartsLayout from "./component/ChartLayout";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChartsLayout />
  </React.StrictMode>
);
