
import ComponentsTripUpdate from '@/components/trip/ComponentsTripUpdate';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'TripUpdate',
};


type Props = {
    params: {
      id: string;
    };
  };

const TripUpdate = async (props: Props) => {
    return <ComponentsTripUpdate tripId={props.params.id} />;
};

export default TripUpdate;
