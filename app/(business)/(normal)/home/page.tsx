import React from 'react';
import {Page} from "@/types";
import PageLayout from "@/app/(business)/(normal)/page-layout";
import {getCurrentUser} from "@/lib/auth";
import UploadPdf from "./upload-pdf";
import Chat from "./chat";


const HomePage: Page = async props => {

    const user = await getCurrentUser();

    return (
        <PageLayout>
            <div className={'space-y-6'}>
                <UploadPdf defaultLanguage={user?.language || '中文'}/>
                <Chat/>
            </div>
        </PageLayout>
    )

};


export default HomePage;