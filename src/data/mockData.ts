import type { Store, Product, Order } from '../types'

export const initialStore: Store = {
  id: 'store_thorgurt_01',
  name: 'Thorgurt Artesanal',
  slug: 'thorgurt',
  logo: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80',
  phone: '+584121234567',
  description: 'Yogurt griego 100% natural, bowls proteicos y toppings premium. Entregas en Caracas.',
  bcvRate: 42.85,
  bcvRateLastUpdated: 'Hoy a las 09:30 AM',
  paymentMethods: {
    pagoMovil: {
      active: true,
      bank: '0102 - Banco de Venezuela',
      idNumber: 'V-26.890.123',
      phone: '04121234567',
      beneficiary: 'Thorgurt Alimentos C.A.'
    },
    transferencia: {
      active: true,
      bank: '0134 - Banesco Banco Universal',
      accountNumber: '0134-0123-45-0123456789',
      idNumber: 'J-50123456-7',
      beneficiary: 'Thorgurt Alimentos C.A.'
    },
    usdt: {
      active: true,
      network: 'Binance Pay / TRC20',
      walletAddress: 'TYd8Vq4LqX87rRk9BfU128HJKmP90qwE41'
    }
  }
}

export const initialProducts: Product[] = [
  {
    id: 'prod_1',
    storeId: 'store_thorgurt_01',
    name: 'Yogurt Griego Tradicional (500g)',
    description: 'Textura cremosa y alto contenido proteico. Sin azúcares añadidos ni conservantes.',
    priceUSD: 4.50,
    category: 'Yogurts',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    active: true,
    inStock: true
  },
  {
    id: 'prod_2',
    storeId: 'store_thorgurt_01',
    name: 'Super Bowl Frutos Rojos & Granola',
    description: 'Base de yogurt griego con fresas silvestres, arándanos, miel de acacia y granola artesanal.',
    priceUSD: 6.00,
    category: 'Bowls',
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=600&q=80',
    active: true,
    inStock: true
  },
  {
    id: 'prod_3',
    storeId: 'store_thorgurt_01',
    name: 'Yogurt Proteico Maracuyá (1 Litro)',
    description: 'Yogurt griego deslactosado con reducción natural de fruta de la pasión (pachita).',
    priceUSD: 8.50,
    category: 'Yogurts',
    image: 'https://images.unsplash.com/photo-1584278860047-22db9ff82bed?auto=format&fit=crop&w=600&q=80',
    active: true,
    inStock: true
  },
  {
    id: 'prod_4',
    storeId: 'store_thorgurt_01',
    name: 'Granola Crunchy Keto (250g)',
    description: 'Mix de almendras tostadas, nueces pecán, semillas de calabaza y chía tostada con canela.',
    priceUSD: 5.00,
    category: 'Toppings',
    image: 'https://images.unsplash.com/photo-1517093157656-b9ec81640778?auto=format&fit=crop&w=600&q=80',
    active: true,
    inStock: true
  },
  {
    id: 'prod_5',
    storeId: 'store_thorgurt_01',
    name: 'Parfait Chocolate Negro & Mantequilla de Maní',
    description: 'Capas de yogurt griego, nibs de cacao orgánico y crema artesanal de cacahuate sin azúcar.',
    priceUSD: 5.50,
    category: 'Bowls',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80',
    active: true,
    inStock: true
  },
  {
    id: 'prod_6',
    storeId: 'store_thorgurt_01',
    name: 'Miel de Abejas de Montaña (300g)',
    description: 'Miel cruda de alta pureza recolectada en los Altos Mirandinos.',
    priceUSD: 4.00,
    category: 'Toppings',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    active: true,
    inStock: true
  }
]

export const initialOrders: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'CY-8921',
    storeId: 'store_thorgurt_01',
    createdAt: '2026-10-15T10:14:00-04:00',
    customer: {
      fullName: 'Valentina Mendoza',
      phone: '0414-9871234',
      deliveryAddress: 'Urb. Las Mercedes, Calle París, Edif. Avila Plaza, Apto 4-B',
      notes: 'Llamar al llegar, timbre dañado'
    },
    items: [
      { product: initialProducts[0], quantity: 2 },
      { product: initialProducts[1], quantity: 1 }
    ],
    totalUSD: 15.00,
    totalBs: 642.75,
    bcvRateUsed: 42.85,
    paymentReport: {
      method: 'pago_movil',
      referenceNumber: '839201',
      bankOrigin: '0102 - Banco de Venezuela',
      senderPhone: '04149871234',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      reportedAt: '10:14 AM'
    },
    status: 'pending',
    isFraudAlert: true,
    fraudAlertReason: '⚠️ ALERTA: La referencia 839201 ya fue utilizada previamente en la orden CY-8400.',
    notes: 'Posible intento de duplicación de comprobante'
  },
  {
    id: 'ord_102',
    orderNumber: 'CY-8920',
    storeId: 'store_thorgurt_01',
    createdAt: '2026-10-15T09:45:00-04:00',
    customer: {
      fullName: 'Carlos Alberto Da Silva',
      phone: '0424-3456789',
      deliveryAddress: 'Chacao, Av. Francisco de Miranda, Torre Cavendes, Piso 6',
      notes: 'Entregar en recepción'
    },
    items: [
      { product: initialProducts[2], quantity: 1 },
      { product: initialProducts[3], quantity: 2 }
    ],
    totalUSD: 18.50,
    totalBs: 792.73,
    bcvRateUsed: 42.85,
    paymentReport: {
      method: 'pago_movil',
      referenceNumber: '445192',
      bankOrigin: '0134 - Banesco',
      senderPhone: '04243456789',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
      reportedAt: '09:47 AM'
    },
    status: 'pending',
    isFraudAlert: false
  },
  {
    id: 'ord_103',
    orderNumber: 'CY-8919',
    storeId: 'store_thorgurt_01',
    createdAt: '2026-10-15T08:30:00-04:00',
    customer: {
      fullName: 'Mariana Rosas',
      phone: '0412-5551234',
      deliveryAddress: 'Los Palos Grandes, 3ra transversal, Res. El Parque',
      notes: 'Dejar con el vigilante si no respondo'
    },
    items: [
      { product: initialProducts[1], quantity: 2 },
      { product: initialProducts[4], quantity: 1 }
    ],
    totalUSD: 17.50,
    totalBs: 749.88,
    bcvRateUsed: 42.85,
    paymentReport: {
      method: 'transferencia',
      referenceNumber: '00918231',
      bankOrigin: '0108 - Banco Provincial',
      senderPhone: '04125551234',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      reportedAt: '08:32 AM'
    },
    status: 'verified',
    isFraudAlert: false,
    verifiedAt: '08:38 AM',
    reviewedBy: 'Admin Thorgurt'
  },
  {
    id: 'ord_100',
    orderNumber: 'CY-8400',
    storeId: 'store_thorgurt_01',
    createdAt: '2026-10-14T16:10:00-04:00',
    customer: {
      fullName: 'Pedro Luis Gonzalez',
      phone: '0416-2223344',
      deliveryAddress: 'El Cafetal, Calle Santa Marta',
    },
    items: [
      { product: initialProducts[0], quantity: 1 }
    ],
    totalUSD: 4.50,
    totalBs: 192.83,
    bcvRateUsed: 42.85,
    paymentReport: {
      method: 'pago_movil',
      referenceNumber: '839201',
      bankOrigin: '0102 - Banco de Venezuela',
      senderPhone: '04162223344',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      reportedAt: '04:15 PM'
    },
    status: 'verified',
    isFraudAlert: false,
    verifiedAt: '04:20 PM'
  }
]
