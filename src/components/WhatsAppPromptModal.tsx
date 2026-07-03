'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  showPrompt: boolean;
  waUrl: string;
  orderId: string;
}

export default function WhatsAppPromptModal({ showPrompt, waUrl, orderId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (showPrompt) {
      setIsOpen(true);
      // Clean up the URL
      window.history.replaceState(null, '', `/dashboard/orders/${orderId}`);
    }
  }, [showPrompt, orderId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Beritahu Pelanggan?</h2>
          <p className="text-sm text-gray-500 mb-6">Status order berhasil diubah. Ingin mengirimkan notifikasi otomatis ke WhatsApp pelanggan?</p>
          
          <div className="space-y-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white py-3 px-4 rounded-xl font-bold transition-all"
            >
              Kirim via WhatsApp
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
