import { Helmet } from "react-helmet-async";
import Hero from "../sections/home/hero";
import NewArrivals from "../sections/home/new-arrivals";
import TopSelling from "../sections/home/top-selling";
import DressStyle from "../sections/home/dress-style";
import Customers from "../sections/home/customers";

const Home = () => {
  return (
    <div className="flex flex-col w-full bg-white overflow-hidden">
      <Helmet>
        <title>Shop.co | Ana Sayfa - Tarzını Keşfet</title>
        <meta
          name="description"
          content="Shop.co ile modanın kalbine yolculuk yapın. En yeni trendler, dünya markaları ve size özel stil önerileriyle online alışverişin keyfini çıkarın!"
        />
      </Helmet>

      <section className="animate-in fade-in duration-1000">
        <Hero />
      </section>

      <main className="space-y-20 py-10 md:py-20">
        <section className="animate-in slide-in-from-bottom-10 duration-700">
          <NewArrivals />
        </section>

        <div className="max-w-7xl mx-auto px-6">
          <hr className="border-zinc-100" />
        </div>

        <section className="animate-in slide-in-from-bottom-10 duration-700 delay-100">
          <TopSelling />
        </section>

        <section className="animate-in slide-in-from-bottom-10 duration-700 delay-200">
          <DressStyle />
        </section>

        <section className="pb-10 md:pb-20">
          <Customers />
        </section>
      </main>
    </div>
  );
};

export default Home;
