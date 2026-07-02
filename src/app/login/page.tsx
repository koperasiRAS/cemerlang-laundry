'use client';

import { login } from './actions'
import { Droplets } from 'lucide-react'
import { useActionState } from 'react'

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full bg-gray-50/50">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 opacity-90" />
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <Droplets className="w-96 h-96 text-primary-400 opacity-20" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
            <Droplets className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">Cemerlang Laundry</h1>
          <p className="text-primary-100 text-lg max-w-md">
            Sistem manajemen operasional terpadu. Bersih, Cepat, dan Terpercaya.
          </p>
        </div>
      </div>

      {/* Right panel - Login Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 sm:p-12 md:p-24 bg-white shadow-2xl lg:shadow-none z-10">
        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="p-3 bg-primary-50 rounded-xl">
                <Droplets className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Selamat Datang</h2>
            <p className="text-gray-500">Silakan login untuk mengakses sistem</p>
          </div>

          <form action={login} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
              <input
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                id="email"
                name="email"
                type="email"
                placeholder="admin@cemerlang.com"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
              <input
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2.5 text-white bg-primary-600 rounded-xl font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg shadow-primary-500/30"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
