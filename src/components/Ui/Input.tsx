import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, className = "", ...props }, ref) => {
    const inputStyles = `
      w-full p-4 bg-[#F8F8F8] rounded-xl outline-none border transition-all duration-300
      text-[13px] font-medium tracking-wide placeholder:text-zinc-400 placeholder:italic
      focus:bg-white focus:shadow-[0_10px_30px_rgba(0,0,0,0.05)]
      ${
        error
          ? "border-red-500/50 text-red-600 focus:border-red-500"
          : "border-transparent focus:border-black/10 text-black"
      } 
      ${className}
    `.trim();

    return (
      <div className="w-full space-y-2 text-left">
        {label && (
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] italic text-zinc-500 ml-1">
            {label}
          </label>
        )}

        <div className="relative group">
          <input ref={ref} className={inputStyles} {...props} />

          {typeof error === "string" && (
            <p className="mt-1.5 text-[9px] font-bold uppercase tracking-widest text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
