"use client";

type Item = { name: string; price: number; img: string; veg: boolean };
type Category = { key: string; title: string; items: Item[] };

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

function addToCart(item: Item) {
  const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
  const list: (Item & { qty: number })[] = raw ? JSON.parse(raw) : [];
  const idx = list.findIndex((i) => i.name === item.name);
  if (idx >= 0) list[idx].qty += 1; else list.push({ ...item, qty: 1 });
  localStorage.setItem(KEY, JSON.stringify(list));
  window.location.assign("/cart");
}

const CATEGORIES: Category[] = [
  { key: "recommended", title: "Recommended For You", items: [
    { name: "Dum Gosht Biryani", price: 329, img: "/images/menu-gosht.jpg", veg: false },
    { name: "Subz-e-Biryani", price: 269, img: "/images/menu-veg.jpg", veg: true },
    { name: "Shahi Biryani (Serves 2)", price: 529, img: "/images/menu-shahi.jpg", veg: false },
  ]},
  { key: "classic", title: "Classic Biryani", items: [
    { name: "Chicken Dum Biryani", price: 299, img: "/images/menu-chicken.jpg", veg: false },
    { name: "Veg Dum Biryani", price: 259, img: "/images/menu-veg.jpg", veg: true },
  ]},
  { key: "hyderabadi", title: "Hyderabadi Biryani", items: [
    { name: "Hyderabadi Chicken Biryani", price: 319, img: "/images/menu-hyd-chicken.jpg", veg: false },
    { name: "Hyderabadi Mutton Biryani", price: 379, img: "/images/menu-hyd-mutton.jpg", veg: false },
    { name: "Hyderabadi Veg Biryani", price: 279, img: "/images/menu-hyd-veg.jpg", veg: true },
  ]},
  { key: "thali", title: "Biryani and Kebab Thali", items: [
    { name: "Chicken Biryani + Kebabs Thali", price: 399, img: "/images/menu-thali-chicken.jpg", veg: false },
    { name: "Veg Biryani + Kebabs Thali", price: 359, img: "/images/menu-thali-veg.jpg", veg: true },
  ]},
  { key: "lto", title: "Limited Time Specials", items: [
    { name: "Haleem Special", price: 299, img: "/images/menu-haleem.jpg", veg: false },
    { name: "Saffron Zafrani Biryani", price: 349, img: "/images/menu-zafrani.jpg", veg: false },
  ]},
  { key: "curries", title: "Royal Curries & Breads", items: [
    { name: "Murgh Makhani", price: 299, img: "/images/menu-curry-butterchicken.jpg", veg: false },
    { name: "Ghost Pepper Korma", price: 329, img: "/images/menu-curry-korma.jpg", veg: false },
    { name: "Tandoori Roti (2)", price: 49, img: "/images/menu-bread-roti.jpg", veg: true },
    { name: "Butter Naan", price: 69, img: "/images/menu-bread-naan.jpg", veg: true },
  ]},
  { key: "metalhandi", title: "Metal Handi - Nawabi Biryani (Serves 2)", items: [
    { name: "Nawabi Chicken Handi", price: 649, img: "/images/menu-handi-chicken.jpg", veg: false },
    { name: "Nawabi Mutton Handi", price: 749, img: "/images/menu-handi-mutton.jpg", veg: false },
  ]},
  { key: "starters", title: "Starters", items: [
    { name: "Murgh Seekh Kebab", price: 299, img: "/images/menu-kebab.jpg", veg: false },
    { name: "Paneer Tikka", price: 279, img: "/images/menu-starter-paneer.jpg", veg: true },
    { name: "Tandoori Chicken (Half)", price: 349, img: "/images/menu-starter-tandoori.jpg", veg: false },
  ]},
  { key: "sides", title: "Sides", items: [
    { name: "Raita", price: 49, img: "/images/menu-side-raita.jpg", veg: true },
    { name: "Mirchi Ka Salan", price: 69, img: "/images/menu-side-salan.jpg", veg: true },
    { name: "Papad (2)", price: 29, img: "/images/menu-side-papad.jpg", veg: true },
  ]},
  { key: "desserts", title: "Desserts & Beverages", items: [
    { name: "Gulab Jamun (2 pc)", price: 89, img: "/images/menu-dessert.jpg", veg: true },
    { name: "Phirni", price: 99, img: "/images/menu-dessert-phirni.jpg", veg: true },
    { name: "Masala Chaas", price: 79, img: "/images/menu-bev-chaas.jpg", veg: true },
  ]},
  { key: "combos", title: "Combos", items: [
    { name: "Chicken Biryani + Pepsi", price: 349, img: "/images/menu-combo-chicken.jpg", veg: false },
    { name: "Veg Biryani + Gulab Jamun", price: 329, img: "/images/menu-combo-veg.jpg", veg: true },
    { name: "Family Feast (Serves 4)", price: 1249, img: "/images/menu-combo-family.jpg", veg: false },
  ]},
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
              <a href="/" className="hover:text-amber-900">Home</a>
              <a href="#combos" className="hover:text-amber-900">Combos</a>
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
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Our Menu</h1>
              <p className="text-neutral-700">Explore categories and pick your feast.</p>
            </div>
            <div className="flex gap-3">
              <a href="#combos" className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-50">See Combos</a>
              <a href="/" className="rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50 hover:bg-amber-800">Back to Home</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {CATEGORIES.map((c) => (
              <a key={c.key} href={`#${c.key}`} className="rounded-full border px-3 py-2 text-center text-sm hover:bg-neutral-50">
                {c.title} ({c.items.length})
              </a>
            ))}
          </div>
        </div>
      </section>

      {CATEGORIES.map((c) => (
        <section id={c.key} key={c.key} className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold">{c.title} ({c.items.length})</h2>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {c.items.map((item) => (
                <article key={item.name} className="group relative overflow-hidden rounded-3xl border bg-white">
                  <img src={item.img} alt={item.name} className="aspect-[4/3] w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold group-hover:text-amber-900">{item.name}</h3>
                        <VegBadge veg={item.veg} />
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{item.price}</p>
                        <p className="text-xs text-neutral-500">incl. taxes</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <button className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-50">Customize</button>
                      <button onClick={() => addToCart(item)} className="rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50 hover:bg-amber-800">Add</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section id="combos" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-amber-900 to-amber-700 p-8 text-amber-50 flex items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold">Combo Deals</h3>
              <p className="text-amber-100">Perfect pairings for a royal feast.</p>
            </div>
            <a href="#recommended" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-amber-900 font-semibold hover:bg-amber-50">Back to Top</a>
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
