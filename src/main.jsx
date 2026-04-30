import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './styles/globals.css'
import App from './App.jsx'
import { store, bootstrapApp } from './app/store'

// Bootstrap the app — loads all persisted state via dataService
// before the first render completes (session, products, orders, cart, pets)
bootstrapApp();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
