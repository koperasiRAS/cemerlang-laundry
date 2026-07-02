"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface CartItem {
  id: string | number
  name: string
  priceText: string
  price: number // numeric value for calculation
  image: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity' | 'price'> & { priceText: string }) => void
  removeFromCart: (id: string | number) => void
  updateQuantity: (id: string | number, delta: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const parsePrice = (priceStr: string) => {
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load from local storage if needed, but for now just memory is fine, or simple persistence
  useEffect(() => {
    const saved = localStorage.getItem('cemerlang_cart')
    if (saved) {
      try {
        setCart(JSON.parse(saved))
      } catch (e) {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cemerlang_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: Omit<CartItem, 'quantity' | 'price'> & { priceText: string }) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id)
      if (existing) {
        return prev.map(p => 
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      }
      return [...prev, { 
        ...item, 
        quantity: 1, 
        price: parsePrice(item.priceText) 
      }]
    })
    setIsCartOpen(true) // Automatically open drawer when adding item
  }

  const removeFromCart = (id: string | number) => {
    setCart(prev => prev.filter(p => p.id !== id))
  }

  const updateQuantity = (id: string | number, delta: number) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        const newQ = p.quantity + delta
        return newQ > 0 ? { ...p, quantity: newQ } : p
      }
      return p
    }))
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
