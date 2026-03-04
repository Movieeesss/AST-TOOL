import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import AstTool from './AstTool';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <AstTool />
  </React.StrictMode>,
);