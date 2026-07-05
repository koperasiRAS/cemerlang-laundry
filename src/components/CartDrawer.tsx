"use client"

import { useCart } from '@/context/CartContext'
import { X, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import Image from 'next/image'

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart()
  const WHATSAPP_NUMBER = "6282138056837"

  if (!isCartOpen) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  }

  const handleCheckout = () => {
    let message = `Halo Cemerlang Laundry, saya ingin memesan produk berikut:\n\n`
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (${formatPrice(item.price * item.quantity)})\n`
    })
    message += `\n*Total Belanja: ${formatPrice(totalPrice)}*\n\nApakah stoknya tersedia?`
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-none">Keranjang Belanja</h2>
              <p className="text-sm text-gray-500 mt-1">{totalItems} Produk</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
              <ShoppingCart className="w-16 h-16 text-gray-300" />
              <div>
                <p className="text-gray-900 font-medium text-lg">Keranjang masih kosong</p>
                <p className="text-gray-500 text-sm">Yuk, tambah produk kebersihan dulu!</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-2 bg-primary-50 text-primary-600 rounded-full font-medium hover:bg-primary-100 transition-colors"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 relative bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="80px" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-primary-600 font-bold text-sm">
                    {formatPrice(item.price)}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-semibold text-gray-900 text-sm w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 font-medium">Total Harga</span>
              <span className="text-2xl font-black text-gray-900">{formatPrice(totalPrice)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/40 active:scale-[0.98]"
            >
              Checkout via WhatsApp
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Pembayaran akan diproses terpisah oleh kasir kami melalui WhatsApp.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
