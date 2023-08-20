'use client';
import React, {FC} from 'react';
import {SpecialZoomLevel, Viewer, Worker} from "@react-pdf-viewer/core";
import '@react-pdf-viewer/core/lib/styles/index.css';
import {zoomPlugin} from '@react-pdf-viewer/zoom';
// @ts-ignore
import PdfWorker from "pdfjs-dist/build/pdf.worker.entry";
import {pageNavigationPlugin} from '@react-pdf-viewer/page-navigation';
import {Button} from "@/ui/button";
import {CgChevronDoubleLeft} from "@react-icons/all-files/cg/CgChevronDoubleLeft";
import {CgChevronDoubleRight} from "@react-icons/all-files/cg/CgChevronDoubleRight";
import {CgChevronLeft} from "@react-icons/all-files/cg/CgChevronLeft";
import {CgChevronRight} from "@react-icons/all-files/cg/CgChevronRight";


const PdfViewer: FC<{
    pdfUrl: string;
}> = props => {

    const zoomPluginInstance = zoomPlugin({
        enableShortcuts: false,
    });

    const pageNavigationPluginInstance = pageNavigationPlugin();
    const {
        GoToFirstPage,
        GoToLastPage,
        GoToNextPage,
        GoToPreviousPage,
        CurrentPageLabel
    } = pageNavigationPluginInstance;


    return (
        <div className={'h-full relative pt-12'}>
            <div className="w-full absolute top-0 left-0 z-10 h-12 border-b flex justify-center items-center gap-2">
                <GoToFirstPage>
                    {props => {
                        return <Button variant={'ghost'} size={'xs'} className={'w-8 h-8'} onClick={props.onClick}
                                       disabled={props.isDisabled}>
                            <CgChevronDoubleLeft/>
                        </Button>
                    }}
                </GoToFirstPage>
                <GoToPreviousPage>
                    {props => {
                        return <Button variant={'ghost'} size={'xs'} className={'w-8 h-8'} onClick={props.onClick}
                                       disabled={props.isDisabled}>
                            <CgChevronLeft/>
                        </Button>
                    }}
                </GoToPreviousPage>
                <CurrentPageLabel>
                    {(props) => (
                        <span className={'text-sm min-w-[3rem] text-center'}>{`${props.currentPage + 1}/${props.numberOfPages}`}</span>
                    )}
                </CurrentPageLabel>
                <GoToNextPage>
                    {props => {
                        return <Button variant={'ghost'} size={'xs'} className={'w-8 h-8'} onClick={props.onClick}
                                       disabled={props.isDisabled}>
                            <CgChevronRight/>
                        </Button>
                    }}
                </GoToNextPage>
                <GoToLastPage>
                    {props => {
                        return <Button variant={'ghost'} size={'xs'} className={'w-8 h-8'} onClick={props.onClick}
                                       disabled={props.isDisabled}>
                            <CgChevronDoubleRight/>
                        </Button>
                    }}
                </GoToLastPage>
            </div>
            <Worker workerUrl={PdfWorker}>
                <Viewer enableSmoothScroll defaultScale={SpecialZoomLevel.PageFit}
                        plugins={[zoomPluginInstance, pageNavigationPluginInstance]}
                        fileUrl={props.pdfUrl}/>
            </Worker>
        </div>
    );
};


export default PdfViewer;