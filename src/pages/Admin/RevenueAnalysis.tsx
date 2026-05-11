import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { RiArrowLeftLine, RiShoppingBag3Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import type { Order, OrderItem } from "../../types/order";
import type { Product } from "../../types/product";

const categoryMap: Record<string | number, string> = {
  1: "CASUAL",
  2: "FORMAL",
  3: "GYM",
  4: "PARTY",
};

interface ChartDataPoint {
  name: string;
  value: number;
}

interface RecentSale {
  id: string;
  customer_name?: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface AnalysisState {
  totalRevenue: number;
  topCategory: string;
  topBrand: string;
  chartData: ChartDataPoint[];
  recentSales: RecentSale[];
}

type FilterType = "1D" | "1M" | "1Y" | "ALL";

export default function RevenueAnalysis() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    totalRevenue: 0,
    topCategory: "---",
    topBrand: "---",
    chartData: [],
    recentSales: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [ordersRes, productsRes] = await Promise.all([
          supabase.from("orders").select("*"),
          supabase.from("products").select("*"),
        ]);

        if (ordersRes.data) {
          const orders = ordersRes.data as Order[];
          const products = (productsRes.data as Product[]) || [];
          setAllOrders(orders);
          runAnalysis(orders, products, "ALL");
        }
      } catch (err) {
        console.error("Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (allOrders.length > 0) {
      runAnalysis(allOrders, [], activeFilter);
    }
  }, [activeFilter, allOrders]);

  const runAnalysis = async (
    orders: Order[],
    products: Product[],
    filter: FilterType,
  ) => {
    let currentProducts: Product[] = products;

    if (currentProducts.length === 0) {
      const { data } = await supabase.from("products").select("*");
      currentProducts = (data as Product[]) || [];
    }

    const productsMap = new Map(currentProducts.map((p) => [Number(p.id), p]));
    const now = new Date();

    const filteredOrders = orders.filter((o) => {
      if (filter === "ALL") return true;
      const orderDate = new Date(o.created_at);
      if (filter === "1D")
        return orderDate.toDateString() === now.toDateString();
      if (filter === "1M")
        return now.getTime() - orderDate.getTime() < 30 * 24 * 60 * 60 * 1000;
      if (filter === "1Y")
        return now.getTime() - orderDate.getTime() < 365 * 24 * 60 * 60 * 1000;
      return true;
    });

    const total = filteredOrders.reduce(
      (sum: number, o: Order) => sum + (o.total_amount || 0),
      0,
    );

    const timeMap: Record<string, number> = {};
    const brandCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    filteredOrders.forEach((order: Order) => {
      const d = new Date(order.created_at);
      const label = d.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
      });

      timeMap[label] = (timeMap[label] || 0) + (order.total_amount || 0);

      let items: OrderItem[] = [];

      try {
        items =
          typeof order.items === "string"
            ? JSON.parse(order.items)
            : (order.items as OrderItem[]);
      } catch (e) {
        console.error("Items parse hatası:", e);
      }

      if (Array.isArray(items)) {
        items.forEach((item: OrderItem) => {
          const p = productsMap.get(Number(item.id));
          if (p) {
            const brand = p.brand || "Unknown";
            const catName = categoryMap[String(p.category_id)] || "Genel";
            brandCounts[brand] = (brandCounts[brand] || 0) + 1;
            categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
          }
        });
      }
    });

    setAnalysis({
      totalRevenue: total,
      topCategory:
        Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        "---",
      topBrand:
        Object.entries(brandCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        "---",
      chartData: Object.entries(timeMap).map(([name, value]) => ({
        name,
        value,
      })),
      recentSales: filteredOrders.slice(-5).reverse() as RecentSale[],
    });
  };

  if (loading)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest animate-pulse">
        ANALİZ YÜKLENİYOR...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-satoshi">
      <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <RiArrowLeftLine size={20} />
          </button>
          <h1 className="text-xl font-bold uppercase tracking-widest font-integral italic">
            Analiz <span className="text-[#22c55e]">Paneli</span>
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
            Toplam Ciro
          </p>
          <p className="text-3xl font-black italic text-[#22c55e] font-integral tracking-tight">
            ${analysis.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5">
            <p className="text-[9px] font-black text-zinc-600 uppercase mb-2">
              Trend Kategori
            </p>
            <p className="text-lg font-bold italic font-integral text-white">
              {analysis.topCategory}
            </p>
          </div>
          <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5">
            <p className="text-[9px] font-black text-zinc-600 uppercase mb-2">
              En Çok Satan Marka
            </p>
            <p className="text-lg font-bold italic font-integral text-white">
              {analysis.topBrand}
            </p>
          </div>

          <div className="bg-white text-black p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-zinc-400">
              <RiShoppingBag3Line />
              <span className="text-[10px] font-black uppercase">
                Son Siparişler
              </span>
            </div>
            <div className="space-y-4">
              {analysis.recentSales.map((sale, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-black/5 pb-2"
                >
                  <span className="text-xs font-bold">
                    #{sale.id.slice(0, 6)}
                  </span>
                  <span className="text-sm font-black italic font-integral text-[#22c55e]">
                    ${sale.total_amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center bg-zinc-900/40 p-2 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 px-4">
              <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Canlı Veri Takibi
              </span>
            </div>
            <div className="flex gap-1">
              {(
                [
                  ["1D", "1 Gün"],
                  ["1M", "1 Ay"],
                  ["1Y", "1 Yıl"],
                  ["ALL", "Hepsi"],
                ] as [FilterType, string][]
              ).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setActiveFilter(val)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black transition-all ${activeFilter === val ? "bg-[#22c55e] text-black" : "text-zinc-600 hover:text-white"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[400px] bg-zinc-900/20 p-6 rounded-[40px] border border-white/5 shadow-[inset_0_0_20px_rgba(34,197,94,0.02)]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[...analysis.chartData].sort((a, b) =>
                  a.name.localeCompare(b.name),
                )}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="5 5"
                  stroke="#ffffff10"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#555"
                  fontSize={10}
                  fontWeight={700}
                  axisLine={false}
                  tickLine={false}
                  dy={15}
                />
                <YAxis hide={true} domain={["dataMin - 10", "dataMax + 10"]} />
                <Tooltip
                  cursor={{
                    stroke: "#22c55e",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #22c55e30",
                    borderRadius: "16px",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#22c55e", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={4}
                  fill="url(#g)"
                  animationDuration={1500}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#22c55e" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
