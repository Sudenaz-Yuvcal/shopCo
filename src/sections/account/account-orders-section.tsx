import { FiPackage, FiShoppingBag } from "react-icons/fi";

interface OrderItem {
  image: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
}

interface Order {
  id: string | number;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface OrdersSectionProps {
  orders: Order[];
}

const OrdersSection = ({ orders }: OrdersSectionProps) => (
  <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-10">
    <div className="flex items-center justify-between">
      <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter">
        SİPARİŞ GEÇMİŞİ ({orders.length})
      </h3>
      <FiPackage className="opacity-10" size={40} />
    </div>

    {orders.length > 0 ? (
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm hover:shadow-xl transition-shadow group"
          >
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 border-b border-zinc-50 pb-6 mb-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-none">
                  TAKİP NO: {order.id}
                </p>
                <p className="font-black text-lg italic uppercase">
                  {order.date}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">
                    DURUM
                  </p>
                  <span className="bg-zinc-100 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic group-hover:bg-black group-hover:text-white transition-colors">
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">
                    TOPLAM
                  </p>
                  <p className="font-[1000] text-2xl tracking-tighter italic">
                    ${order.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-zinc-50 p-4 rounded-3xl border border-transparent hover:border-zinc-200 transition-all"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      className="w-14 h-14 object-cover rounded-2xl grayscale hover:grayscale-0 transition-all shadow-md"
                      alt={item.name}
                    />
                  ) : (
                    <div className="w-14 h-14 bg-zinc-200 rounded-2xl flex items-center justify-center text-[8px] font-black italic text-zinc-400 text-center px-1">
                      NO IMAGE
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-[1000] uppercase italic truncate leading-none mb-2">
                      {item.name}
                    </h4>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                      {item.size} • {item.color} • {item.quantity} ADET
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="py-32 flex flex-col items-center justify-center border-4 border-dashed border-zinc-100 rounded-[50px] opacity-30">
        <FiShoppingBag size={60} className="mb-4" />
        <p className="font-black text-[11px] uppercase tracking-[0.4em] italic">
          Henüz alışveriş yapılmadı
        </p>
      </div>
    )}
  </div>
);

export default OrdersSection;
