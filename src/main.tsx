import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import './index.css'
import App from './App.tsx'

const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: 6,
  defaultRadius: 'md',
  colors: {
    blue: [
      '#eaf4fd',
      '#d3e7fb',
      '#a7cef6',
      '#78b3f0',
      '#529ceb',
      '#398de8',
      '#238be6',
      '#186fbd',
      '#125896',
      '#0b3f6c',
    ],
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} forceColorScheme="light">
      <App />
    </MantineProvider>
  </StrictMode>,
)
