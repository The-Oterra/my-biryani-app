// app/confirm/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Spice = "Mild" | "Medium" | "Royal";

type Item = { name: string; price: number; img: string; tag?: string; veg: boolean };
type CartItem = Item & { qty: number; spice: Spice };

const CART_KEY = "rbcart";
const DRAFT_KEY = "rborder_draft";

export default function ConfirmOrderPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    allergies: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(CART_KEY) : null;
    const list: (Item & { qty: number; spice?: Spice })[] = raw ? JSON.parse(raw) : [];
    const withSpice: CartItem[] = list.map((i) => ({ ...i, spice: i.spice ?? "Medium" }));
    setItems(withSpice);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ items, form }));
  }, [items, form]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const tax = 200;
  const total = subtotal + tax;

  function updateSpice(name: string, spice: Spice) {
    setItems((prev) => prev.map((i) => (i.name === name ? { ...i, spice } : i)));
  }

  function updateQty(name: string, delta: number) {
    setItems((prev) =>
      prev
        .map((i) => (i.name === name ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function removeItem(name: string) {
    setItems((prev) => prev.filter((i) => i.name !== name));
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  const valid =
    items.length > 0 &&
    form.name.trim() &&
    /^[6-9]\d{9}$/.test(form.phone.trim()) &&
    form.address1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    /^\d{6}$/.test(form.pincode.trim());

  function confirmOrder() {
    setSaving(true);
    const payload = {
      items,
      customer: form,
      charges: { subtotal, tax, total },
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    setTimeout(() => {
      setSaving(false);
      alert("Order details saved. Hook up payment/placement next.");
    }, 400);
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="font-semibold">Royal Biryani Co.</a>
          <nav className="text-sm">
            <a href="/cart" className="underline">Back to Cart</a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Confirm Your Order</h1>

        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border bg-white p-6">
            <p>Your cart is empty.</p>
            <div className="mt-4">
              <a href="/menu" className="inline-flex rounded-full bg-amber-900 px-5 py-2.5 text-sm font-semibold text-amber-50 hover:bg-amber-800">
                Browse Menu
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border bg-white p-6">
                <h2 className="text-lg font-semibold">Delivery Details</h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input className="rounded-xl border px-3 py-2" name="name" placeholder="Full Name" value={form.name} onChange={onChange} />
                  <input className="rounded-xl border px-3 py-2" name="phone" placeholder="Phone (10 digits)" value={form.phone} onChange={onChange} inputMode="numeric" />
                  <input className="rounded-xl border px-3 py-2 sm:col-span-2" name="email" placeholder="Email (optional)" value={form.email} onChange={onChange} />
                  <input className="rounded-xl border px-3 py-2 sm:col-span-2" name="address1" placeholder="Address line 1" value={form.address1} onChange={onChange} />
                  <input className="rounded-xl border px-3 py-2 sm:col-span-2" name="address2" placeholder="Address line 2 (optional)" value={form.address2} onChange={onChange} />
                  <input className="rounded-xl border px-3 py-2" name="city" placeholder="City" value={form.city} onChange={onChange} />
                  <input className="rounded-xl border px-3 py-2" name="state" placeholder="State" value={form.state} onChange={onChange} />
                  <input className="rounded-xl border px-3 py-2" name="pincode" placeholder="Pincode" value={form.pincode} onChange={onChange} inputMode="numeric" />
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6">
                <h2 className="text-lg font-semibold">Order Items</h2>
                <ul className="mt-4 divide-y">
                  {items.map((it) => (
                    <li key={it.name} className="py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <img src={it.img} alt={it.name} className="h-16 w-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{it.name}</p>
                            <p className="text-sm text-neutral-600">₹{it.price} × {it.qty}</p>
                          </div>
                          <button onClick={() => removeItem(it.name)} className="text-sm text-rose-600 hover:underline">Remove</button>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <label className="text-sm">Spice Level</label>
                          <select
                            value={it.spice}
                            onChange={(e) => updateSpice(it.name, e.target.value as Spice)}
                            className="rounded-full border px-3 py-1.5 text-sm"
                          >
                            <option value="Mild">Mild</option>
                            <option value="Medium">Medium</option>
                            <option value="Royal">Royal (Spicy)</option>
                          </select>
                          <div className="ml-auto flex items-center gap-3">
                            <button onClick={() => updateQty(it.name, -1)} className="h-8 w-8 rounded-full border text-sm">–</button>
                            <span className="w-6 text-center">{it.qty}</span>
                            <button onClick={() => updateQty(it.name, +1)} className="h-8 w-8 rounded-full border text-sm">+</button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-right text-sm text-neutral-600">
                  Subtotal: <span className="font-medium text-neutral-900">₹{subtotal}</span>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6">
                <h2 className="text-lg font-semibold">Allergies / Notes</h2>
                <textarea
                  name="allergies"
                  value={form.allergies}
                  onChange={onChange}
                  placeholder="E.g., Peanut allergy, no dairy, less oil, etc."
                  rows={3}
                  className="mt-3 w-full rounded-xl border px-3 py-2"
                />
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-2xl border bg-white p-6">
                <h3 className="text-lg font-semibold">Bill Summary</h3>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt>Items subtotal</dt>
                    <dd>₹{subtotal}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Tax (incl.)</dt>
                    <dd>₹{tax}</dd>
                  </div>
                  <div className="flex justify-between text-base font-semibold">
                    <dt>Grand Total</dt>
                    <dd>₹{total}</dd>
                  </div>
                </dl>
                <button
                  onClick={confirmOrder}
                  disabled={!valid || saving}
                  className="mt-5 w-full rounded-full bg-amber-900 px-5 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-800 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Confirm Order"}
                </button>
                {!valid && (
                  <p className="mt-2 text-xs text-neutral-500">
                    Fill in name, phone, address, city, state and a valid 6-digit pincode to proceed.
                  </p>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
