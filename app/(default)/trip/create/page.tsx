
import ComponentsTripCreate from '@/components/trip/ComponentsTripCreate';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'TripCreate',
};

const TripCreate = () => {
    return <ComponentsTripCreate />;
};

export default TripCreate;
