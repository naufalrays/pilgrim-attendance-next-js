
import ComponentsTripPreview from '@/components/trip/ComponentsTripPreview';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'TripPreview',
};


type Props = {
    params: {
      id: string;
    };
  };

const TripPreview = async (props: Props) => {
    return <ComponentsTripPreview tripId={props.params.id} />;
};

export default TripPreview;
