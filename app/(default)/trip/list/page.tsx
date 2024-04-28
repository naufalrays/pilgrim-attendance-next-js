import ComponentsTripList from '@/components/trip/ComponentsTripList';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'TripList',
};

const TripList = () => {
    return <ComponentsTripList />;
};

export default TripList;
