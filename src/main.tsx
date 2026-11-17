import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import '@fontsource/anton/400.css'
import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import '@fontsource/barlow-condensed/600.css'
import '@fontsource/barlow-condensed/700.css'
import 'react-day-picker/style.css'
import './index.css'
import './calendario.css'
import App from './App'

gsap.registerPlugin(useGSAP)
const cliente = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: true } } })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={cliente}>
      <App />
      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{ style: { background: 'var(--color-carvao-4)', border: 'none', color: 'var(--color-carvao-12)', fontFamily: 'var(--font-sans)', fontSize: '1rem' } }}
      />
    </QueryClientProvider>
  </StrictMode>,
)
