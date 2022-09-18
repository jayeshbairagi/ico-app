import App from './App'
import React from 'react'
import { createRoot } from 'react-dom/client';

import './web3Init'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

createRoot(document.getElementById('root')).render(<App />);
registerServiceWorker();
