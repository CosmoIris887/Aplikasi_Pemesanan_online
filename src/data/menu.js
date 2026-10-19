export const MENU_DATA = [
  {
    id: "mie-gomak",
    name: "Spaghetti Medan (Mie Gomak)",
    category: "Masakan Medan",
    description: "Mie khas Medan berbumbu rempah autentik dengan kuah gurih beraroma andaliman.",
    price: 30000,
    priceLabel: "Rp30.000",
    image: "/images/mie-gomak.jpg",
    hasVariants: true,
    variants: [
      { name: "Kuah Susu", price: 30000, label: "Kuah Susu — Rp30.000" },
      { name: "Original Santan", price: 30000, label: "Original Santan — Rp30.000" }
    ],
    isHalal: true,
    badge: "Favorit"
  },
  {
    id: "bakso-sapi",
    name: "Bakso Sapi Kuah",
    category: "Masakan Medan",
    description: "Bakso sapi kenyal gurih disajikan dengan kuah kaldu sapi kaya rempah khas Medan.",
    price: 35000,
    priceLabel: "Rp35.000",
    image: "/images/hero.jpg",
    hasVariants: false,
    isHalal: true
  },
  {
    id: "ikan-arsik",
    name: "Ikan Mas Arsik",
    category: "Masakan Medan",
    description: "Olahan ikan mas tradisional Batak dibumbu kuning khas dengan andaliman dan kecombrang.",
    price: 25000,
    priceLabel: "Mulai Rp25.000",
    image: "/images/ikan-arsik.jpg",
    hasVariants: true,
    variants: [
      { name: "Per Potong", price: 25000, label: "Per Potong — Rp25.000" },
      { name: "Per Box isi 4", price: 80000, label: "Per Box isi 4 — Rp80.000" }
    ],
    isHalal: true,
    badge: "Khas Medan"
  },
  {
    id: "rendang-sapi",
    name: "Rendang Sapi",
    category: "Masakan Medan",
    description: "Daging sapi pilihan dimasak perlahan hingga bumbu meresap sempurna, empuk dan kaya rasa.",
    price: 20000,
    priceLabel: "Mulai Rp20.000",
    image: "/images/rendang-sapi.jpg",
    hasVariants: true,
    variants: [
      { name: "Per Potong", price: 20000, label: "Per Potong — Rp20.000" },
      { name: "Per Box isi 5", price: 95000, label: "Per Box isi 5 — Rp95.000" },
      { name: "Per Box isi 10", price: 190000, label: "Per Box isi 10 — Rp190.000" }
    ],
    isHalal: true,
    badge: "Best Seller"
  },
  {
    id: "teri-medan",
    name: "Teri Medan Kacang Sambal Balado",
    category: "Masakan Medan",
    description: "Teri Medan renyah dipadu kacang goreng dan sambal balado pedas manis dalam kemasan jar praktis.",
    price: 50000,
    priceLabel: "Per Jar — Rp50.000",
    image: "/images/teri-cumi.jpg",
    hasVariants: false,
    isHalal: true,
    badge: "Kemasan Jar"
  },
  {
    id: "cumi-asin",
    name: "Cumi Asin Sambal Balado",
    category: "Masakan Medan",
    description: "Cumi asin gurih berdaging kenyal ditumis dengan sambal balado merah meriah dalam kemasan jar.",
    price: 45000,
    priceLabel: "Per Jar — Rp45.000",
    image: "/images/teri-cumi.jpg",
    hasVariants: false,
    isHalal: true,
    badge: "Kemasan Jar"
  },
  {
    id: "paket-rendang",
    name: "Paket Nasi Rendang",
    category: "Menu Paket",
    description: "Nasi putih hangat disajikan lengkap dengan Rendang Sapi empuk, sayuran, dan sambal khas.",
    price: 35000,
    priceLabel: "Rp35.000",
    image: "/images/rendang-sapi.jpg",
    hasVariants: false,
    isHalal: true,
    isFeatured: true,
    badge: "Paket Lengkap"
  },
  {
    id: "paket-arsik",
    name: "Paket Nasi Ikan Mas Arsik",
    category: "Menu Paket",
    description: "Nasi porsi kenyang berpadu Ikan Mas Arsik bumbu kuning rempah melimpah dan lauk pelengkap.",
    price: 30000,
    priceLabel: "Rp30.000",
    image: "/images/ikan-arsik.jpg",
    hasVariants: false,
    isHalal: true,
    isFeatured: true,
    badge: "Paket Lengkap"
  },
  {
    id: "babi-panggang",
    name: "Babi Panggang",
    category: "Non Halal",
    description: "Daging babi garing gurih dipanggang khas Karo dengan bumbu dan sambal pendamping mantap.",
    price: 70000,
    priceLabel: "Box Kecil — Rp70.000",
    image: "/images/babi-panggang.jpg",
    hasVariants: false,
    isHalal: false,
    badge: "NON HALAL"
  },
  {
    id: "babi-saksang",
    name: "Babi Saksang",
    category: "Non Halal",
    description: "Olahan daging babi cincang berempah andaliman yang kaya rasa tradisional khas Tapanuli.",
    price: 60000,
    priceLabel: "Box Kecil — Rp60.000",
    image: "/images/babi-panggang.jpg",
    hasVariants: false,
    isHalal: false,
    badge: "NON HALAL"
  },
  {
    id: "paket-babi-panggang",
    name: "Paket Nasi Babi Panggang",
    category: "Non Halal",
    description: "Nasi hangat komplit dengan Babi Panggang garing, daun singkong tumbuk, dan kuah sup.",
    price: 40000,
    priceLabel: "Rp40.000",
    image: "/images/babi-panggang.jpg",
    hasVariants: false,
    isHalal: false,
    badge: "NON HALAL"
  },
  {
    id: "paket-babi-saksang",
    name: "Paket Nasi Babi Saksang",
    category: "Non Halal",
    description: "Nasi porsi komplit disajikan bersama Babi Saksang rempah andaliman dan pelengkap hidangan.",
    price: 35000,
    priceLabel: "Rp35.000",
    image: "/images/babi-panggang.jpg",
    hasVariants: false,
    isHalal: false,
    badge: "NON HALAL"
  }
];

export const WA_NUMBERS = [
  { display: "0812-8109-8500", raw: "6281281098500", label: "WhatsApp Utama" },
  { display: "0821-2313-5348", raw: "6282123135348", label: "WhatsApp CS 2" }
];

export const CATEGORIES = [
  { key: "Semua", label: "Semua Menu" },
  { key: "Masakan Medan", label: "Masakan Medan" },
  { key: "Menu Paket", label: "Menu Paket" },
  { key: "Non Halal", label: "Non Halal" }
];
