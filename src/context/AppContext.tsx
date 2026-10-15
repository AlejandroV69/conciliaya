import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Store, Product, Order, CartItem, CustomerInfo, PaymentReport } from '../types'
import { initialStore, initialProducts, initialOrders } from '../data/mockData'

interface AppContextType {
  // Store
  store: Store
  updateStore: (updated: Partial<Store>) => void
  updateBcvRate: (newRate: number) => void

  // Products
  products: Product[]
  addProduct: (product: Omit<Product, 'id' | 'storeId'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  toggleProductActive: (id: string) => void
  deleteProduct: (id: string) => void

  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  cartTotalUSD: number
  cartTotalBs: number

  // Orders & Anti-Fraud
  orders: Order[]
  createOrder: (customer: CustomerInfo, paymentReport: PaymentReport) => Order
  verifyOrder: (orderId: string) => void
  rejectOrder: (orderId: string, reason?: string) => void
  getOrderById: (orderId: string) => Order | undefined

  // Auth (Merchant Portal)
  isAuthenticated: boolean
  user: { email: string; name: string } | null
  login: (email: string, pass: string) => boolean
  register: (name: string, email: string, storeName: string, slug: string) => boolean
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const STORE_KEY = 'conciliaya_store'
const PRODUCTS_KEY = 'conciliaya_products'
const ORDERS_KEY = 'conciliaya_orders'
const AUTH_KEY = 'conciliaya_auth'

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or mock
  const [store, setStore] = useState<Store>(() => {
    const saved = localStorage.getItem(STORE_KEY)
    return saved ? JSON.parse(saved) : initialStore
  })

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(PRODUCTS_KEY)
    return saved ? JSON.parse(saved) : initialProducts
  })

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(ORDERS_KEY)
    return saved ? JSON.parse(saved) : initialOrders
  })

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(AUTH_KEY)
    return saved ? JSON.parse(saved) : true // Inicia en true por conveniencia de preview
  })

  const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
    return isAuthenticated ? { email: 'admin@thorgurt.com', name: 'Thorgurt Admin' } : null
  })

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
  }, [store])

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(isAuthenticated))
  }, [isAuthenticated])

  // Store actions
  const updateStore = (updated: Partial<Store>) => {
    setStore(prev => ({ ...prev, ...updated }))
  }

  const updateBcvRate = (newRate: number) => {
    const now = new Date()
    const timeStr = `Hoy a las ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    setStore(prev => ({
      ...prev,
      bcvRate: newRate,
      bcvRateLastUpdated: timeStr
    }))
  }

  // Product actions
  const addProduct = (newProd: Omit<Product, 'id' | 'storeId'>) => {
    const product: Product = {
      ...newProd,
      id: `prod_${Date.now()}`,
      storeId: store.id
    }
    setProducts(prev => [product, ...prev])
  }

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)))
  }

  const toggleProductActive = (id: string) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, active: !p.active } : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartTotalUSD = cart.reduce((sum, item) => sum + item.product.priceUSD * item.quantity, 0)
  const cartTotalBs = Number((cartTotalUSD * store.bcvRate).toFixed(2))

  // Order & Antifraud actions
  const createOrder = (customer: CustomerInfo, paymentReport: PaymentReport): Order => {
    const orderNum = `CY-${Math.floor(1000 + Math.random() * 9000)}`
    const totalUSD = cartTotalUSD
    const totalBs = Number((totalUSD * store.bcvRate).toFixed(2))

    // Anti-fraud check: Check if reference already exists in previous orders
    const cleanedRef = paymentReport.referenceNumber.trim()
    const duplicateOrder = orders.find(
      o => o.paymentReport.referenceNumber.trim().toLowerCase() === cleanedRef.toLowerCase()
    )

    const isFraudAlert = Boolean(duplicateOrder)
    const fraudAlertReason = duplicateOrder
      ? `⚠️ ALERTA ANTIFRAUDE: La referencia "${cleanedRef}" ya fue registrada previamente en la orden ${duplicateOrder.orderNumber} por ${duplicateOrder.customer.fullName}.`
      : undefined

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      storeId: store.id,
      createdAt: new Date().toISOString(),
      customer,
      items: [...cart],
      totalUSD,
      totalBs,
      bcvRateUsed: store.bcvRate,
      paymentReport,
      status: 'pending',
      isFraudAlert,
      fraudAlertReason
    }

    setOrders(prev => [newOrder, ...prev])
    clearCart()
    return newOrder
  }

  const verifyOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'verified',
              verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              reviewedBy: user?.name || 'Comerciante'
            }
          : ord
      )
    )
  }

  const rejectOrder = (orderId: string, reason?: string) => {
    setOrders(prev =>
      prev.map(ord =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'rejected',
              notes: reason || 'Pago no conciliado / Comprobante inválido'
            }
          : ord
      )
    )
  }

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId || o.orderNumber === orderId)
  }

  // Auth actions
  const login = (email: string) => {
    setIsAuthenticated(true)
    setUser({ email, name: store.name + ' Admin' })
    return true
  }

  const register = (name: string, email: string, storeName: string, slug: string) => {
    setIsAuthenticated(true)
    setUser({ email, name })
    updateStore({ name: storeName, slug: slug.toLowerCase().replace(/\s+/g, '-') })
    return true
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AppContext.Provider
      value={{
        store,
        updateStore,
        updateBcvRate,
        products,
        addProduct,
        updateProduct,
        toggleProductActive,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotalUSD,
        cartTotalBs,
        orders,
        createOrder,
        verifyOrder,
        rejectOrder,
        getOrderById,
        isAuthenticated,
        user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
