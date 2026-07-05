"use client"

import { useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { ShoppingCart, Search, Filter, MessageCircle } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

export default function KatalogPage() {
  const { addToCart } = useCart()
  const WHATSAPP_NUMBER = "6282138056837"
  
  const handleProductOrder = (productName: string) => {
    const message = `Halo Cemerlang Laundry, saya ingin memesan produk: *${productName}*. Apakah stoknya tersedia?`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }

  const products = [
    {
      id: 1,
      category: 'Sabun Cuci Piring & Tangan',
      name: 'Sabun Cuci Piring (5 Liter)',
      description: 'Angkat kotoran membandel sekejap, lembut di tangan, ramah lingkungan.',
      price: 'Rp 59.500',
      image: '/images/products/sabun-cuci-piring.jpg',
      badge: 'Best Seller',
      size: '5L',
      type: 'Cair'
    },
    {
      id: 2,
      category: 'Sabun Cuci Piring & Tangan',
      name: 'Sabun Cuci Tangan (5 Liter)',
      description: 'Wangi segar, lembut di tangan, mengandung gliserin. Formula lembut & melembapkan.',
      price: 'Rp 59.500',
      image: '/images/products/sabun-cuci-tangan.jpg',
      badge: 'Best Seller',
      size: '5L',
      type: 'Cair'
    },
    {
      id: 3,
      category: 'Pembersih Kaca & Permukaan',
      name: 'Pembersih Kaca / Meja (5 Liter)',
      description: 'Bersih mengkilap, bebas noda, dan mudah digunakan.',
      price: 'Rp 55.000',
      image: '/images/products/s3-pembersih-serbaguna.jpg',
      badge: 'New',
      size: '5L',
      type: 'Cair'
    },
    {
      id: 4,
      category: 'Pembersih Porselin & Kamar Mandi',
      name: 'Porselin (5 Liter)',
      description: 'Pembersih peralatan. Bersih maksimal, menghilangkan noda membandel.',
      price: 'Rp 60.500',
      image: '/images/products/s3-pembersih-kamar-mandi.jpg',
      badge: 'New',
      size: '5L',
      type: 'Cair'
    },
    {
      id: 5,
      category: 'Pembersih Lantai',
      name: 'Pembersih Lantai (5 Liter)',
      description: 'Premium Lavender. Aroma lavender tahan lama, lantai bersih & mengkilap.',
      price: 'Rp 46.000',
      image: '/images/products/s3-pewangi-lantai.jpg',
      badge: 'New',
      size: '5L',
      type: 'Cair'
    }
  ]

  const categories = ['Semua Produk', 'Sabun Cuci Piring & Tangan', 'Pembersih Kaca & Permukaan', 'Pembersih Porselin & Kamar Mandi', 'Pembersih Lantai']
  
  const [activeCategory, setActiveCategory] = useState('Semua Produk')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const toggleFilter = (stateSetter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    stateSetter(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    )
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'Semua Produk' || product.category === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(product.size)
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.type)
    
    return matchesCategory && matchesSearch && matchesSize && matchesType
  })

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary-100 selection:text-primary-900 pb-20">
      <Navbar />
      
      <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-2xl group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm transition-all"
              placeholder="Cari sabun, pewangi, porselin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-10 pb-4 border-b border-gray-200">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
          <button className="px-5 py-2 rounded-full text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 ml-auto">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Filters */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-28">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Filter Berdasarkan</h3>
              
              {/* Size Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-4">Ukuran</h4>
                <div className="space-y-3">
                  {['1L', '5L'].map(size => (
                    <label key={size} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedSizes.includes(size) ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-300 group-hover:border-primary-400'}`}>
                        {selectedSizes.includes(size) && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                      <span className="text-gray-600 group-hover:text-gray-900">{size}</span>
                      <input type="checkbox" className="hidden" checked={selectedSizes.includes(size)} onChange={() => toggleFilter(setSelectedSizes, size)} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">Tipe</h4>
                <div className="space-y-3">
                  {['Cair', 'Serbuk'].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedTypes.includes(type) ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-300 group-hover:border-primary-400'}`}>
                        {selectedTypes.includes(type) && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                      <span className="text-gray-600 group-hover:text-gray-900">{type}</span>
                      <input type="checkbox" className="hidden" checked={selectedTypes.includes(type)} onChange={() => toggleFilter(setSelectedTypes, type)} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
                    <div className="h-56 relative bg-gray-100/80 flex items-center justify-center p-6 mx-3 mt-3 rounded-2xl overflow-hidden">
                      {product.badge && (
                        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-600 text-white shadow-sm">
                          {product.badge}
                        </div>
                      )}
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out" 
                      />
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-[11px] font-bold text-primary-600 mb-1.5 uppercase tracking-wide">{product.category}</span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{product.name}</h3>
                      <p className="text-gray-500 text-xs mb-4 flex-1 line-clamp-2 leading-relaxed">{product.description}</p>
                      
                      <div className="mb-4">
                        <span className="text-gray-900 font-black text-xl">{product.price}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-auto">
                        <button 
                          onClick={() => {
                            addToCart({
                              id: product.id,
                              name: product.name,
                              priceText: product.price,
                              image: product.image
                            })
                            toast.success(`${product.name} dimasukkan ke keranjang!`)
                          }}
                          className="flex-1 bg-primary-600 text-white text-center py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                        >
                          + Keranjang
                        </button>
                        <button 
                          onClick={() => {
                            addToCart({
                              id: product.id,
                              name: product.name,
                              priceText: product.price,
                              image: product.image
                            })
                          }}
                          className="w-11 h-11 border border-gray-200 text-gray-600 rounded-xl flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-colors shrink-0"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Produk tidak ditemukan</h3>
                <p className="text-gray-500">Silakan sesuaikan filter atau kata kunci pencarian Anda.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    setActiveCategory('Semua Produk')
                    setSelectedSizes([])
                    setSelectedTypes([])
                  }}
                  className="mt-6 px-6 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg shadow-green-500/30 hover:scale-105 transition-transform duration-300 flex items-center gap-2 font-medium"
      >
        <MessageCircle className="w-5 h-5" />
        Chat via WhatsApp
      </a>
    </div>
  )
}
