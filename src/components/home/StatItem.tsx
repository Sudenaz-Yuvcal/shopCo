import React from "react";

interface StatItemProps {
  value: string;
  label: string;
}

export const StatItem = ({ value, label }: StatItemProps) => {
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
