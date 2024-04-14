import React, { ReactNode, Suspense } from 'react';
import Loading from './Loading';
import App from '@/App';

interface IProps {
    children?: ReactNode;
}

const ProviderComponent = ({ children }: IProps) => {
    return (
        <App>{children} </App>
    );
};

export default ProviderComponent;
