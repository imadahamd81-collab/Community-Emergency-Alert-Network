import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { store } from './redux/store'
import App from './App.jsx'
import ErrorBoundary from './components/common/ErrorBoundary'
import './index.css'

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
          <Toaster position="top-right" richColors closeButton />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
