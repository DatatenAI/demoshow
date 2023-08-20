"use client";
import React, {FC} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/ui/avatar";
import {BiCreditCard} from "@react-icons/all-files/bi/BiCreditCard";
import {BiLogOut} from "@react-icons/all-files/bi/BiLogOut";
import {BiUser} from "@react-icons/all-files/bi/BiUser";
import {FaDiscord} from "@react-icons/all-files/fa/FaDiscord";
import Link from "next/link";
import {MdDataUsage} from "@react-icons/all-files/md/MdDataUsage";
import {signOut, useSession} from "next-auth/react";
import {BiShareAlt} from "@react-icons/all-files/bi/BiShareAlt";
import InviteDialog from "@/components/invite-dialog";

const UserAvatar: FC = () => {

    const logout = async () => {
        await signOut();
    }
    const {data} = useSession();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className={'w-8 h-8 cursor-pointer'}>
                        <AvatarImage src={data?.user?.image||undefined}/>
                        <AvatarFallback><BiUser/></AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 font-medium text-gray-700">
                    <DropdownMenuLabel className={'flex gap-3 text-sm'}>
                        <Avatar>
                            <AvatarImage src={data?.user?.image||undefined}/>
                            <AvatarFallback><BiUser/></AvatarFallback>
                        </Avatar>
                        <div>
                            <div>{data?.user?.name || '未登录'}</div>
                            <div className={'font-normal text-gray-700'}>{data?.user?.email || ''}</div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuLabel>
                        <div>
                            剩余点数:{Number(data?.user?.credits || 0).toFixed(1)}
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href={'/settings/profile'} prefetch={false}>
                                <BiUser className="mr-2 h-4 w-4"/>
                                <span>个人信息</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={'/settings/billing'} prefetch={false}>
                                <BiCreditCard className="mr-2 h-4 w-4"/>
                                <span>账户余额</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={'/settings/usage'} prefetch={false}>
                                <MdDataUsage className="mr-2 h-4 w-4"/>
                                <span>用量明细</span>
                            </Link>
                        </DropdownMenuItem>
                        {
                            data?.user ? <DropdownMenuItem asChild>
                                <InviteDialog code={data.user.inviteCode}>
                                    <a>
                                        <BiShareAlt className="mr-2 h-4 w-4"/>
                                        <span>邀请好友</span>
                                    </a>
                                </InviteDialog>
                            </DropdownMenuItem> : null
                        }
                        <DropdownMenuItem>
                            <FaDiscord className="mr-2 h-4 w-4"/>
                            <span>加入群组</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={logout}>
                        <BiLogOut className="mr-2 h-4 w-4"/>
                        <span>退出登录</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};


export default UserAvatar;