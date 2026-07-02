'use client'

import { useState, useEffect, useRef } from 'react'
import { searchCustomer, createOrder } from './actions'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Plus, Trash2, Camera, UserCheck, Package, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function ClientForm({ services }: { services: any[] }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [trackingNo, setTrackingNo] = useState('')
  
  // Customer State
  const [phone, setPhone] = useState('')
  const [customerInfo, setCustomerInfo] = useState<any>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')

  // Order State
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [weight, setWeight] = useState('')
  const [specialNotes, setSpecialNotes] = useState('')
  const [items, setItems] = useState<any[]>([])

  const phoneInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus on mount
    phoneInputRef.current?.focus()
  }, [])

  const selectedService = services.find(s => s.id === selectedServiceId)

  // Handle phone search debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (phone.length >= 10) {
        const cust = await searchCustomer(phone)
        if (cust) {
          setCustomerInfo(cust)
          setCustomerName(cust.name)
          setCustomerAddress(cust.address || '')
          toast.success(`Pelanggan ditemukan: ${cust.name}`)
        } else {
          setCustomerInfo(null)
        }
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [phone])

  const handleAddItem = () => {
    setItems([...items, { item_name: '', initial_condition_description: '', price: selectedService?.base_price || 0, file: null, previewUrl: null }])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...items]
    // Revoke object URL to prevent memory leaks
    if (newItems[index].previewUrl) {
      URL.revokeObjectURL(newItems[index].previewUrl)
    }
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index][field] = value
    
    // Handle image preview
    if (field === 'file' && value) {
      if (newItems[index].previewUrl) {
        URL.revokeObjectURL(newItems[index].previewUrl)
      }
      newItems[index].previewUrl = URL.createObjectURL(value)
    }
    
    setItems(newItems)
  }

  // Calculate estimated price
  let estimatedPrice = 0
  if (selectedService) {
    if (selectedService.unit === 'kg') {
      estimatedPrice = (parseFloat(weight) || 0) * selectedService.base_price
    } else {
      estimatedPrice = items.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault()
      // Create a list of focusable elements
      const form = e.currentTarget.closest('form')
      if (form) {
        const elements = Array.from(form.querySelectorAll('input, select, textarea, button')) as HTMLElement[]
        const index = elements.indexOf(e.target as HTMLElement)
        if (index > -1 && index < elements.length - 1) {
          elements[index + 1].focus()
        }
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const toastId = toast.loading('Menyimpan order...')

    try {
      // 1. Upload Images if any
      const finalItems = []
      for (const item of items) {
        let imageUrl = null
        if (item.file) {
          const fileExt = item.file.name.split('.').pop()
          const fileName = `${crypto.randomUUID()}.${fileExt}`
          const { data, error } = await supabase.storage.from('order_item_images').upload(fileName, item.file)
          if (!error && data) {
             const { data: publicUrlData } = supabase.storage.from('order_item_images').getPublicUrl(data.path)
             imageUrl = publicUrlData.publicUrl
          }
        }
        finalItems.push({
          item_name: item.item_name,
          initial_condition_description: item.initial_condition_description,
          price: parseInt(item.price),
          initial_condition_image_url: imageUrl
        })
      }

      // Calculate estimated date
      const estimatedDate = new Date()
      if (selectedService) {
        estimatedDate.setHours(estimatedDate.getHours() + selectedService.estimated_duration_hours)
      }

      const orderData = {
        customer_id: customerInfo?.id,
        customer_name: customerName,
        customer_phone: phone,
        customer_address: customerAddress,
        service_type_id: selectedServiceId,
        weight: selectedService?.unit === 'kg' ? parseFloat(weight) : null,
        estimated_price: estimatedPrice,
        estimated_completion_date: estimatedDate.toISOString(),
        special_notes: specialNotes,
        items: selectedService?.unit === 'item' ? finalItems : []
      }

      const res = await createOrder(orderData)
      if (res.error) throw new Error(res.error)
      
      setTrackingNo(res.trackingNumber || '')
      toast.success('Order berhasil dibuat!', { id: toastId })
    } catch (err: any) {
      toast.error('Gagal menyimpan: ' + err.message, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  if (trackingNo) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-sm border border-primary-100 text-center max-w-2xl mx-auto mt-12 hover:shadow-md transition-shadow">
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Save className="w-10 h-10 text-primary-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Berhasil Dibuat!</h2>
        <p className="text-gray-500 mb-8">Informasikan nomor resi ini kepada pelanggan:</p>
        
        <div className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-primary-700 bg-primary-50 inline-block px-8 py-4 rounded-xl border border-primary-200 mb-8">
          {trackingNo}
        </div>
        
        <div className="pt-6 border-t border-gray-100">
          <button 
            onClick={() => window.location.reload()} 
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 mx-auto hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" /> Buat Order Baru
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6 md:space-y-8">
      {/* 1. Customer Section */}
      <section className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
          <div className="p-2 bg-primary-50 rounded-lg">
            <UserCheck className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">1. Data Pelanggan</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nomor HP (WhatsApp)</label>
            <input 
              ref={phoneInputRef}
              type="text" 
              required 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-base md:text-lg" 
              placeholder="Contoh: 0812..." 
            />
            {customerInfo && <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1">✓ Pelanggan terdaftar</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
            <input 
              type="text" 
              required 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)} 
              disabled={!!customerInfo} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:bg-gray-100 disabled:text-gray-500 text-base md:text-lg" 
              placeholder="Nama pelanggan"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Alamat (Opsional)</label>
            <textarea 
              value={customerAddress} 
              onChange={(e) => setCustomerAddress(e.target.value)} 
              disabled={!!customerInfo} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:bg-gray-100 disabled:text-gray-500 text-base" 
              rows={2}
              placeholder="Alamat lengkap pengiriman/jemput"
            />
          </div>
        </div>
      </section>

      {/* 2. Service Section */}
      <section className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Package className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">2. Detail Layanan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pilih Jenis Layanan</label>
            <select 
              required 
              value={selectedServiceId} 
              onChange={(e) => setSelectedServiceId(e.target.value)} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-base md:text-lg appearance-none cursor-pointer"
            >
              <option value="">-- Ketuk untuk Memilih Layanan --</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} (Rp {s.base_price.toLocaleString('id-ID')} / {s.unit})</option>
              ))}
            </select>
          </div>

          {selectedService?.unit === 'kg' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Berat (Kg)</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1" 
                  required 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-base md:text-lg pr-12" 
                  placeholder="0.0"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">KG</div>
              </div>
            </div>
          )}
        </div>

        {selectedService?.unit === 'item' && (
          <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-800">Daftar Item Satuan</label>
              <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border">{items.length} Item</span>
            </div>
            
            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={i} className="flex flex-col xl:flex-row gap-4 p-5 bg-white border border-gray-200 rounded-xl relative shadow-sm hover:shadow-md transition-shadow">
                  
                  {/* Image Upload/Preview */}
                  <div className="w-full xl:w-40 shrink-0">
                    <label className="flex flex-col items-center justify-center w-full h-32 md:h-full min-h-[120px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 overflow-hidden relative group">
                      {item.previewUrl ? (
                        <>
                          <Image src={item.previewUrl} alt="Preview" fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500">Ambil Foto</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleItemChange(i, 'file', e.target.files?.[0])} />
                    </label>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Nama Item</label>
                      <input type="text" required value={item.item_name} onChange={(e) => handleItemChange(i, 'item_name', e.target.value)} placeholder="Misal: Sepatu Kets Putih" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Catatan Kondisi Awal</label>
                      <input type="text" value={item.initial_condition_description} onChange={(e) => handleItemChange(i, 'initial_condition_description', e.target.value)} placeholder="Misal: Noda lumpur di sol" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                    </div>
                  </div>

                  <div className="w-full xl:w-48 space-y-3 flex flex-col justify-end">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Harga (Rp)</label>
                      <input type="number" required value={item.price} onChange={(e) => handleItemChange(i, 'price', e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-semibold" />
                    </div>
                  </div>
                  
                  <button type="button" onClick={() => handleRemoveItem(i)} className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors border border-white shadow-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <button type="button" onClick={handleAddItem} className="w-full sm:w-auto mt-4 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary-600 font-medium flex items-center justify-center gap-2 transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Tambah Item Cucian
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catatan Khusus Order (Opsional)</label>
          <textarea 
            value={specialNotes} 
            onChange={(e) => setSpecialNotes(e.target.value)} 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-base" 
            rows={2}
            placeholder="Pesan khusus untuk pengerjaan..."
          />
        </div>
      </section>

      {/* 3. Summary Section */}
      <section className="bg-primary-900 p-6 md:p-8 rounded-2xl shadow-xl text-white">
        <h2 className="text-lg font-medium mb-4 text-primary-200">3. Ringkasan Estimasi Tagihan</h2>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <span className="text-gray-300">Total Pembayaran:</span>
          <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Rp {estimatedPrice.toLocaleString('id-ID')}
          </span>
        </div>
        
        <button 
          disabled={loading || !selectedServiceId || (selectedService?.unit === 'kg' && !weight) || (selectedService?.unit === 'item' && items.length === 0)} 
          type="submit" 
          className="w-full bg-primary-500 text-white px-4 py-4 rounded-xl hover:bg-primary-400 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:bg-primary-500 transition-all shadow-lg shadow-black/20"
        >
          {loading ? (
            <><Loader2 className="w-6 h-6 animate-spin" /> Memproses Order...</>
          ) : (
            <><Save className="w-6 h-6" /> Buat Order Sekarang</>
          )}
        </button>
      </section>
    </form>
  )
}
