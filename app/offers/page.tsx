"use client";

type OfferItem = { name: string; price: number; img: string; veg: boolean; bogo?: boolean; tag?: string; originalPrice?: number };

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

const KEY = "rbcart";

function addToCart(item: OfferItem) {
  const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
  const list: (OfferItem & { qty: number })[] = raw ? JSON.parse(raw) : [];
  const idx = list.findIndex((i) => i.name === item.name);
  if (idx >= 0) list[idx].qty += 1; else list.push({ ...item, qty: 1 });
  localStorage.setItem(KEY, JSON.stringify(list));
  window.location.assign("/cart");
}

const OFFERS: OfferItem[] = [
  { name: "Murgh Seekh Kebab", price: 299, img: "/images/menu-kebab.jpg", veg: false, bogo: true },
  { name: "Paneer Tikka", price: 279, img: "/images/menu-starter-paneer.jpg", veg: true, bogo: true },
  { name: "Gulab Jamun (2 pc)", price: 89, img: "/images/menu-dessert.jpg", veg: true, bogo: true },
  { name: "Chicken Biryani + Pepsi", price: 349, img: "/images/menu-combo-chicken.jpg", veg: false, tag: "Combo" },
  { name: "Veg Biryani + Gulab Jamun", price: 329, img: "/images/menu-combo-veg.jpg", veg: true, tag: "Combo" },
  { name: "Haleem Special", price: 299, img: "/images/menu-haleem.jpg", veg: false, tag: "Limited Time" },
  { name: "Shahi Biryani (Serves 2)", price: 529, img: "/images/menu-shahi.jpg", veg: false, tag: "₹50 OFF", originalPrice: 579 },
  { name: "Nawabi Chicken Handi", price: 649, img: "/images/menu-handi-chicken.jpg", veg: false, tag: "₹100 OFF", originalPrice: 749 },
];

export default function Page() {
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
              <a href="/offers" className="text-amber-900 font-semibold">Offers</a>
            </nav>
            <a href="/cart" className="inline-flex items-center rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50 shadow hover:bg-amber-800">Cart</a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="h-full w-full bg-gradient-to-b from-amber-50 to-neutral-50" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Offers</h1>
              <p className="text-neutral-700">Buy 1 Get 1 on select items, bundles, and time-limited deals.</p>
            </div>
            <div className="flex gap-3">
              <a href="/menu" className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-50">View Menu</a>
              <a href="/" className="rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50 hover:bg-amber-800">Back to Home</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OFFERS.map((item) => (
              <article key={item.name} className="group relative overflow-hidden rounded-3xl border bg-white">
                <div className="relative">
                  <img src={item.img} alt={item.name} className="aspect-[4/3] w-full object-cover" />
                  {item.bogo ? (
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
                      Buy 1 Get 1
                    </span>
                  ) : item.tag ? (
                    <span className="absolute left-3 top-3 rounded-full bg-amber-900 px-3 py-1 text-xs font-semibold text-amber-50 shadow">
                      {item.tag}
                    </span>
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold group-hover:text-amber-900">{item.name}</h3>
                      <VegBadge veg={item.veg} />
                    </div>
                    <div className="text-right">
                      {item.originalPrice ? (
                        <div className="space-x-2">
                          <span className="text-xs text-neutral-400 line-through">₹{item.originalPrice}</span>
                          <span className="font-bold">₹{item.price}</span>
                        </div>
                      ) : (
                        <p className="font-bold">₹{item.price}</p>
                      )}
                      <p className="text-xs text-neutral-500">incl. taxes</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-50">Details</button>
                    <button onClick={() => addToCart(item)} className="rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50 hover:bg-amber-800">Add</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
