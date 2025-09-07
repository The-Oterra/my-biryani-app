"use client";

import { useEffect, useMemo, useState } from "react";

type CartItem = { name: string; price: number; img: string; veg: boolean; qty: number };

const KEY = "rbcart";

function VegBadge({ veg }: { veg: boolean }) {
  const color = veg ? "fill-green-600 stroke-green-600" : "fill-rose-600 stroke-rose-600";
  const label = veg ? "Veg" : "Non-Veg";
  return (
    <span className="inline-flex items-center gap-1 text-xs" aria-label={label} title={label}>
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
        <rect x="1" y="1" width="18" height="18" rx="2" className={`${color} fill-transparent`} />
        <circle cx="10" cy="10" r="4" className={color} />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default function Page() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setItems(JSON.parse(raw));
  }, []);

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  function save(next: CartItem[]) {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function inc(name: string) {
    save(items.map(i => i.name === name ? { ...i, qty: i.qty + 1 } : i));
  }
  function dec(name: string) {
    const next = items.map(i => i.name === name ? { ...i, qty: Math.max(1, i.qty - 1) } : i);
    save(next);
  }
  function remove(name: string) {
    save(items.filter(i => i.name !== name));
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-amber-900" aria-hidden />
              <span className="font-semibold tracking-wide">Royal Biryani Co.</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="/menu" className="hover:text-amber-900">Menu</a>
              <a href="/offers" className="hover:text-amber-900">Offers</a>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your Cart</h1>
          {items.length === 0 ? (
            <div className="mt-8 rounded-2xl border bg-white p-8 text-center">
              <p className="text-neutral-700">Your cart is empty.</p>
              <div className="mt-4 flex justify-center gap-3">
                <a href="/menu" className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-50">Browse Menu</a>
                <a href="/offers" className="rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50 hover:bg-amber-800">View Offers</a>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {items.map((i) => (
                  <div key={i.name} className="flex gap-4 rounded-2xl border bg-white p-4">
                    <img src={i.img} alt={i.name} className="h-24 w-24 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{i.name}</h3>
                        <VegBadge veg={i.veg} />
                      </div>
                      <p className="text-sm text-neutral-500">₹{i.price} each</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button onClick={() => dec(i.name)} className="h-8 w-8 rounded-full border">-</button>
                        <span className="w-8 text-center">{i.qty}</span>
                        <button onClick={() => inc(i.name)} className="h-8 w-8 rounded-full border">+</button>
                        <button onClick={() => remove(i.name)} className="ml-4 text-sm underline">Remove</button>
                      </div>
                    </div>
                    <div className="text-right font-semibold">₹{i.price * i.qty}</div>
                  </div>
                ))}
              </div>
              <aside className="rounded-2xl border bg-white p-6 h-max">
                <h4 className="font-semibold">Summary</h4>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span>Items</span>
                  <span>{items.reduce((s, i) => s + i.qty, 0)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <a href="/confirm" className="mt-5 block rounded-full bg-amber-900 px-4 py-2 text-center text-sm font-semibold text-amber-50 hover:bg-amber-800">Checkout</a>
                <a href="/menu" className="mt-2 block text-center text-sm underline">Continue shopping</a>
              </aside>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-xs text-neutral-500 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Royal Biryani Co. All rights reserved.</p>
          <p>Customer care: <a className="underline" href="tel:+917700050050">+91 77000 50050</a></p>
        </div>
      </footer>
    </main>
  );
}
