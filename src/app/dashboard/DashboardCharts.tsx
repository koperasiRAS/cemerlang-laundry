'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardCharts({ dailyTrend }: { dailyTrend: any[] }) {
  if (!dailyTrend || dailyTrend.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500 border-2 border-dashed rounded-lg">Belum ada data omset 7 hari terakhir.</div>
  }

  // Format data for Recharts
  const data = dailyTrend.map(d => ({
    name: new Date(d.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
    pemasukan: d.pemasukan,
    pengeluaran: d.pengeluaran
  }))

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickFormatter={(value) => `Rp${value / 1000}k`}
          />
          <Tooltip 
            cursor={{ fill: '#F3F4F6' }}
            formatter={(value: any, name: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, name === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran']}
            labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
          />
          <Bar dataKey="pemasukan" name="Pemasukan" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
