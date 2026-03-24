import React from "react";

type Props = {
  title: string;
  className?:string;
};

const Title = ({ title,className }: Props) => {
  return (
    <h2 className={`${className} text-[32px] md:text-[48px] font-[1000] text-center mb-8 md:mb-14 uppercase tracking-tighter`}>
      {title}
    </h2>
  );
};

export default Title;