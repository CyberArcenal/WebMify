// main.tsx (updated)
import ReactDOM from 'react-dom/client'
import './styles/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "reflect-metadata";
import React from 'react';
import ConditionalRouter from './components/Shared/ConditionalRouter';
import App from './routes/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ConditionalRouter>
        <App />
      </ConditionalRouter>
  </React.StrictMode>,
)