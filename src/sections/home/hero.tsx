import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import HeroImage from "../../assets/Rectangle-2.png";
import StarImage from "/Vector.png";
import { HERO_STATS, HERO_BRANDS } from "../../constants/Hero";
import { StatItem } from "../../components/home/StatItem";

const starPulseStyle = `
  @keyframes starPulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }
  .animate-star-pulse {
    animation: starPulse 4s ease-in-out infinite;
  }
`;

const Hero = () => {
  return (
    <div className="relative w-full min-h-[700px] lg:h-[calc(100vh-80px)] overflow-hidden bg-[#F2F0F1] font-satoshi">
      <style>{starPulseStyle}</style>

      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={HeroImage}
          alt="Fashion Model"
          className="w-full h-full object-cover object-center md:object-[right_top]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent md:hidden z-10" />
      </div>

      <img
        src={StarImage}
        alt="Star"
        className="absolute right-6 md:right-16 top-[15%] w-14 h-14 md:w-24 md:h-24 z-20 animate-star-pulse"
      />

      <img
        src={StarImage}
        alt="Star"
        className="absolute left-4 md:left-[55%] top-[45%] md:top-[50%] w-8 h-8 md:w-14 md:h-14 z-20 animate-star-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative max-w-7xl mx-auto h-full px-4 md:px-10 z-20 flex flex-col justify-center pt-20 pb-40 md:py-0 text-left">
        <div className="max-w-[620px]">
          <h1 className="text-[44px] md:text-[60px] font-[1000] leading-[0.9] mb-6 text-black uppercase tracking-[-0.05em] italic">
            TARZINIZA UYGUN <br></br>KIYAFETLER BULUN
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
    </div>
  );
};

export default Hero;
