import ComponentsDashboardSales from '@/components/dashboard/ComponentsDashboardSales';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Sales Admin',
};

const Sales = () => {
    return <ComponentsDashboardSales />;
};

export default Sales;
