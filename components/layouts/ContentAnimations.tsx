'use client';
import { IRootState } from '@/store';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ContentAnimation = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    return (
        <>
            {/* BEGIN CONTENT AREA */}
            <div className={` animate__animated p-6`}>{children}</div>
            {/* END CONTENT AREA */}
        </>
    );
};

export default ContentAnimation;
