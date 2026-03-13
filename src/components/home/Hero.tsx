import React from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import HeroImage from "../../assets/Rectangle-2.png";
import { HERO_STATS, HERO_BRANDS } from "../../constants/Hero";

const StatItem = ({ value, label }: { value: string; label: string }) => {
  const [count, setCount] = React.useState(0);
  const [pulse, setPulse] = React.useState(false);

  const number = Number(value.replace(/\D/g, "")) || 0;
  const suffix = value.replace(/[0-9,]/g, "");

  React.useEffect(() => {
    setCount(0);
    setPulse(false);

    const timeout = setTimeout(() => {
      let start = 0;
      const duration = 1500;
      const step = 20;
      const increment = number / (duration / step);

      const timer = setInterval(() => {
        start += increment;

        if (start >= number) {
          start = number;
          clearInterval(timer);
          setPulse(true);
          setTimeout(() => setPulse(false), 400);
        }

        setCount(Math.floor(start));
      }, step);
    }, 50);

    return () => clearTimeout(timeout);
  }, [number]);

  return (
    <div className="text-center md:text-left">
      <h3
        className={`text-2xl md:text-[32px] font-medium text-black tracking-tighter leading-none mb-1 transition-transform duration-300 ${
          pulse ? "scale-125" : "scale-100"
        }`}
      >
        {count.toLocaleString()}
        {suffix}
      </h3>
      <p className="text-gray-400 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em]">
        {label}
      </p>
    </div>
  );
};
const Hero = () => {
  return (
    <section className="relative w-full min-h-[700px] lg:h-[calc(100vh-80px)] overflow-hidden bg-[#F2F0F1] font-satoshi">
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={HeroImage}
          alt="Fashion Model"
          className="w-full h-full object-cover object-center md:object-[right_top]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent md:hidden z-10" />
      </div>

      <div className="relative max-w-7xl mx-auto h-full px-4 md:px-10 z-20 flex flex-col justify-center pt-20 pb-40 md:py-0 text-left">
        <div className="max-w-[620px]">
          <h1 className="text-[44px] md:text-[60px] font-[1000] leading-[0.9] mb-6 text-black uppercase tracking-[-0.05em] italic">
            TARZINIZA UYGUN <br /> KIYAFETLER BULUN
          </h1>

          <p className="text-gray-500 text-sm md:text-base mb-10 max-w-[480px] leading-relaxed font-medium">
            Kişiliğinizi ortaya çıkarmak ve stil anlayışınıza hitap etmek için
            tasarlanmış, özenle hazırlanmış çeşitli giysilerimize göz atın.
          </p>

          <Link to="/shop" className="inline-block w-full md:w-auto mb-16">
            <Button variant="primary" size="xl" className="shadow-2xl italic">
              ŞİMDİ KEŞFET →
            </Button>
          </Link>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-12 gap-y-8">
            {HERO_STATS.map((stat, index) => (
              <React.Fragment key={stat.label}>
                <StatItem value={stat.value} label={stat.label} />
                {index < HERO_STATS.length - 1 && (
                  <div className="w-[1px] h-10 bg-black/10 hidden lg:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-black py-8 md:py-12 z-30 overflow-hidden">
        <div className="marquee flex gap-x-10 md:gap-x-16">
          {[...HERO_BRANDS, ...HERO_BRANDS].map((brand, i) => (
            <img
              key={brand.name + i}
              src={brand.src}
              className="h-6 md:h-8 object-contain brightness-0 invert hover:scale-110 transition-transform cursor-pointer"
              alt={brand.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
