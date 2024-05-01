import ComponentsReport from '@/components/report/ComponentsReport';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Report',
};

const Report = () => {
    return <ComponentsReport />;
};

export default Report;
