import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function check() {
  const { data: orders, error } = await supabase.from('orders').select('id, created_at, status, payment_status, final_price, estimated_price')
  console.log("ORDERS:", orders)
  console.log("ERROR:", error)
}

check()
