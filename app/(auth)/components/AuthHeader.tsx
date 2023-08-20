import React, { FC, PropsWithChildren, ReactNode } from "react";
import Logo from "@/public/logo.jpeg";
import Image from "next/image";

const AuthHeader: FC<PropsWithChildren & {
  title: string;
  logo?: ReactNode;
  subtitle?: ReactNode;
}> = props => {
  return <div className={"flex flex-col gap-6 items-center"}>
    {
        props.logo || <Image src={Logo} alt={"logo"} className={'w-16 h-16 rounded-full'}/>
    }
    <div className={"space-y-3 text-center"}>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{props.title}</h1>
      {props.subtitle && <h2 className={"font-normal text-gray-600 dark:text-gray-300"}>{props.subtitle}</h2>}
    </div>
  </div>;
};


export default AuthHeader;