import React, {FC} from "react";
import {CgSpinner} from "@react-icons/all-files/cg/CgSpinner";

const Loading: FC = props => {
    return <CgSpinner className={"animate-spin text-primary w-7 h-7 mx-auto"}/>;
};


export default Loading;