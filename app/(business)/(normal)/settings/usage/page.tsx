import React from 'react';
import {Page} from "@/types";
import PageLayout from "@/app/(business)/(normal)/page-layout";
import UsageTable from "./usage-table";

const UsagePage: Page = props => {
    return (
        <PageLayout title={'用量明细'} className={'pt-0'}>
            <div>
                <UsageTable/>
            </div>
        </PageLayout>
    );
};

export default UsagePage;