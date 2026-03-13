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
    name: "PARTY",
    image: "/styles/night-out.jpg",
    span: "md:col-span-2",
    category: "party",
    description: "Gecenin parlayan yıldızı olmaya hazır mısın?",
  },
  {
    name: "GYM",
    image: "/styles/active-performance.jpg",
    span: "md:col-span-1",
    category: "gym",
    description: "Performans ve stil antrenmanda buluşuyor.",
  },
] as const;

export type DressStyle = (typeof DRESS_STYLES)[number];
