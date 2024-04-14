'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { IRootState } from '@/store';
import { toggleSidebar } from '@/store/themeConfigSlice';
// import IconMenu from '@/components/icon/icon-menu';
// import IconCalendar from '@/components/icon/icon-calendar';
// import IconEdit from '@/components/icon/icon-edit';
// import IconChatNotification from '@/components/icon/icon-chat-notification';
// import IconSearch from '@/components/icon/icon-search';
// import IconXCircle from '@/components/icon/icon-x-circle';
// import IconSun from '@/components/icon/icon-sun';
// import IconMoon from '@/components/icon/icon-moon';
// import IconLaptop from '@/components/icon/icon-laptop';
// import IconMailDot from '@/components/icon/icon-mail-dot';
// import IconArrowLeft from '@/components/icon/icon-arrow-left';
// import IconInfoCircle from '@/components/icon/icon-info-circle';
// import IconBellBing from '@/components/icon/icon-bell-bing';
// import IconUser from '@/components/icon/icon-user';
// import IconMail from '@/components/icon/icon-mail';
// import IconLockDots from '@/components/icon/icon-lock-dots';
// import IconLogout from '@/components/icon/icon-logout';
// import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard';
// import IconCaretDown from '@/components/icon/icon-caret-down';
// import IconMenuApps from '@/components/icon/menu/icon-menu-apps';
// import IconMenuComponents from '@/components/icon/menu/icon-menu-components';
// import IconMenuElements from '@/components/icon/menu/icon-menu-elements';
// import IconMenuDatatables from '@/components/icon/menu/icon-menu-datatables';
// import IconMenuForms from '@/components/icon/menu/icon-menu-forms';
// import IconMenuPages from '@/components/icon/menu/icon-menu-pages';
// import IconMenuMore from '@/components/icon/menu/icon-menu-more';
import { usePathname, useRouter } from 'next/navigation';
import IconMenuMore from '../icon/menu/IconMenuMore';
import IconMenu from '../icon/IconMenu';
import Dropdown from '../Dropdown';
import IconLogout from '../icon/IconLogout';

const Header = () => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }

            let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
            for (let i = 0; i < allLinks.length; i++) {
                const element = allLinks[i];
                element?.classList.remove('active');
            }
            selector?.classList.add('active');

            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [pathname]);

    const isRtl = true;

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    function createMarkup(messages: any) {
        return { __html: messages };
    }
    const [messages, setMessages] = useState([
        {
            id: 1,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
            title: 'Congratulations!',
            message: 'Your OS has been updated.',
            time: '1hr',
        },
        {
            id: 2,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
            title: 'Did you know?',
            message: 'You can switch between artboards.',
            time: '2hr',
        },
        {
            id: 3,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
            title: 'Something went wrong!',
            message: 'Send Reposrt',
            time: '2days',
        },
        {
            id: 4,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
            title: 'Warning',
            message: 'Your password strength is low.',
            time: '5days',
        },
    ]);

    const removeMessage = (value: number) => {
        setMessages(messages.filter((user) => user.id !== value));
    };

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            profile: 'user-profile.jpeg',
            message: '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
            time: '45 min ago',
        },
        {
            id: 2,
            profile: 'profile-34.jpeg',
            message: '<strong class="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
            time: '9h Ago',
        },
        {
            id: 3,
            profile: 'profile-16.jpeg',
            message: '<strong class="text-sm mr-1">Anna Morgan</strong>Upload a file',
            time: '9h Ago',
        },
    ]);

    const removeNotification = (value: number) => {
        setNotifications(notifications.filter((user) => user.id !== value));
    };

    const [search, setSearch] = useState(false);

    return (
        <header className="z-40">
            <div className="shadow-sm">
                <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <span className="hidden align-middle text-2xl  font-semibold  transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">Absen Haji</span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconMenu className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="dropdown flex shrink-0 ml-auto">
                        <Dropdown
                            offset={[0, 8]}
                            placement="bottom-end"
                            btnClassName="relative group block"
                            button={<img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src="/assets/images/user-profile.jpeg" alt="userProfile" />}
                        >
                            <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                <li>
                                    <div className="flex items-center px-4 py-4">
                                        <img className="h-10 w-10 rounded-md object-cover" src="/assets/images/user-profile.jpeg" alt="userProfile" />
                                        <div className="truncate ltr:pl-4 rtl:pr-4">
                                            <h4 className="text-base">
                                                John Doe
                                            </h4>
                                            <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                                johndoe@gmail.com
                                            </button>
                                        </div>
                                    </div>
                                </li>
                                <li className="border-t border-white-light dark:border-white-light/10">
                                    <Link href="/auth/boxed-signin" className="!py-3 text-danger">
                                        <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                                        Sign Out
                                    </Link>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
