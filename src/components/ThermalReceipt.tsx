'use client';

interface ReceiptProps {
  order: any;
  items: any[];
}

export function ThermalReceipt({ order, items }: ReceiptProps) {
  const totalBill = (order.final_price || order.estimated_price) + (order.delivery_fee || 0);

  return (
    <div className="hidden print:block print-area text-black bg-white font-mono text-[11px] leading-snug">
      {/* Header */}
      <div className="text-center border-b border-black border-dashed pb-2 mb-2">
        <h1 className="font-bold text-[14px] leading-tight mb-1">CEMERLANG LAUNDRY</h1>
        <p>Jl. Boulevard GDC</p>
        <p>Telp: 087779560264</p>
      </div>

      {/* Meta */}
      <div className="mb-2">
        <div className="flex justify-between">
          <span>Resi:</span>
          <span className="font-bold">{order.tracking_number}</span>
        </div>
        <div className="flex justify-between">
          <span>Tgl:</span>
          <span>{new Date().toLocaleDateString('id-ID')}</span>
        </div>
      </div>

      {/* Customer */}
      <div className="border-t border-black border-dashed pt-2 mb-2">
        <p><span className="font-semibold">Plg:</span> {order.customers?.name}</p>
        <p><span className="font-semibold">No:</span> {order.customers?.phone_number}</p>
      </div>

      {/* Items */}
      <div className="border-t border-black border-dashed py-2 mb-2">
        <div className="font-bold pb-1">{order.service_types?.name}</div>
        <table className="w-full">
          <tbody>
            {items && items.length > 0 ? items.map((item, i) => (
              <tr key={i}>
                <td className="align-top pb-1 pr-1">{item.item_name}</td>
                <td className="align-top text-right pb-1">{(item.price).toLocaleString('id-ID')}</td>
              </tr>
            )) : (
              <tr>
                <td className="align-top pb-1">{order.weight ? `${order.weight} kg` : 'Paket'}</td>
                <td className="align-top text-right pb-1">{(order.final_price || order.estimated_price).toLocaleString('id-ID')}</td>
              </tr>
            )}
            {order.delivery_fee > 0 && (
              <tr>
                <td className="align-top pt-1">Ongkir</td>
                <td className="align-top text-right pt-1">{(order.delivery_fee).toLocaleString('id-ID')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t border-black pt-2 mb-2">
        <div className="flex justify-between font-bold text-[13px] mb-1">
          <span>TOTAL:</span>
          <span>Rp{totalBill.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="uppercase font-semibold">{order.payment_status}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t border-black border-dashed pt-2 mt-2">
        <p className="font-bold">Terima Kasih!</p>
        <p className="text-[9px] mt-1 italic leading-tight">Pakaian tidak diambil lebih dari 30 hari bukan tanggung jawab kami.</p>
        <p className="mt-4 mb-2">.</p> {/* Spacer for printer tear-off */}
      </div>
    </div>
  );
}
