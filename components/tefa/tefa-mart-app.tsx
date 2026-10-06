'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AppHeader } from './app-header'
import { HeroCarousel } from './hero-carousel'
import { CategoryMenu } from './category-menu'
import { AiSmartPick } from './ai-smart-pick'
import { ProductGrid } from './product-grid'
import { BottomNav, type NavTab } from './bottom-nav'
import { CartFab } from './cart-fab'
import { SuccessToast } from './success-toast'
import { CategoryScreen, type CategoryFilter } from './category-screen'
import { CartScreen } from './cart-screen'
import { OrdersScreen } from './orders-screen'
import { ProfileScreen } from './profile-screen'
import { NotificationsScreen } from './notifications-screen'
import { ProductDetailScreen } from './product-detail-screen'
import {
  fetchProducts,
  fetchOrders,
  fetchAppState,
  createOrder,
  updateOrderStatus,
  topUpBalance,
  fetchFavorites,
  toggleFavorite,
  fetchNotifications,
  formatRupiah,
} from './data'
import type { Product, Order, Cart } from './types'

type Tab = NavTab | 'keranjang' | 'notifikasi' | 'detail'

export function TefaMartApp() {
  const [tab, setTab] = useState<Tab>('beranda')
  const [prevTab, setPrevTab] = useState<NavTab>('beranda')
  const [category, setCategory] = useState<CategoryFilter>('semua')
  const [focusSearch, setFocusSearch] = useState(false)
  const [cart, setCart] = useState<Cart>({ roti: 1, susu: 1 })
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [balance, setBalance] = useState(45000)
  const [points, setPoints] = useState(2500)
  const [favorites, setFavorites] = useState<string[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [toastKey, setToastKey] = useState(0)
  const [toastVisible, setToastVisible] = useState(false)
  const [bump, setBump] = useState(false)
  const [toastMsg, setToastMsg] = useState('Berhasil ditambahkan!')
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0)
  const activeOrders = orders.filter((o) => o.status !== 'selesai').length

  // ─── Load all data on mount ───────────────────────────────
  const loadAll = useCallback(async () => {
    try {
      const [prods, ords, state, favs, notifs] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchAppState(),
        fetchFavorites(),
        fetchNotifications(),
      ])
      setProducts(prods)
      setOrders(ords)
      setBalance(state.balance)
      setPoints(state.points)
      setFavorites(favs)
      setUnreadCount(notifs.filter((n) => !n.is_read).length)
    } catch {
      // keep defaults on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const goTo = useCallback(
    (next: Tab) => {
      if (next === 'keranjang' && tab !== 'keranjang') setPrevTab(tab as NavTab)
      if (next !== 'kategori') setFocusSearch(false)
      setTab(next)
    },
    [tab],
  )

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setToastKey((k) => k + 1)
    setToastVisible(true)
    setBump(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 2800)
  }, [])

  const handleAdd = useCallback(
    (id: string) => {
      setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
      showToast('Berhasil ditambahkan ke keranjang!')
    },
    [showToast],
  )

  const handleQtyChange = useCallback((id: string, qty: number) => {
    setCart((c) => {
      const next = { ...c }
      if (qty <= 0) delete next[id]
      else next[id] = Math.min(qty, 20)
      return next
    })
  }, [])

  const handleCheckout = async () => {
    const items = Object.entries(cart).map(([productId, qty]) => ({ productId, qty }))
    const total = items.reduce((s, i) => {
      const p = products.find((pr) => pr.id === i.productId)
      return s + (p?.price ?? 0) * i.qty
    }, 0)
    if (items.length === 0 || total > balance) return

    try {
      const newOrder = await createOrder(cart, total, balance, points)
      if (newOrder) {
        setBalance((b) => b - total)
        setPoints((p) => p + Math.floor(total / 100))
        setCart({})
        setOrders((o) => [newOrder, ...o])
        setUnreadCount((c) => c + 1)
        setTab('pesanan')
        showToast('Pesanan berhasil dibuat!')
      }
    } catch {
      showToast('Gagal membuat pesanan. Coba lagi.')
    }
  }

  const handlePicked = async (id: string) => {
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: 'selesai' } : o)))
    try {
      await updateOrderStatus(id, 'selesai')
    } catch {
      // silent
    }
  }

  const handleReorder = (order: Order) => {
    setCart((c) => {
      const next = { ...c }
      for (const { product_id, qty } of order.items) next[product_id] = (next[product_id] ?? 0) + qty
      return next
    })
    goTo('keranjang')
  }

  const handleTopUp = async () => {
    try {
      await topUpBalance(balance, 20000)
      setBalance((b) => b + 20000)
      setUnreadCount((c) => c + 1)
      showToast('Top up saldo berhasil!')
    } catch {
      showToast('Gagal top up. Coba lagi.')
    }
  }

  const handleToggleFavorite = useCallback(
    async (productId: string) => {
      const isFav = favorites.includes(productId)
      setFavorites((f) => (isFav ? f.filter((id) => id !== productId) : [...f, productId]))
      try {
        await toggleFavorite(productId, isFav)
        showToast(isFav ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit!')
      } catch {
        setFavorites((f) => (isFav ? [...f, productId] : f.filter((id) => id !== productId)))
      }
    },
    [favorites, showToast],
  )

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product)
    setTab('detail')
  }, [])

  const handleNotifRead = useCallback(() => {
    setUnreadCount(0)
  }, [])

  useEffect(() => {
    if (!bump) return
    const t = setTimeout(() => setBump(false), 300)
    return () => clearTimeout(t)
  }, [bump])

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    },
    [],
  )

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm font-semibold text-muted-foreground">Memuat Tefa Mart...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SuccessToast key={toastKey} visible={toastVisible} message={toastMsg} onClose={() => setToastVisible(false)} />
      <div key={tab} className="no-scrollbar h-full overflow-y-auto pb-24">
        {tab === 'beranda' ? (
          <>
            <AppHeader
              points={points}
              balance={balance}
              unreadCount={unreadCount}
              onSearch={() => {
                setCategory('semua')
                setFocusSearch(true)
                setTab('kategori')
              }}
              onNotifications={() => goTo('notifikasi')}
            />
            <div className="flex flex-col gap-6 pt-4">
              <HeroCarousel />
              <CategoryMenu
                onSelect={(id) => {
                  setCategory(id)
                  goTo('kategori')
                }}
              />
              <AiSmartPick products={products} onAdd={handleAdd} />
              <ProductGrid
                products={products}
                onAdd={handleAdd}
                onProductClick={handleProductClick}
                onSeeAll={() => {
                  setCategory('semua')
                  goTo('kategori')
                }}
              />
            </div>
          </>
        ) : null}

        {tab === 'kategori' ? (
          <CategoryScreen
            products={products}
            category={category}
            onCategoryChange={setCategory}
            onAdd={handleAdd}
            onProductClick={handleProductClick}
            autoFocusSearch={focusSearch}
          />
        ) : null}

        {tab === 'pesanan' ? (
          <OrdersScreen
            orders={orders}
            onPicked={handlePicked}
            onReorder={handleReorder}
            onShop={() => goTo('beranda')}
          />
        ) : null}

        {tab === 'profil' ? (
          <ProfileScreen
            points={points}
            balance={balance}
            orderCount={orders.length}
            onTopUp={handleTopUp}
            onOpenOrders={() => goTo('pesanan')}
            onOpenCart={() => goTo('keranjang')}
          />
        ) : null}

        {tab === 'keranjang' ? (
          <CartScreen
            cart={cart}
            products={products}
            balance={balance}
            onQtyChange={handleQtyChange}
            onCheckout={handleCheckout}
            onBack={() => goTo(prevTab)}
          />
        ) : null}

        {tab === 'notifikasi' ? (
          <NotificationsScreen onBack={() => goTo(prevTab)} onRead={handleNotifRead} />
        ) : null}

        {tab === 'detail' && selectedProduct ? (
          <ProductDetailScreen
            product={selectedProduct}
            isFavorite={favorites.includes(selectedProduct.id)}
            onToggleFavorite={() => handleToggleFavorite(selectedProduct.id)}
            onAdd={handleAdd}
            onBack={() => goTo(prevTab)}
          />
        ) : null}
      </div>
      {tab !== 'keranjang' && tab !== 'notifikasi' && tab !== 'detail' ? (
        <CartFab count={cartCount} bump={bump} onClick={() => goTo('keranjang')} />
      ) : null}
      <BottomNav active={tab} onChange={goTo} orderBadge={activeOrders} />
    </>
  )
}
