import ComponentsBackup from '@/components/backup/ComponentsBackup';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Backup',
};

const Report = () => {
    return <ComponentsBackup />;
};

export default Report;
