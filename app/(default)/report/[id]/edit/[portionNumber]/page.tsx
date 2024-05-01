
import ComponentsReportPreview from '@/components/report/ComponentsReportPreview';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'ReportPriview',
};


type Props = {
    params: {
      id: string;
    };
  };

const ReportPriview = async (props: Props) => {
    return <ComponentsReportPreview tripId={props.params.id} />;
};

export default ReportPriview;
