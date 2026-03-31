import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Ui/Button";
import HeroImageWeb from "../../assets/Rectangle-2.png";
import HeroImageMobile from "../../assets/Rectangle.png";
import StarImage from "/Vector.png";
import { HERO_STATS, HERO_BRANDS } from "../../constants/Hero";
import { StatItem } from "../../components/Home/StatItem";

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
    <div className="relative w-full bg-[#F2F0F1] font-satoshi flex flex-col lg:block lg:h-[calc(100vh-80px)] overflow-hidden">
      <style>{starPulseStyle}</style>

      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-10 flex flex-col pt-10 md:pt-20 lg:h-full text-left">
        <div className="max-w-[620px]">
          <h1 className="text-[36px] text-center md:text-left md:text-[60px] font-[1000] leading-[0.9] mb-6 text-black uppercase tracking-[-0.05em] italic">
            TARZINIZA UYGUN <br className="hidden md:block" /> KIYAFETLER BULUN
          </h1>
          <p className="text-gray-500  text-center text-sm md:text-base mb-8 md:mb-10 max-w-[480px] leading-relaxed font-medium">
            Kişiliğinizi ortaya çıkarmak ve stil anlayışınıza hitap etmek için
            tasarlanmış, özenle hazırlanmış çeşitli giysilerimize göz atın.
          </p>

          <Link
            to="/shop"
            className="inline-block w-full md:w-auto mb-10 md:mb-16"
          >
            <Button
              variant="primary"
              size="xl"
              className="w-full md:w-auto shadow-2xl italic font-black uppercase"
            >
              ŞİMDİ KEŞFET →
            </Button>
          </Link>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-6 pb-10 lg:pb-0">
            {HERO_STATS.map((stat, index) => (
              <React.Fragment key={stat.label}>
                <StatItem value={stat.value} label={stat.label} />
                {index < HERO_STATS.length - 1 && (
                  <div className="w-[1px] h-8 bg-black/10 hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="relative lg:absolute lg:inset-0 w-full z-0 flex items-end">
        <img
          src={HeroImageMobile}
          alt="Fashion Model Mobile"
          className="w-full h-auto object-cover lg:hidden"
        />

        <img
          src={HeroImageWeb}
          alt="Fashion Model Web"
          className="hidden lg:block w-full h-full object-cover object-center md:object-[right_top]"
        />

        <img
          src={StarImage}
          alt="Star"
          className="absolute right-6 md:right-16 top-[10%] lg:top-[15%] w-12 h-12 md:w-24 md:h-24 z-20 animate-star-pulse"
        />
        <img
          src={StarImage}
          alt="Star"
          className="absolute left-6 md:left-[55%] top-[40%] md:top-[50%] w-7 h-7 md:w-14 md:h-14 z-20 animate-star-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative lg:absolute lg:bottom-0 left-0 w-full bg-black py-6 md:py-8 z-30 overflow-hidden">
        <div className="flex items-center">
          <div className="flex animate-marquee whitespace-nowrap gap-x-12 md:gap-x-20 items-center px-4">
            {[...HERO_BRANDS, ...HERO_BRANDS].map((brand, i) => (
              <button
                key={brand.name + i}
                onClick={() => console.log(`${brand.name} tıklandı!`)} 
                className="shrink-0 outline-none group"
              >
                <img
                  src={brand.src}
                  className="h-5 md:h-8 object-contain brightness-0 invert opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 cursor-pointer"
                  alt={brand.name}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Hero;
