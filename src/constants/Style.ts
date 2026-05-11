export const DRESS_STYLES = [
  {
    name: "CASUAL",
    image: "/styles/casual-vibe.jpg",
    span: "md:col-span-1",
    category: "casual",
    description: "Gündelik şıklığın en rafine hali.",
  },
  {
    name: "FORMAL",
    image: "/styles/formal-luxury.jpg",
    span: "md:col-span-2",
    category: "formal",
    description: "Ofis ve özel davetler için kusursuz kesimler.",
  },
  {
    name: "GYM",
    image: "/styles/active-performance.jpg",
    span: "md:col-span-1",
    category: "gym",
    description: "Performans ve stil antrenmanda buluşuyor.",
  },
  {
    name: "PARTY",
    image: "/styles/night-out.jpg",
    span: "md:col-span-2",
    category: "party",
    description: "Gecenin parlayan yıldızı olmaya hazır mısın?",
  },
] as const;

export type DressStyle = (typeof DRESS_STYLES)[number];

export const CATEGORY_OPTIONS = [
  { id: "1", name: "Casual" },
  { id: "2", name: "Formal" },
  { id: "3", name: "Gym" },
  { id: "4", name: "Party" },
];

export const CATEGORIES = [
  { id: 1, name: "Casual" },
  { id: 2, name: "Formal" },
  { id: 3, name: "Gym" },
  { id: 4, name: "Party" },
];

export const COLOR_PALETTE = [
  { name: "Mavi", id: "#31344F", hex: "#31344F", tailwind: "bg-[#31344F]" },
  { name: "Haki", id: "#4F4631", hex: "#4F4631", tailwind: "bg-[#4F4631]" },
  { name: "Siyah", id: "#000000", hex: "#000000", tailwind: "bg-[#000000]" },
  {
    name: "Beyaz",
    id: "#FFFFFF",
    hex: "#FFFFFF",
    tailwind: "bg-[#FFFFFF] border border-zinc-200",
  },
  {
    name: "Kırmızı",
    id: "#FF3333",
    hex: "#FF3333",
    tailwind: "bg-[#FF3333]",
  },
];

export const AVAILABLE_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
];
