'use client';

import { useState } from 'react';
import { Printer } from 'lucide-react';
import qz from 'qz-tray';

interface Props {
  order: any;
  items: any[];
}

// 58mm printer usually handles 32 characters per line.
function formatLine(left: string, right: string) {
  const maxLength = 32;
  const leftLen = left.length;
  const rightLen = right.length;
  const spaces = maxLength - leftLen - rightLen;
  if (spaces > 0) {
    return left + ' '.repeat(spaces) + right + '\n';
  }
  return left.substring(0, maxLength - rightLen - 1) + ' ' + right + '\n';
}

export default function PrintReceiptButton({ order, items }: Props) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      
      // Cek apakah sudah konek ke QZ Tray di PC Admin
      if (!qz.websocket.isActive()) {
        await qz.websocket.connect();
      }

      // Ambil default printer yang sudah diset di komputer
      const printerName = await qz.printers.getDefault();
      
      // Raw ESC/POS Commands
      const ESC = '\x1B';
      const GS = '\x1D';
      
      const init = ESC + '@';
      const kickDrawer = ESC + 'p' + '\x00' + '\x19' + '\xFA'; // Command untuk nendang laci kasir
      const boldOn = ESC + 'E' + '\x01';
      const boldOff = ESC + 'E' + '\x00';
      const alignCenter = ESC + 'a' + '\x01';
      const alignLeft = ESC + 'a' + '\x00';

      const totalBill = (order.final_price || order.estimated_price) + (order.delivery_fee || 0);

      const data = [
        init,
        alignCenter,
        boldOn,
        "CEMERLANG LAUNDRY\n",
        boldOff,
        "Jl. Boulevard GDC\n",
        "Telp: 087779560264\n",
        "--------------------------------\n", // 32 chars for 58mm
        alignLeft,
        `Resi  : ${order.tracking_number}\n`,
        `Tgl   : ${new Date().toLocaleDateString('id-ID')}\n`,
        `Plg   : ${order.customers?.name}\n`,
        `Telp  : ${order.customers?.phone_number || '-'}\n`,
        "--------------------------------\n",
        boldOn,
        `${order.service_types?.name}\n`,
        boldOff,
      ];

      // Add items
      if (items && items.length > 0) {
        items.forEach(item => {
          data.push(formatLine(item.item_name, item.price.toLocaleString('id-ID')));
        });
      } else {
        const weightText = order.weight ? `${order.weight} kg` : 'Paket';
        data.push(formatLine(weightText, (order.final_price || order.estimated_price).toLocaleString('id-ID')));
      }

      if (order.delivery_fee > 0) {
        data.push(formatLine("Ongkir", order.delivery_fee.toLocaleString('id-ID')));
      }

      data.push("--------------------------------\n");
      data.push(boldOn);
      data.push(formatLine("TOTAL:", "Rp" + totalBill.toLocaleString('id-ID')));
      data.push(formatLine("STATUS:", order.payment_status.toUpperCase()));
      data.push(boldOff);
      data.push("--------------------------------\n");
      
      data.push(alignCenter);
      data.push("Terima Kasih!\n");
      data.push("Pakaian tidak diambil lebih dari\n30 hari bukan tanggung jawab kami.\n\n\n\n\n");
      
      // Cut paper (if supported) and kick drawer
      data.push(GS + 'V' + '\x41' + '\x00');
      data.push(kickDrawer);

      const config = qz.configs.create(printerName);
      await qz.print(config, data);

    } catch (error: any) {
      console.error("QZ Tray Error:", error);
      alert("Gagal print struk: " + (error.message || "Pastikan aplikasi QZ Tray di komputer kasir sudah menyala!"));
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <button 
      onClick={handlePrint} 
      disabled={isPrinting}
      className={`flex-1 md:flex-none ${isPrinting ? 'bg-gray-600' : 'bg-gray-900 hover:bg-gray-800'} text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all transform ${isPrinting ? '' : 'hover:scale-[1.02] active:scale-95'}`}
    >
      <Printer className={`w-5 h-5 ${isPrinting ? 'animate-pulse' : ''}`} /> 
      {isPrinting ? 'Mencetak...' : 'Cetak Struk (Otomatis Buka Laci)'}
    </button>
  );
}
