import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

// Public Portal Pages
import { LandingPage } from './pages/public/LandingPage'
import { StoreCatalog } from './pages/public/StoreCatalog'
import { CheckoutPage } from './pages/public/CheckoutPage'

// Merchant Auth Pages
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'

// Merchant Dashboard Pages
import { DashboardLayout } from './components/DashboardLayout'
import { DashboardOverview } from './pages/dashboard/DashboardOverview'
import { ProductsManager } from './pages/dashboard/ProductsManager'
import { BusinessSettings } from './pages/dashboard/BusinessSettings'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* =========================================
              1. EL PORTAL PÚBLICO (Comprador / Cliente)
             ========================================= */}
          {/* Landing Page de Bienvenida / Venta del SaaS */}
          <Route path="/" element={<LandingPage />} />

          {/* Vitrina o Catálogo Público del Comercio */}
          <Route path="/t/:slug" element={<StoreCatalog />} />

          {/* Checkout y Reporte de Pago Antifraude */}
          <Route path="/t/:slug/checkout" element={<CheckoutPage />} />

          {/* =========================================
              2. EL PORTAL PRIVADO (Panel del Comerciante)
             ========================================= */}
          {/* Módulo de Autenticación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Panel de Control Protegido */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Dashboard Principal / Conciliador en Tiempo Real */}
            <Route index element={<DashboardOverview />} />
            {/* Gestor de Catálogo de Productos */}
            <Route path="products" element={<ProductsManager />} />
            {/* Ajustes del Negocio */}
            <Route path="settings" element={<BusinessSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
