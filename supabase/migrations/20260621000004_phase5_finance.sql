-- 1. Create Expenses Table
CREATE TABLE IF NOT EXISTS public.expenses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    amount numeric NOT NULL CHECK (amount > 0),
    category text NOT NULL CHECK (category IN ('operasional', 'bahan_baku', 'gaji_karyawan', 'lainnya')),
    description text NOT NULL,
    created_by uuid REFERENCES public.profiles(id) NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- 2. RLS for Expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner and Super Admin can manage expenses" 
ON public.expenses 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('owner', 'super_admin')
  )
);

CREATE POLICY "Staff can view expenses" 
ON public.expenses 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'staff'
  )
);

-- 3. Create Dashboard V2 RPC (Net Profit & Cashflow)
CREATE OR REPLACE FUNCTION public.fn_get_dashboard_stats_v2(
  p_start_date timestamptz,
  p_end_date timestamptz
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_pemasukan numeric;
  v_total_pengeluaran numeric;
  v_laba_bersih numeric;
  v_total_orders integer;
  v_daily_trend jsonb;
  v_service_breakdown jsonb;
BEGIN
  -- 1. Hitung Pemasukan (Dari order yang SUDAH LUNAS)
  SELECT COALESCE(SUM(final_price), 0), COUNT(id)
  INTO v_total_pemasukan, v_total_orders
  FROM public.orders
  WHERE created_at >= p_start_date 
    AND created_at <= p_end_date
    AND payment_status = 'paid';

  -- 2. Hitung Pengeluaran
  SELECT COALESCE(SUM(amount), 0)
  INTO v_total_pengeluaran
  FROM public.expenses
  WHERE created_at >= p_start_date 
    AND created_at <= p_end_date;

  -- 3. Laba Bersih
  v_laba_bersih := v_total_pemasukan - v_total_pengeluaran;

  -- 4. Tren Harian (Cashflow: Pemasukan vs Pengeluaran)
  WITH dates AS (
    SELECT generate_series(
      date_trunc('day', p_start_date),
      date_trunc('day', p_end_date),
      '1 day'::interval
    ) AS date
  ),
  daily_income AS (
    SELECT date_trunc('day', created_at) AS date, COALESCE(SUM(final_price), 0) AS pemasukan
    FROM public.orders
    WHERE created_at >= p_start_date AND created_at <= p_end_date AND payment_status = 'paid'
    GROUP BY date_trunc('day', created_at)
  ),
  daily_expense AS (
    SELECT date_trunc('day', created_at) AS date, COALESCE(SUM(amount), 0) AS pengeluaran
    FROM public.expenses
    WHERE created_at >= p_start_date AND created_at <= p_end_date
    GROUP BY date_trunc('day', created_at)
  )
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', to_char(d.date, 'YYYY-MM-DD'),
      'pemasukan', COALESCE(i.pemasukan, 0),
      'pengeluaran', COALESCE(e.pengeluaran, 0)
    ) ORDER BY d.date ASC
  ) INTO v_daily_trend
  FROM dates d
  LEFT JOIN daily_income i ON d.date = i.date
  LEFT JOIN daily_expense e ON d.date = e.date;

  -- 5. Layanan Terpopuler
  SELECT jsonb_agg(
    jsonb_build_object(
      'service_name', s.name,
      'order_count', counts.c
    )
  ) INTO v_service_breakdown
  FROM (
    SELECT service_type_id, count(id) as c
    FROM public.orders
    WHERE created_at >= p_start_date AND created_at <= p_end_date
    GROUP BY service_type_id
    ORDER BY count(id) DESC
    LIMIT 5
  ) counts
  JOIN public.service_types s ON s.id = counts.service_type_id;

  RETURN jsonb_build_object(
    'total_pemasukan', v_total_pemasukan,
    'total_pengeluaran', v_total_pengeluaran,
    'laba_bersih', v_laba_bersih,
    'total_orders_lunas', v_total_orders,
    'cashflow_trend', COALESCE(v_daily_trend, '[]'::jsonb),
    'service_breakdown', COALESCE(v_service_breakdown, '[]'::jsonb)
  );
END;
$$;
