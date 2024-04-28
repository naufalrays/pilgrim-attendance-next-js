'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import {  toggleTheme, toggleMenu, toggleLayout, toggleAnimation, toggleNavbar } from '@/store/themeConfigSlice';
import Loading from './components/layouts/Loading';

function App({ children }: PropsWithChildren) {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
        dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
        dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
        dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
        dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
        // locale
        if (!document.documentElement.getAttribute("dir")) {
          document.documentElement.setAttribute("dir", "ltr");
        }

        setIsLoading(false);
    }, [dispatch,  themeConfig.theme, themeConfig.menu, themeConfig.layout,  themeConfig.animation, themeConfig.navbar, themeConfig.locale]);

    return (
        <div
            className={`${(themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout}  main-section relative font-nunito text-sm font-normal antialiased`}
        >
            {isLoading ? <Loading /> : children}
        </div>
    );
}

export default App;
