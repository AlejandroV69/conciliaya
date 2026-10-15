export interface PaymentMethodConfig {
  pagoMovil: {
    active: boolean
    bank: string
    idNumber: string
    phone: string
    beneficiary: string
  }
  transferencia: {
    active: boolean
    bank: string
    accountNumber: string
    idNumber: string
    beneficiary: string
  }
  usdt: {
    active: boolean
    network: string
    walletAddress: string
  }
}

export interface Store {
  id: string
  name: string
  slug: string
  logo: string
  phone: string
  description?: string
  bcvRate: number
  bcvRateLastUpdated: string
  paymentMethods: PaymentMethodConfig
}

export interface Product {
  id: string
  storeId: string
  name: string
  description: string
  priceUSD: number
  category: string
  image: string
  active: boolean
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CustomerInfo {
  fullName: string
  phone: string
  deliveryAddress: string
  notes?: string
}

export interface PaymentReport {
  method: 'pago_movil' | 'transferencia' | 'usdt'
  referenceNumber: string
  bankOrigin: string
  senderPhone: string
  receiptUrl: string
  reportedAt: string
}

export type OrderStatus = 'pending' | 'verified' | 'rejected'

export interface Order {
  id: string
  orderNumber: string
  storeId: string
  createdAt: string
  customer: CustomerInfo
  items: CartItem[]
  totalUSD: number
  totalBs: number
  bcvRateUsed: number
  paymentReport: PaymentReport
  status: OrderStatus
  isFraudAlert: boolean
  fraudAlertReason?: string
  verifiedAt?: string
  reviewedBy?: string
  notes?: string
}
