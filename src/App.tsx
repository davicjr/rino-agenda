import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Agenda } from '@/pages/Agenda'

const Admin = lazy(() => import('@/pages/admin/Admin').then((m) => ({ default: m.Admin })))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<Suspense fallback={null}><Admin /></Suspense>} />
        <Route path="*" element={<Agenda />} />
      </Routes>
    </BrowserRouter>
  )
}
