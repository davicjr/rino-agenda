import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import '@fontsource/anton/400.css'
import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import '@fontsource/barlow-condensed/600.css'
import '@fontsource/barlow-condensed/700.css'
import './index.css'
import App from './App'

gsap.registerPlugin(useGSAP)
const cliente = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: true } } })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={cliente}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
