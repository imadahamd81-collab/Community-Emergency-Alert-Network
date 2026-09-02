import { JSDOM } from 'jsdom'
import { act } from 'react-dom/test-utils'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './src/redux/slices/authSlice'
import App from './src/App.jsx'

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:5173',
  runScripts: 'dangerously',
  resources: 'usable',
})

global.document = dom.window.document
global.window = dom.window
global.navigator = dom.window.navigator

const store = configureStore({
  reducer: { auth: authReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})

const container = document.getElementById('root')
const root = createRoot(container)

try {
  act(() => {
    root.render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    )
  })
  console.log('SUCCESS: React app rendered without errors')
  console.log('HTML:', container.innerHTML.substring(0, 500))
} catch (error) {
  console.error('ERROR: React app failed to render:', error.message)
  process.exit(1)
}
