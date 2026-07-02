-- Fix for Phase 3 Omset Date & Dashboard RPC

-- 1. Add paid_at to track when omset actually happens
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_at timestamptz;

-- Set paid_at to updated_at for existing paid orders so we don't lose them
UPDATE public.orders SET paid_at = updated_at WHERE payment_status = 'paid' AND paid_at IS NULL;

-- Trigger to auto-set paid_at when payment_status becomes 'paid'
CREATE OR REPLACE FUNCTION public.set_paid_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'paid' AND OLD.payment_status = 'unpaid' THEN
    NEW.paid_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_paid_at ON public.orders;
CREATE TRIGGER trigger_set_paid_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.set_paid_at();


-- 2. Update RPC to use paid_at for Omset and created_at for Order Masuk
CREATE OR REPLACE FUNCTION public.fn_get_dashboard_stats(
  p_start_date timestamptz,
  p_end_date timestamptz
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_total_orders integer;
  v_total_omset integer;
  v_avg_order integer;
  v_service_breakdown jsonb;
  v_payment_breakdown jsonb;
  v_daily_trend jsonb;
BEGIN
  -- Total Orders in period (based on created_at)
  SELECT count(*) INTO v_total_orders
  FROM orders
  WHERE created_at >= p_start_date AND created_at <= p_end_date;

  -- Total Omset in period (Only paid, based on paid_at!)
  SELECT coalesce(sum(final_price), 0) INTO v_total_omset
  FROM orders
  WHERE paid_at >= p_start_date AND paid_at <= p_end_date
    AND payment_status = 'paid';

  -- Avg Order
  IF v_total_orders > 0 THEN
    v_avg_order := v_total_omset / v_total_orders;
  ELSE
    v_avg_order := 0;
  END IF;

  -- Service Breakdown (based on paid_at)
  SELECT coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_service_breakdown
  FROM (
    SELECT st.name as service_name, count(o.id) as order_count, coalesce(sum(o.final_price), 0) as omset
    FROM orders o
    JOIN service_types st ON o.service_type_id = st.id
    WHERE o.paid_at >= p_start_date AND o.paid_at <= p_end_date AND o.payment_status = 'paid'
    GROUP BY st.name
    ORDER BY omset DESC
  ) t;

  -- Payment Breakdown (based on paid_at)
  SELECT coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_payment_breakdown
  FROM (
    SELECT payment_method, count(id) as order_count, coalesce(sum(final_price), 0) as omset
    FROM orders
    WHERE paid_at >= p_start_date AND paid_at <= p_end_date AND payment_status = 'paid'
    GROUP BY payment_method
  ) t;

  -- Daily Trend (Omset per day using WIB Timezone, based on paid_at)
  SELECT coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_daily_trend
  FROM (
    SELECT 
      to_char(paid_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') as date_str,
      coalesce(sum(final_price), 0) as omset
    FROM orders
    WHERE paid_at >= p_start_date AND paid_at <= p_end_date AND payment_status = 'paid'
    GROUP BY to_char(paid_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD')
    ORDER BY date_str ASC
  ) t;

  v_result := jsonb_build_object(
    'total_orders', v_total_orders,
    'total_omset', v_total_omset,
    'avg_order', v_avg_order,
    'service_breakdown', v_service_breakdown,
    'payment_breakdown', v_payment_breakdown,
    'daily_trend', v_daily_trend
  );

  RETURN v_result;
END;
$$;
