import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StatusUpdater from './StatusUpdater'
import PrintReceiptButton from '@/components/PrintReceiptButton'
import WhatsAppPromptModal from '@/components/WhatsAppPromptModal'
import { ArrowLeft, User, MapPin, Phone, CheckCircle2, Clock, FileText, PackageOpen, CreditCard, Camera, AlertTriangle, Truck, MessageCircle } from 'lucide-react'

export default async function OrderDetailPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams?: Promise<{ print?: string, waPrompt?: string }> }) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { id } = await params
  const sp = searchParams ? await searchParams : { print: 'false' };

  // Fetch Order
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers (
        name,
        phone_number,
        address
      ),
      service_types (
        name,
        base_price,
        unit,
        flow_type
      ),
      order_items (
        id,
        item_name,
        price,
        initial_condition_description,
        initial_condition_image_url
      )
    `)
    .eq('id', id)
    .single()

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <PackageOpen className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700">Order tidak ditemukan.</h2>
        <Link href="/dashboard/orders" className="mt-4 text-primary-600 hover:underline">Kembali ke Daftar Order</Link>
      </div>
    )
  }

  const customerName = Array.isArray(order.customers) ? order.customers[0]?.name : (order.customers as any)?.name
  const customerPhone = Array.isArray(order.customers) ? order.customers[0]?.phone_number : (order.customers as any)?.phone_number
  const customerAddress = Array.isArray(order.customers) ? order.customers[0]?.address : (order.customers as any)?.address
  
  const serviceName = Array.isArray(order.service_types) ? order.service_types[0]?.name : (order.service_types as any)?.name
  const flowType = Array.isArray(order.service_types) ? order.service_types[0]?.flow_type : (order.service_types as any)?.flow_type

  // Fetch items
  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id)

  // Fetch history
  const { data: history } = await supabase
    .from('order_status_history')
    .select('*, profiles(name)')
    .eq('order_id', id)
    .order('created_at', { ascending: false })

  const isOverdue = new Date(order.estimated_completion_date) < new Date() && !['siap_diambil', 'selesai', 'dibatalkan', 'diantar'].includes(order.status)
  
  const statusTranslation: Record<string, string> = {
    diterima: 'telah DITERIMA oleh kasir',
    proses_cuci: 'sedang dalam PROSES CUCI',
    proses_kering: 'sedang dalam PROSES PENGERINGAN',
    setrika_lipat: 'sedang disetrika & dilipat',
    qc: 'sedang dalam proses QUALITY CONTROL',
    siap_diambil: 'telah selesai dan SIAP DIAMBIL di toko',
    diantar: 'sedang DIANTAR ke alamat Anda',
    selesai: 'telah SELESAI dan diserahkan',
    dibatalkan: 'telah DIBATALKAN'
  }
  const statusLabels: Record<string, string> = {
    diterima: 'telah kami terima',
    proses_cuci: 'sedang dalam proses cuci',
    proses_kering: 'sedang dikeringkan',
    setrika_lipat: 'sedang disetrika',
    siap_diambil: 'telah selesai dan SIAP DIAMBIL di toko',
    diantar: 'telah selesai dan SEDANG DIANTAR ke alamat Anda',
    selesai: 'telah SELESAI',
    dibatalkan: 'telah DIBATALKAN'
  }
  const totalBill = (order.final_price || order.estimated_price) + (order.delivery_fee || 0);
  
  let waMessage = `Halo *${order.customers?.name}*,\n\nPesanan laundry Anda dengan nomor resi *${order.tracking_number}* saat ini ${statusLabels[order.status] || order.status}.\n\nTotal tagihan: *Rp ${totalBill.toLocaleString('id-ID')}*\n\nTerima kasih telah mempercayakan cucian Anda kepada Cemerlang Laundry!`;
  
  if (order.status === 'siap_diambil') {
    waMessage = `Halo kak *${order.customers?.name}*,\n\nKabar gembira! Cucian kakak dengan resi *${order.tracking_number}* sudah wangi, rapi, dan **SIAP DIAMBIL** di toko kami ya. 🎉\n\nTotal tagihan: *Rp ${totalBill.toLocaleString('id-ID')}*\n\nDitunggu kedatangannya kak, terima kasih banyak sudah laundry di Cemerlang Laundry! ✨`;
  } else if (order.status === 'diantar') {
    waMessage = `Halo kak *${order.customers?.name}*,\n\nCucian kakak dengan resi *${order.tracking_number}* sudah selesai dan saat ini **SEDANG DALAM PERJALANAN** untuk diantar ke alamat kakak. 🛵💨\n\nTotal tagihan (termasuk ongkir): *Rp ${totalBill.toLocaleString('id-ID')}*\n\nMohon ditunggu ya kak, terima kasih banyak sudah laundry di Cemerlang Laundry! ✨`;
  }
  
  const cleanCustomerPhone = order.customers?.phone_number ? order.customers.phone_number.replace(/[^0-9]/g, '') : '';
  const customerWaUrl = `https://wa.me/${cleanCustomerPhone.startsWith('0') ? '62' + cleanCustomerPhone.slice(1) : cleanCustomerPhone}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="space-y-6">
      <WhatsAppPromptModal showPrompt={sp.waPrompt === 'true'} waUrl={customerWaUrl} orderId={order.id} />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-6">
        <div>
          <Link href="/dashboard/orders" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar Order
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Order <span className="text-primary-600">{order.tracking_number}</span></h1>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold bg-primary-50 text-primary-700 uppercase tracking-wider border border-primary-100 shadow-sm">
              {order.status.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-wider border shadow-sm ${order.payment_status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
              {order.payment_status}
            </span>
            {isOverdue && (
               <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold bg-red-50 text-red-700 border border-red-200 shadow-sm">
                 Melewati Batas Waktu
               </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
           <StatusUpdater orderId={order.id} currentStatus={order.status} defaultAddress={order.customers?.address || ''} serviceName={order.service_types?.name || ''} />
           {order.payment_status === 'unpaid' && (
             <Link href={`/dashboard/orders/${order.id}/payment`} className="flex-1 md:flex-none bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition-all transform hover:scale-[1.02] active:scale-95">
               <CreditCard className="w-5 h-5" /> Proses Pembayaran
             </Link>
           )}
           <PrintReceiptButton order={order} items={items || []} autoPrint={sp.print === 'true'} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Info Utama */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kartu Pelanggan */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <User className="w-24 h-24 text-primary-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-500" /> Profil Pelanggan
              </h2>
              <div className="space-y-4 relative z-10">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-0.5">Nama Lengkap</p>
                  <p className="font-bold text-gray-900 text-lg">{order.customers?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-0.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> Nomor HP</p>
                  <p className="font-semibold text-gray-800">{order.customers?.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-0.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Alamat</p>
                  <p className="text-gray-700">{order.customers?.address || '-'}</p>
                </div>
                
                {cleanCustomerPhone && (
                  <div className="pt-2">
                    <a 
                      href={customerWaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white py-3 px-4 rounded-xl font-bold shadow-md shadow-green-500/20 transition-all transform hover:scale-[1.02] active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Kirim Info via WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Kartu Layanan */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText className="w-24 h-24 text-primary-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <PackageOpen className="w-5 h-5 text-primary-500" /> Detail Layanan
              </h2>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <p className="text-sm font-medium text-gray-500">Jenis Layanan</p>
                  <p className="font-bold text-gray-900">{order.service_types?.name}</p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <p className="text-sm font-medium text-gray-500">Berat / Satuan</p>
                  <p className="font-semibold text-gray-800">{order.weight ? `${order.weight} kg` : `${items?.length || 0} Item`}</p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <p className="text-sm font-medium text-gray-500">Estimasi Selesai</p>
                  <p className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>{new Date(order.estimated_completion_date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                {order.delivery_fee > 0 && (
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Truck className="w-4 h-4 text-primary-500" /> Ongkos Kirim
                    </p>
                    <p className="font-semibold text-gray-800">Rp {order.delivery_fee.toLocaleString('id-ID')}</p>
                  </div>
                )}
                <div className="flex justify-between items-center bg-primary-50 p-3 rounded-lg border border-primary-100">
                  <p className="text-sm font-bold text-primary-800">Total Tagihan</p>
                  <p className="font-bold text-primary-700 text-lg">Rp {((order.final_price || order.estimated_price) + (order.delivery_fee || 0)).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>

          {order.special_notes && (
            <div className="bg-orange-50 p-6 rounded-2xl shadow-sm border border-orange-200 flex gap-4">
              <div className="mt-1">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-orange-800 mb-1">Catatan Khusus Pelanggan</h3>
                <p className="text-orange-900 font-medium">{order.special_notes}</p>
              </div>
            </div>
          )}

          {items && items.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <PackageOpen className="w-5 h-5 text-primary-500" /> Daftar Item Cucian ({items.length})
                </h2>
              </div>
              <div className="p-6 md:p-8 space-y-4 bg-gray-50">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-5 p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full sm:w-32 h-32 shrink-0 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                      {item.initial_condition_image_url ? (
                        <img src={item.initial_condition_image_url} alt={item.item_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Camera className="w-8 h-8 mb-1 opacity-50" />
                          <span className="text-[10px] font-medium uppercase tracking-wider">No Photo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{item.item_name}</h3>
                        <p className="font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kondisi Awal</p>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
                          {item.initial_condition_description || 'Tidak ada catatan khusus untuk item ini.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan: History */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" /> Riwayat Perjalanan
            </h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-primary-200 before:via-gray-200 before:to-transparent">
               {history?.map((entry, idx) => {
                 const isLatest = idx === 0
                 return (
                 <div key={entry.id} className="relative flex gap-4 items-start">
                   <div className={`flex items-center justify-center w-9 h-9 rounded-full border-4 border-white shrink-0 shadow-sm z-10 ${isLatest ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                     {isLatest ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-gray-400" />}
                   </div>
                   <div className={`flex-1 p-4 rounded-xl border transition-all ${isLatest ? 'bg-primary-50 border-primary-100 shadow-sm' : 'bg-white border-gray-100'}`}>
                     <div className="flex flex-col gap-1 mb-2">
                       <span className={`font-bold uppercase text-xs tracking-wider ${isLatest ? 'text-primary-700' : 'text-gray-700'}`}>
                         {entry.status.replace('_', ' ')}
                       </span>
                       <time className={`text-xs font-semibold flex items-center gap-1.5 ${isLatest ? 'text-primary-600' : 'text-gray-500'}`}>
                         <Clock className="w-3 h-3"/> {new Date(entry.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                       </time>
                     </div>
                     <div className="text-gray-600 text-xs font-medium flex items-center gap-1.5 pt-2 border-t border-black/5 mt-2">
                       <User className="w-3 h-3 opacity-70" /> Diupdate oleh {entry.profiles?.name || 'Sistem'}
                     </div>
                   </div>
                 </div>
               )})}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
