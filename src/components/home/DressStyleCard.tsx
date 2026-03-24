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
export default DressStyleCard;
