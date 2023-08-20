import React, {FC} from "react";
import {CgSpinner} from "@react-icons/all-files/cg/CgSpinner";

const Loading: FC = props => {
    return <div className={"flex justify-center flex-grow"}>
        <CgSpinner className={"animate-spin text-primary w-8 h-8"}/>
    </div>;
};


export default Loading;