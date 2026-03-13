import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "white" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  size = "md", 
  className = "",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-black uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-center";

  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800 shadow-lg shadow-black/10",
    outline:
      "border-2 border-zinc-100 text-black hover:border-black hover:bg-black hover:text-white",
    white: "bg-white text-black hover:bg-zinc-100 shadow-xl",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-6 py-2.5 text-[10px]",
    md: "px-8 py-4 text-xs",
    lg: "px-12 py-5 text-sm",
    xl: "px-16 py-6 text-base md:text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Yükleniyor...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
