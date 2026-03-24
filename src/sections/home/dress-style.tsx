import DressStyleCard from "../../components/home/DressStyleCard";

interface IDressStyle {
  name: string;
  image: string;
  span: string;
  category: string;
  description: string;
}

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
      <div className="max-w-7xl mx-auto bg-brand-gray rounded-[40px] p-8 md:p-16 text-center">
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
