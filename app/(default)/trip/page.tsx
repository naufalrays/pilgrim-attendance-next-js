import ComponentsTrip from '@/components/trip/ComponentsTrip';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Trip',
};

const Trip = () => {
    return <ComponentsTrip />;
};

export default Trip;
