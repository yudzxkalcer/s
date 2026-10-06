export type CategoryId = 'makanan' | 'minuman' | 'atk' | 'atribut'

export type Product = {
  id: string
  name: string
  image: string
  price: number
  original_price: number
  unit: string
  category: CategoryId
  stock: number
  is_active: boolean
}

export type OrderStatus = 'diproses' | 'siap' | 'selesai'

export type Order = {
  id: string
  code: string
  total: number
  status: OrderStatus
  pickup_time: string | null
  created_at: string
  items: { product_id: string; qty: number; product?: Product }[]
}

export type Cart = Record<string, number>

export type BalanceTransaction = {
  id: string
  amount: number
  type: 'topup' | 'purchase'
  description: string | null
  created_at: string
}

export type Notification = {
  id: string
  title: string
  body: string
  is_read: boolean
  created_at: string
}

export type Favorite = {
  id: string
  product_id: string
  created_at: string
}

export type AppState = {
  id: number
  balance: number
  points: number
}
