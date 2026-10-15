import React, { useState } from 'react'
import { Search, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PublicHeader } from '../../components/PublicHeader'
import { ProductCard } from '../../components/ProductCard'
import { CartDrawer } from '../../components/CartDrawer'

export const StoreCatalog: React.FC = () => {
  const { store, products, cart, setIsCartOpen, cartTotalUSD, cartTotalBs } = useApp()
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filter only active products for the public catalog
  const activeProducts = products.filter(p => p.active)

  // Get unique categories
  const categories = ['Todos', ...Array.from(new Set(activeProducts.map(p => p.category)))]

  // Filtered by category and search
  const filteredProducts = activeProducts.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 md:pb-12">
      {/* Store Header */}
      <PublicHeader />

      {/* Hero / Banner of the Store */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/70 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200/60">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Catálogo Oficial de {store.name}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Productos Frescos & Artesanales
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
                {store.description || 'Haz tu pedido en línea, paga de forma segura en USD o Bolívares y recibe directo en tu puerta.'}
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar en el catálogo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
            <p className="font-bold text-slate-700 text-base">No se encontraron productos</p>
            <p className="text-xs text-slate-400 mt-1">
              Prueba cambiando los filtros de categoría o el término de búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Bar for Mobile when cart has items */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 z-30 md:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-slate-950 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs text-emerald-400 font-semibold">
                  {totalCartCount} {totalCartCount === 1 ? 'producto' : 'productos'}
                </div>
                <div className="text-sm font-black">
                  ${cartTotalUSD.toFixed(2)} / Bs. {cartTotalBs.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 font-bold text-xs bg-emerald-600 px-3 py-2 rounded-xl text-white">
              <span>Ver Pedido</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  )
}
