import { createRoot } from 'react-dom/client'
import './index.css'
// import { SocketProvider } from './context/socket/socketContext.tsx'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { GoogleOAuthProvider } from '@react-oauth/google'

console.log("hai",import.meta.env.VITE_My_name);

createRoot(document.getElementById('root')!).render(
  

  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID }>
        <App />


    </GoogleOAuthProvider>

  </Provider>
  
)
