import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './pages.css'
import './index.css'
import CartProvider from "./context/CartContext";
import CartAnimationProvider from "./context/CartAnimationContext";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <CartProvider>
        <CartAnimationProvider>
          <App />
        </CartAnimationProvider>
        
      </CartProvider>
    
  </StrictMode>,
)
