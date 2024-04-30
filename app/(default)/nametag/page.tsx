import ComponentsNametag from '@/components/nametag/ComponentsNametag';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Nametag',
};

const Nametag = () => {
    return <ComponentsNametag />;
};

export default Nametag;
