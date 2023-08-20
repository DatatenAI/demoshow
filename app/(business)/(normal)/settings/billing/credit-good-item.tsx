import React, {FC} from 'react';
import {CreditGood} from "@prisma/client";
import {cn} from "@/lib/cn";
import {ImStack} from "@react-icons/all-files/im/ImStack";
import {RiCheckboxCircleFill} from "@react-icons/all-files/ri/RiCheckboxCircleFill";
import {RiCheckboxBlankCircleLine} from "@react-icons/all-files/ri/RiCheckboxBlankCircleLine";

const CreditGoodItem: FC<{
    good: CreditGood;
    checked: boolean;
    onClick: (good: CreditGood) => void
}> = ({good, checked, onClick}) => {
    return (
        <div key={good.id.toString()} onClick={() => onClick(good)}
             className={cn('group rounded-xl ring-1 ring-gray-200 cursor-pointer p-4 flex  gap-1 items-start', {
                 'ring-2 ring-primary bg-primary-50 is-checked': checked,
             })}>
            <div className="flex flex-row gap-4 items-start justify-start flex-1 ">
                <div
                    className="bg-primary-100 rounded-full border-solid border-primary-50 border-4 shrink-0 w-8 h-8 p-1">
                    <ImStack className={'w-4 h-4 text-primary'}/>
                </div>
                <div className="flex flex-col text-sm flex-1 ">
                    <div className="flex flex-row gap-1 items-start justify-start shrink-0 ">
                        <div
                            className="text-gray-700 group-[.is-checked]:text-primary-800 text-sm font-medium "
                        >{good.name}</div>
                        <div
                            className="text-gray-600 group-[.is-checked]:text-primary-700 font-normal leading-5">
                            ¥{(Number(good.price) / 100).toFixed(2)}
                        </div>
                    </div>

                    <div
                        className="text-gray-600 group-[.is-checked]:text-primary-700 font-normal"
                    >包含{good.credits.toString()}点数
                    </div>
                </div>
            </div>
            {
                checked ?
                    <RiCheckboxCircleFill className={'fill-primary w-4 h-4 shrink-0'}/> :
                    <RiCheckboxBlankCircleLine className={'fill-gray-300 w-4 h-4 shrink-0'}/>
            }

        </div>
    );
};


export default CreditGoodItem;