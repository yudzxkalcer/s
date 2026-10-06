import { supabase } from '@/lib/supabase'
import type { Product, Order, OrderStatus, Cart, AppState, BalanceTransaction, Notification, CategoryId } from './types'

// ─── Categories (static metadata) ───────────────────────────
import { Cookie, CupSoda, PencilRuler, Shirt, type LucideIcon } from 'lucide-react'

export const categories: { id: CategoryId; label: string; icon: LucideIcon; tone: string }[] = [
  { id: 'makanan', label: 'Makanan Ringan', icon: Cookie, tone: 'bg-accent/35 text-accent-foreground' },
  { id: 'minuman', label: 'Minuman Dingin', icon: CupSoda, tone: 'bg-secondary text-primary' },
  { id: 'atk', label: 'Alat Tulis (ATK)', icon: PencilRuler, tone: 'bg-secondary text-primary' },
  { id: 'atribut', label: 'Atribut Sekolah', icon: Shirt, tone: 'bg-accent/35 text-accent-foreground' },
]

export const aiPickIds = ['air-mineral', 'mie-cup', 'pulpen']

// ─── Products ───────────────────────────────────────────────
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data || []) as unknown as Product[]
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return (data as unknown as Product) || null
}

// ─── Orders ─────────────────────────────────────────────────
export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  const orders = (data || []) as unknown as Order[]
  // Attach product info to each order item
  const productsMap = new Map<string, Product>()
  for (const o of orders) {
    for (const item of o.items || []) {
      if (!productsMap.has(item.product_id)) {
        const p = await fetchProduct(item.product_id)
        if (p) productsMap.set(item.product_id, p)
      }
      item.product = productsMap.get(item.product_id)
    }
  }
  return orders
}

export async function createOrder(
  cart: Cart,
  total: number,
  balance: number,
  points: number,
): Promise<Order | null> {
  const id = `o-${Date.now()}`
  const code = `TF-${Math.floor(1000 + Math.random() * 9000)}`
  const now = new Date().toLocaleString('id-ID', {
    weekday: undefined,
    hour: '2-digit',
    minute: '2-digit',
  })
  const pickupTime = `Hari ini, ${now}`

  const { error: orderError } = await supabase.from('orders').insert({
    id,
    code,
    total,
    status: 'diproses',
    pickup_time: pickupTime,
  })
  if (orderError) throw orderError

  const items = Object.entries(cart).map(([productId, qty]) => ({
    order_id: id,
    product_id: productId,
    qty,
  }))
  const { error: itemsError } = await supabase.from('order_items').insert(items)
  if (itemsError) throw itemsError

  // Deduct balance and add points
  await updateAppState(balance - total, points + Math.floor(total / 100))

  // Record balance transaction
  await supabase.from('balance_transactions').insert({
    amount: -total,
    type: 'purchase',
    description: `Pembayaran pesanan ${code}`,
  })

  // Create notification
  await supabase.from('notifications').insert({
    title: 'Pesanan Dibuat',
    body: `Pesanan ${code} sedang disiapkan petugas koperasi.`,
    is_read: false,
  })

  return {
    id,
    code,
    total,
    status: 'diproses',
    pickup_time: pickupTime,
    created_at: new Date().toISOString(),
    items: Object.entries(cart).map(([productId, qty]) => ({ product_id: productId, qty })),
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) throw error

  const statuses: Record<OrderStatus, string> = {
    diproses: 'sedang disiapkan',
    siap: 'sudah siap diambil di kasir koperasi!',
    selesai: 'telah diselesaikan',
  }
  await supabase.from('notifications').insert({
    title: `Pesanan ${status === 'siap' ? 'Siap Diambil' : 'Selesai'}`,
    body: `Pesananmu ${statuses[status]}`,
    is_read: false,
  })
}

// ─── App State (balance + points) ───────────────────────────
export async function fetchAppState(): Promise<AppState> {
  const { data, error } = await supabase
    .from('app_state')
    .select('*')
    .eq('id', 1)
    .maybeSingle()
  if (error) throw error
  return data as unknown as AppState
}

export async function updateAppState(balance: number, points: number): Promise<void> {
  const { error } = await supabase.from('app_state').update({ balance, points }).eq('id', 1)
  if (error) throw error
}

export async function topUpBalance(currentBalance: number, amount: number): Promise<void> {
  await updateAppState(currentBalance + amount, undefined as unknown as number)
  // Fetch current points and re-save to avoid nulling them
  const state = await fetchAppState()
  await updateAppState(currentBalance + amount, state.points)
  await supabase.from('balance_transactions').insert({
    amount,
    type: 'topup',
    description: 'Top up saldo kantin',
  })
  await supabase.from('notifications').insert({
    title: 'Saldo Bertambah',
    body: `Top up saldo ${formatRupiah(amount)} berhasil.`,
    is_read: false,
  })
}

// ─── Favorites ──────────────────────────────────────────────
export async function fetchFavorites(): Promise<string[]> {
  const { data, error } = await supabase.from('favorites').select('product_id')
  if (error) throw error
  return (data || []).map((f: { product_id: string }) => f.product_id)
}

export async function toggleFavorite(productId: string, isFav: boolean): Promise<void> {
  if (isFav) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('product_id', productId)
    if (error) throw error
  } else {
    const { error } = await supabase.from('favorites').insert({ product_id: productId })
    if (error) throw error
  }
}

// ─── Notifications ──────────────────────────────────────────
export async function fetchNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as unknown as Notification[]
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsRead(): Promise<void> {
  const { error } = await supabase.from('notifications').update({ is_read: true }).neq('is_read', true)
  if (error) throw error
}

// ─── Balance Transactions ───────────────────────────────────
export async function fetchBalanceTransactions(): Promise<BalanceTransaction[]> {
  const { data, error } = await supabase
    .from('balance_transactions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as unknown as BalanceTransaction[]
}

// ─── Helpers ────────────────────────────────────────────────
export function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString('id-ID')}`
}

export function discountPercent(p: Product) {
  return Math.round(((p.original_price - p.price) / p.original_price) * 100)
}
