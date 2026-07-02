'use client';

import { Printer } from 'lucide-react';

interface Props {
  order: any;
  items: any[];
}

export default function PrintReceiptButton({ order, items }: Props) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button 
      onClick={handlePrint} 
      className="flex-1 md:flex-none bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
    >
      <Printer className="w-5 h-5" /> 
      Cetak Struk
    </button>
  );
}
