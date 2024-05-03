import ComponentsAnnouncement from '@/components/announcement/ComponentsAnnouncement';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Announcement',
};

const Announcement = () => {
    return <ComponentsAnnouncement />;
};

export default Announcement;
