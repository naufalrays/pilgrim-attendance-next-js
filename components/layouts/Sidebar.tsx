'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PerfectScrollbar from 'react-perfect-scrollbar';
import IconUsers from '../icon/IconUsers';
import { toggleSidebar } from '@/store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import IconCaretsDown from '../icon/IconCaretsDown';
import IconMenuContacts from '../icon/menu/IconMenuContact';
import IconMenuUsers from '../icon/menu/IconMenuUsers';
import { IRootState } from '@/store';
import IconCaretDown from '../icon/IconCaretDown';
import AnimateHeight from 'react-animate-height';
const Sidebar = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);


    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    return (
        <div>
            <nav className="sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 dark:'text-white-dark'">
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">Absen Haji</span>
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                            <li className="nav-item">
                                <ul>
                                    <li className="nav-item">
                                        <Link href="/jamaah" className={`group ${currentMenu !== 'jamaah' ? 'active' : ''}`} onClick={() => setCurrentMenu('jamaah')}>
                                            <div className="flex items-center">
                                                <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Jamaah</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="menu nav-item">
                                        <button type="button" className={`${currentMenu === 'trip' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('trip')}>
                                            <div className="flex items-center">
                                                <IconMenuContacts className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Trip</span>
                                            </div>

                                            <div className={currentMenu !== 'trip' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === 'trip' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li>
                                                    <Link href="/trip/list">List</Link>
                                                </li>
                                                <li>
                                                    <Link href="/trip/create">Create</Link>
                                                </li>
                                            </ul>
                                        </AnimateHeight>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
