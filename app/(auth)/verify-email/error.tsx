'use client';
import React from 'react';
import {ErrorPage} from "@/types";

const ErrorHandler: ErrorPage = (props) => {
    return <>
        <p className={"text-center font-normal text-gray-600 dark:text-gray-300"}>请求错误，请重试</p>
    </>
}
export default ErrorHandler;
