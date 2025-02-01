import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'remixicon/fonts/remixicon.css'
import './index.css'
import { UserProvider } from './context/user.context.jsx'

createRoot(document.getElementById('root')).render(
    <UserProvider>
        <App />
    </UserProvider>
)
