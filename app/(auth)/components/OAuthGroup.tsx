"use client";
import React, {FC, useState} from "react";
import {ClientSafeProvider, signIn} from "next-auth/react";
import {Button} from "@/ui/button";
import {FcGoogle} from "@react-icons/all-files/fc/FcGoogle";
import {useSearchParams} from "next/navigation";

const providers: (Pick<ClientSafeProvider, "id" | "name"> & {
    icon: React.ReactElement
})[] = [{
    id: "google",
    name: "谷歌",
    icon: <FcGoogle/>
},
//     {
//     id: "wechat",
//     name: "微信",
//     icon: <AiFillWechat className={'text-[#1AAD19]'}/>
// }
];
const OAuthGroup: FC = () => {
    const searchParams = useSearchParams()
    const [loadingKey, setLoadingKey] = useState<string | null>();

    const onSignIn = async (provider: string) => {
        try {
            setLoadingKey(provider);
            await signIn(provider, {
                callbackUrl: searchParams.get("from") || "/home",
            });
        } catch (e) {
            console.error(e);
            setLoadingKey(null);
        }
    };

    return <div className={"flex flex-col gap-2"}>
        {providers.map(provider => {
            return <Button key={provider.id} leftIcon={provider.icon} variant={"outline"}
                           loading={loadingKey === provider.id}
                           onClick={() => onSignIn(provider.id)}>{provider.name}登录</Button>;
        })}
    </div>;
};
export default OAuthGroup;