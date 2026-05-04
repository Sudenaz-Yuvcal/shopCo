import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Button from "../../components/Ui/Button";
import HeroImageWeb from "../../assets/Rectangle-2.png";
import HeroImageMobile from "../../assets/Rectangle.png";
import StarImage from "/Vector.png";
import { HERO_STATS, HERO_BRANDS } from "../../constants/Hero";
import { StatItem } from "../../components/Home/StatItem";
import { useNavigate } from "react-router-dom";

const starPulseStyle = `
  @keyframes starPulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }
  .animate-star-pulse {
  animation: starPulse 3s ease-in-out infinite alternate;
  }
  .eventSlider .swiper-wrapper {
    transition-timing-function: linear !important;
  }
`;

const Hero = () => {
  const navigate = useNavigate();

  const duplicatedBrands = [
    ...HERO_BRANDS,
    ...HERO_BRANDS,
    ...HERO_BRANDS,
    ...HERO_BRANDS,
    ...HERO_BRANDS,
    ...HERO_BRANDS,
  ];

  const handleBrandClick = (brandName: string) => {
    navigate(`/shop?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <div className="relative w-full bg-[#F2F0F1] font-satoshi flex flex-col lg:block lg:h-[calc(100vh-80px)] overflow-hidden">
      <style>{starPulseStyle}</style>

      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-10 flex flex-col pt-10 md:pt-20 lg:h-full text-left">
        <div className="max-w-[620px]">
          <h1 className="text-[36px] text-center md:text-left md:text-[60px] font-[1000] leading-[0.9] mb-6 text-black uppercase tracking-[-0.05em]">
            TARZINIZA UYGUN <br className="hidden md:block" /> KIYAFETLER BULUN
          </h1>
          <p className="text-gray-500 text-center text-sm md:text-base mb-8 md:mb-10 max-w-[480px] leading-relaxed font-medium">
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
        <Swiper
          modules={[Autoplay]}
          loop={true}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          slidesPerView={"auto"}
          spaceBetween={40}
          allowTouchMove={true}
          className="eventSlider"
        >
          {duplicatedBrands.map((brand, i) => (
            <SwiperSlide key={`${brand.name}-${i}`} className="!w-auto">
              <div className="flex items-center px-4">
                <img
                  src={brand.src}
                  className="h-5 md:h-8 object-contain brightness-0 invert opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer"
                  alt={brand.name}
                  onClick={() => handleBrandClick(brand.name)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;
