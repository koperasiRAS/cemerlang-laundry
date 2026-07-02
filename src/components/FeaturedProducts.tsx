"use client"

import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

export default function FeaturedProducts() {
  const { addToCart } = useCart()

  const products = [
    {
      id: 1,
      name: 'Sabun Cuci Piring (5L)',
      description: 'Lembut di tangan, angkat kotoran membandel.',
      price: 'Rp 59.500',
      image: '/images/products/sabun-cuci-piring.jpg',
    },
    {
      id: 2,
      name: 'Sabun Cuci Tangan (5L)',
      description: 'Wangi segar, lembut & melembapkan kulit.',
      price: 'Rp 59.500',
      image: '/images/products/sabun-cuci-tangan.jpg',
    },
    {
      id: 3,
      name: 'Pembersih Kaca (5L)',
      description: 'Bersih mengkilap, bebas noda, dan mudah digunakan.',
      price: 'Rp 55.000',
      image: '/images/products/s3-pembersih-serbaguna.jpg',
    },
    {
      id: 4,
      name: 'Porselin (5L)',
      description: 'Menghilangkan noda membandel maksimal.',
      price: 'Rp 60.500',
      image: '/images/products/s3-pembersih-kamar-mandi.jpg',
    },
    {
      id: 5,
      name: 'Pembersih Lantai (5L)',
      description: 'Aroma lavender tahan lama, lantai bersih & mengkilap.',
      price: 'Rp 46.000',
      image: '/images/products/s3-pewangi-lantai.jpg',
    }
  ]

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      priceText: product.price,
      image: product.image
    })
    toast.success(`${product.name} dimasukkan ke keranjang!`)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {products.map(product => (
        <div key={product.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group">
          <div className="h-56 relative bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              sizes="(max-width: 768px) 100vw, 20vw" 
              className="object-contain group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-4 flex-1">{product.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-black text-base text-primary-600">{product.price}</span>
              <button 
                onClick={() => handleAddToCart(product)}
                className="w-8 h-8 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center transition-colors shrink-0"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
