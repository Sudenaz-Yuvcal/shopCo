import { Link } from "react-router-dom";

interface IDressStyle {
  name: string;
  image: string;
  span: string;
  category: string;
  description: string;
}

const DressStyleCard = ({ style }: { style: IDressStyle }) => {
  return (
    <Link
      to={`/shop?category=${style.category}`}
      className={`relative group overflow-hidden rounded-[32px] bg-zinc-100 h-[200px] md:h-[280px] ${style.span} transition-transform duration-500 hover:scale-[0.98]`}
    >
      <img
        src={style.image}
        alt={style.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-left">
        <h3 className="text-white text-2xl md:text-3xl font-[1000] italic uppercase leading-none tracking-tighter">
          {style.name}
        </h3>
        <p className="text-white/60 text-[10px] md:text-xs font-black uppercase tracking-widest mt-2">
          {style.description}
        </p>
      </div>
    </Link>
  );
};

const DressStyle = () => {
  const STYLES: IDressStyle[] = [
    {
      name: "CASUAL",
      image: "/Frame-55.png",
      span: "md:col-span-1",
      category: "casual",
      description: "Gündelik şıklığın en rafine hali.",
    },
    {
      name: "FORMAL",
      image: "/Frame-56.png",
      span: "md:col-span-2",
      category: "formal",
      description: "Ofis ve özel davetler için kusursuz kesimler.",
    },
    {
      name: "PARTY",
      image: "/Frame-57.png",
      span: "md:col-span-2",
      category: "party",
      description: "Gecenin parlayan yıldızı siz olun.",
    },
    {
      name: "GYM",
      image: "/Frame-58.png",
      span: "md:col-span-1",
      category: "gym",
      description: "Performans ve stil antrenmanda buluştu.",
    },
  ];

  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-7xl mx-auto bg-[#F0F0F0] rounded-[40px] p-8 md:p-16 text-center">
        <h2 className="text-4xl md:text-6xl font-[1000] text-black italic uppercase tracking-tighter mb-12">
          STİLİNE GÖRE GÖZ AT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STYLES.map((style) => (
            <DressStyleCard key={style.name} style={style} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DressStyle;
