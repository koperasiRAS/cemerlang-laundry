'use client'

import { useState } from 'react'
import { updateCustomer } from './actions'
import { Loader2, Edit2, X, Save } from 'lucide-react'

export default function EditCustomerForm({ customer }: { customer: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(customer.name)
  const [phone, setPhone] = useState(customer.phone_number)
  const [address, setAddress] = useState(customer.address || '')

  const handleSave = async () => {
    setLoading(true)
    const res = await updateCustomer(customer.id, { name, phone_number: phone, address })
    if (res.error) {
      alert(res.error)
    } else {
      setIsEditing(false)
    }
    setLoading(false)
  }

  if (!isEditing) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border relative">
        <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 text-gray-500 hover:text-blue-600" title="Edit Profil">
          <Edit2 className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
            <p className="text-gray-500">Pelanggan sejak {new Date(customer.created_at).toLocaleDateString('id-ID')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Nomor HP</p>
            <p className="font-medium">{customer.phone_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Alamat</p>
            <p className="font-medium">{customer.address || '-'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Edit Profil Pelanggan</h2>
        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-red-500">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nomor HP</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Alamat</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded-md" rows={2} />
        </div>
        <button disabled={loading} onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 w-full disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Perubahan
        </button>
      </div>
    </div>
  )
}
