interface CountdownUnitProps {
  label: string;
  value: number;
}

export const CountdownUnit = ({ label, value }: CountdownUnitProps) => {
  const formatTime = (num: number) => (num || 0).toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center min-w-[60px] md:min-w-[100px]">
      <span className="text-3xl md:text-5xl font-[1000] text-white tabular-nums tracking-tighter">
        {formatTime(value)}
      </span>
      <span className="text-[8px] md:text-[10px] font-black text-zinc-500 tracking-[0.3em] mt-2 uppercase">
        {label}
      </span>
    </div>
  );
};
