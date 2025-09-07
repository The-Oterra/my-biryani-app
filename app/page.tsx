"use client";

import { useEffect, useRef, useState, RefObject } from "react";

type Item = { name: string; price: number; img: string; tag?: string; veg: boolean };
type Loc = { label: string; lat?: number; lon?: number };

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

function useOutsideClose(open: boolean, onClose: () => void): React.RefObject<HTMLDivElement> {
    const ref = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (!open) return;
            const el = ref.current;
            if (el && e.target instanceof Node && !el.contains(e.target)) onClose();
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, onClose]);

    return ref;
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("reverse geocode failed");
    const data = (await res.json()) as any;
    const a = data.address || {};
    const city = a.city || a.town || a.village || a.suburb || a.state_district;
    const state = a.state || a.region || a.county;
    const country = a.country_code ? String(a.country_code).toUpperCase() : "";
    const parts = [city, state, country].filter(Boolean);
    return parts.join(", ");
}

const KEY = "rbcart";
const LOC_KEY = "rblocation";

function addToCart(item: Item) {
    const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    const list: (Item & { qty: number })[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((i) => i.name === item.name);
    if (idx >= 0) list[idx].qty += 1;
    else list.push({ ...item, qty: 1 });
    localStorage.setItem(KEY, JSON.stringify(list));
    window.location.assign("/cart");
}

const POPULAR: Item[] = [
    { name: "Subz-e-Biryani", price: 269, tag: "Veg", img: "/images/menu-veg.jpg", veg: true },
    { name: "Dum Gosht Biryani", price: 329, tag: "Best Seller", img: "/images/menu-gosht.jpg", veg: false },
    { name: "Murgh Kebab Platter", price: 299, tag: "New", img: "/images/menu-kebab.jpg", veg: false },
    { name: "Shahi Biryani (Serves 2)", price: 529, tag: "Combo", img: "/images/menu-shahi.jpg", veg: false },
    { name: "Haleem Special", price: 299, tag: "Seasonal", img: "/images/menu-haleem.jpg", veg: false },
    { name: "Gulab Jamun (2 pc)", price: 89, tag: "Dessert", img: "/images/menu-dessert.jpg", veg: true },
];

export default function HomePreview() {
    const [loc, setLoc] = useState<Loc | null>(null);
    const [open, setOpen] = useState(false);
    const [changing, setChanging] = useState(false);
    const [manual, setManual] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const ref = useOutsideClose(open, () => setOpen(false));

    useEffect(() => {
        const raw = localStorage.getItem(LOC_KEY);
        if (raw) setLoc(JSON.parse(raw) as Loc);
    }, []);

    async function getLocation() {
        setError(null);
        if (!("geolocation" in navigator)) {
            setError("Geolocation not supported");
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const label = await reverseGeocode(latitude, longitude);
                    const next: Loc = {
                        label: label || `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
                        lat: latitude,
                        lon: longitude,
                    };
                    localStorage.setItem(LOC_KEY, JSON.stringify(next));
                    setLoc(next);
                    setOpen(false);
                    setChanging(false);
                } catch {
                    setError("Could not fetch place name");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setLoading(false);
                setError(err.message || "Permission denied");
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    }

    function saveManual() {
        const label = manual.trim();
        if (!label) return;
        const next: Loc = { label };
        localStorage.setItem(LOC_KEY, JSON.stringify(next));
        setLoc(next);
        setManual("");
        setChanging(false);
        setOpen(false);
    }

    return (
        <main className="min-h-screen bg-neutral-50 text-neutral-900">
            <div className="w-full bg-amber-900 text-amber-50 text-sm py-2 px-4 text-center">
                Crafted fresh • Delivery in ~30–40 mins • 100% hygiene assured
            </div>

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
                            <a href="#story" className="hover:text-amber-900">Our Story</a>
                            <a href="#locations" className="hover:text-amber-900">Locations</a>
                            <a href="#faq" className="hover:text-amber-900">FAQ</a>
                        </nav>
                        <div className="flex items-center gap-2">
                            {!loc ? (
                                <button
                                    onClick={getLocation}
                                    disabled={loading}
                                    className="hidden sm:inline-flex rounded-full border px-4 py-2 text-sm hover:bg-neutral-50 disabled:opacity-60"
                                >
                                    {loading ? "Locating..." : "Locate Me"}
                                </button>
                            ) : (
                                <div className="relative" ref={ref}>
                                    <button
                                        onClick={() => setOpen((v) => !v)}
                                        className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm hover:bg-neutral-50"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                                            <path d="M12 2a1 1 0 0 1 1 1v1.055A8.002 8.002 0 0 1 20.945 11H22a1 1 0 1 1 0 2h-1.055A8.002 8.002 0 0 1 13 20.945V22a1 1 0 1 1-2 0v-1.055A8.002 8.002 0 0 1 3.055 13H2a1 1 0 1 1 0-2h1.055A8.002 8.002 0 0 1 11 3.055V2a1 1 0 0 1 1-1zm0 5a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" />
                                        </svg>
                                        <span className="max-w-[10rem] truncate text-left">{loc.label}</span>
                                    </button>
                                    {open && (
                                        <div className="absolute right-0 mt-2 w-72 rounded-2xl border bg-white p-3 shadow">
                                            {!changing ? (
                                                <div className="space-y-2">
                                                    <div className="text-sm">Delivering to</div>
                                                    <div className="font-medium">{loc.label}</div>
                                                    {error && <div className="text-xs text-rose-600">{error}</div>}
                                                    <button
                                                        onClick={() => setChanging(true)}
                                                        className="mt-2 w-full rounded-full border px-3 py-2 text-sm hover:bg-neutral-50"
                                                    >
                                                        Change location
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="text-sm">Change location</div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={manual}
                                                            onChange={(e) => setManual(e.target.value)}
                                                            placeholder="Enter location manually"
                                                            className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300"
                                                        />
                                                        <button
                                                            onClick={saveManual}
                                                            className="rounded-xl bg-amber-900 px-3 py-2 text-sm font-semibold text-amber-50 hover:bg-amber-800"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={getLocation}
                                                        disabled={loading}
                                                        className="w-full rounded-full border px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-60"
                                                    >
                                                        {loading ? "Getting location..." : "Get location"}
                                                    </button>
                                                    <button onClick={() => setChanging(false)} className="w-full text-sm underline">
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* <a href="#menu" className="inline-flex items-center rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50 shadow hover:bg-amber-800"
              >
                Order Now
              </a> */}
                            <a
                                href="/cart"
                                className="inline-flex items-center rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50 shadow hover:bg-amber-800"
                            >
                                Cart
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <section className="relative overflow-hidden">
                <div className="absolute inset-0" aria-hidden="true">
                    <div className="h-full w-full bg-gradient-to-b from-amber-50 to-neutral-50" />
                </div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                                Taste the <span className="text-amber-800">Royal</span> Biryani
                            </h1>
                            <p className="mt-4 text-lg text-neutral-700">
                                Slow-cooked dum biryanis, kebabs & curries—crafted with aged basmati, saffron, and our guarded spice blend.
                            </p>
                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <a
                                    href="#menu"
                                    className="inline-flex items-center rounded-full bg-amber-900 px-6 py-3 text-amber-50 font-semibold shadow hover:bg-amber-800"
                                >
                                    Order Now
                                </a>
                                <a href="/menu" className="inline-flex items-center rounded-full border px-6 py-3 font-semibold hover:bg-neutral-50">
                                    Look all our menus here →
                                </a>
                            </div>
                            <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                {[
                                    { k: "Cities", v: "> 50" },
                                    { k: "Rating", v: "4.4★" },
                                    { k: "Hygiene", v: "100%" },
                                    { k: "Delivery", v: "30–40m" },
                                ].map(({ k, v }) => (
                                    <div key={k} className="rounded-2xl bg-white p-4 shadow">
                                        <div className="text-2xl font-bold text-amber-900">{v}</div>
                                        <div className="text-xs uppercase tracking-wide text-neutral-500">{k}</div>
                                    </div>
                                ))}
                            </dl>
                        </div>
                        <div className="relative">
                            <img
                                src="/images/hero-biryani.jpg"
                                alt="Signature biryani"
                                className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lg"
                            />
                            <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-2xl bg-white p-4 shadow">
                                <p className="text-sm font-medium">Signature Dum Gosht (Serves 2)</p>
                                <p className="text-xs text-neutral-500">₹499 • includes raita & gulab jamun</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { t: "Dum-Pukht", d: "Sealed handi, slow-cooked for depth", img: "/images/usp-dum.jpg" },
                            { t: "Aged Basmati", d: "Long grains, airy & aromatic", img: "/images/usp-rice.jpg" },
                            { t: "No Added Colors", d: "Only saffron & spice", img: "/images/usp-natural.jpg" },
                            { t: "Tamper-proof", d: "Sealed, spill-safe packaging", img: "/images/usp-packaging.jpg" },
                        ].map(({ t, d, img }) => (
                            <li key={t} className="rounded-2xl border bg-white p-5 text-center">
                                <img src={img} alt={t} className="mx-auto mb-3 h-16 w-16 object-cover rounded-full" />
                                <p className="font-semibold">{t}</p>
                                <p className="text-sm text-neutral-600">{d}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section id="menu" className="py-14 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between">
                        <h2 className="text-2xl sm:text-3xl font-bold">Popular This Week</h2>
                        <a href="/menu" className="text-amber-900 text-sm font-semibold">
                            Look all our menus here →
                        </a>
                    </div>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {POPULAR.map((item) => (
                            <article key={item.name} className="group relative overflow-hidden rounded-3xl border bg-white">
                                <img src={item.img} alt={item.name} className="aspect-[4/3] w-full object-cover" />
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold group-hover:text-amber-900">{item.name}</h3>
                                                <VegBadge veg={item.veg} />
                                            </div>
                                            {item.tag && <p className="text-xs text-neutral-500">{item.tag}</p>}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">₹{item.price}</p>
                                            <p className="text-xs text-neutral-500">incl. taxes</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <button className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-50">Customize</button>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50 hover:bg-amber-800"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="offers" className="py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-gradient-to-r from-amber-900 to-amber-700 p-6 sm:p-8 text-amber-50
                    flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 sm:justify-between
                    overflow-hidden">
                        <div>
                            <h3 className="text-2xl font-bold">Long Lost Biryanis — starting at ₹269</h3>
                            <p className="text-amber-100">Limited-time specials. No coupon required.</p>
                        </div>

                        <img
                            src="/images/offer-banner.jpg"
                            alt="Offers"
                            className="block w-full h-auto sm:w-40 sm:h-28 object-cover rounded-xl"
                        />

                        <a
                            href="/offer"
                            className="inline-flex items-center rounded-full bg-white px-6 py-3 text-amber-900 font-semibold hover:bg-amber-50 self-start sm:self-auto"
                        >
                            Grab the Offer
                        </a>
                    </div>
                </div>
            </section>


            <section id="story" className="py-16 bg-neutral-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-8">Our Story</h2>
                    <div className="grid gap-10 lg:grid-cols-2 items-center">
                        <img
                            src="/images/story.jpg"
                            alt="Our story"
                            className="aspect-[4/3] w-full rounded-3xl object-cover"
                        />
                        <div>
                            <h3 className="text-3xl font-bold">A 2000-year-old legend, reborn</h3>
                            <p className="mt-4 text-neutral-700">
                                Our chefs slow-cook every handi over a gentle flame, letting saffron bloom and spices mingle—an ode to the royal kitchens that inspired us.
                            </p>
                            <ul className="mt-6 space-y-3 text-neutral-700">
                                <li>• Sealed handi dum for authentic depth</li>
                                <li>• Sourced basmati aged 12+ months</li>
                                <li>• Tamper-proof, spill-safe delivery packaging</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold">Order faster on the app</h2>
                            <p className="mt-2 text-neutral-700">Save addresses, track deliveries, and unlock app-only offers.</p>
                            <div className="mt-5 flex gap-3">
                                <a
                                    href="#"
                                    className="flex h-12 w-36 items-center justify-center rounded-xl bg-neutral-900 text-white text-xs"
                                    aria-label="Get it on Google Play"
                                >
                                    Google Play
                                </a>
                                <a
                                    href="#"
                                    className="flex h-12 w-36 items-center justify-center rounded-xl bg-neutral-900 text-white text-xs"
                                    aria-label="Download on the App Store"
                                >
                                    App Store
                                </a>
                            </div>
                        </div>
                        <img src="/images/app-promo.jpg" alt="App promotion" className="aspect-[10/7] w-full rounded-3xl object-cover" />
                    </div>
                </div>
            </section>

            <section id="locations" className="py-14 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold">Find us in 50+ cities</h2>
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
                        {["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Kolkata", "Jaipur", "Lucknow", "Ahmedabad", "Indore", "Surat"].map(
                            (city) => (
                                <a
                                    key={city}
                                    href="#"
                                    className="rounded-full border px-3 py-2 text-center hover:bg-neutral-50 bg-[url('/images/city-placeholder.jpg')] bg-cover bg-center text-white"
                                >
                                    {city}
                                </a>
                            )
                        )}
                    </div>
                </div>
            </section>

            <section id="faq" className="py-16">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center">Frequently Asked Questions</h2>
                    <div className="mt-8 divide-y rounded-2xl border bg-white">
                        {[
                            {
                                q: "Do you deliver to my area?",
                                a: "We deliver across most neighborhoods in major cities. Use ‘Locate Me’ to auto-detect coverage.",
                                img: "/images/faq-delivery.jpg",
                            },
                            { q: "Is packaging spill-proof?", a: "Yes. Every handi is sealed and boxed to arrive hot and intact.", img: "/images/faq-packaging.jpg" },
                            { q: "Can I customize spice levels?", a: "Absolutely—choose Mild, Medium, or Royal (spicy) on the item before adding to cart.", img: "/images/faq-customize.jpg" },
                        ].map(({ q, a, img }) => (
                            <details key={q} className="group p-6">
                                <summary className="cursor-pointer list-none font-semibold flex items-center gap-3">
                                    <img src={img} alt="faq" className="h-8 w-8 rounded-full object-cover" />
                                    {q}
                                    <span className="ml-auto transition group-open:rotate-45">＋</span>
                                </summary>
                                <p className="mt-2 text-neutral-700">{a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="border-t bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-xs text-neutral-500 flex items-center justify-between">
                    <p>© {new Date().getFullYear()} Royal Biryani Co. All rights reserved.</p>
                    <p>
                        Customer care:{" "}
                        <a className="underline" href="tel:+917700050050">
                            +91 77000 50050
                        </a>
                    </p>
                </div>
            </footer>
        </main>
    );
}
