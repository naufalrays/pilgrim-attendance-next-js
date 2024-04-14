'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import Loading from './components/layouts/Loading';

function App({ children }: PropsWithChildren) {

    return (
        <div
            className={`main-section relative text-sm font-normal antialiased`}
        >
            {children}
        </div>
    );
}

export default App;
