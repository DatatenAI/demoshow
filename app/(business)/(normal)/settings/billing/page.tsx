import React from 'react';
import {Page} from "@/types";
import PageLayout from "@/app/(business)/(normal)/page-layout";
import Pay from "./pay";
import prisma from "@/lib/database";


const BillingPage: Page = async props => {

    const goods = await prisma.creditGood.findMany({
        where: {
            actived: true,
        }
    });

    return (
        <PageLayout title={'账户余额'} className={'pt-0'}>
            <Pay goods={goods} data-superjson/>
        </PageLayout>
    );
};

export const dynamic = 'force-dynamic';

export default BillingPage;