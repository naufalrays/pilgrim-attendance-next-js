import ComponentsAccount from '@/components/user/user/ComponentsUser';
import ComponentsUser from '@/components/user/user/ComponentsUser';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'User',
};

const Account = () => {
    return <ComponentsAccount />;
};

export default Account;
