'use client';
import store from '@/store';
import React, { ReactNode, Suspense } from 'react';
import Loading from './Loading';
import App from '@/App';
import { Provider } from 'react-redux';

interface IProps {
    children?: ReactNode;
}

const ProviderComponent = ({ children }: IProps) => {
    return (
        <Provider store={store}>
            <Suspense fallback={<Loading />}>
                <App>{children} </App>
            </Suspense>
        </Provider>
    );
};

export default ProviderComponent;
