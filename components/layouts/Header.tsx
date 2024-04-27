"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { IRootState } from "@/store";
import { toggleSidebar, toggleTheme } from "@/store/themeConfigSlice";
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
import { usePathname, useRouter } from "next/navigation";
import IconMenuMore from "../icon/menu/IconMenuMore";
import IconMenu from "../icon/IconMenu";
import Dropdown from "../Dropdown";
import IconLogout from "../icon/IconLogout";
import IconMoon from "../icon/IconMoon";
import IconLaptop from "../icon/IconLaptop";
import IconSun from "../icon/IconSun";

const Header = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const selector = document.querySelector(
      'ul.horizontal-menu a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      const all: any = document.querySelectorAll(
        "ul.horizontal-menu .nav-link.active"
      );
      for (let i = 0; i < all.length; i++) {
        all[0]?.classList.remove("active");
      }

      let allLinks = document.querySelectorAll("ul.horizontal-menu a.active");
      for (let i = 0; i < allLinks.length; i++) {
        const element = allLinks[i];
        element?.classList.remove("active");
      }
      selector?.classList.add("active");

      const ul: any = selector.closest("ul.sub-menu");
      if (ul) {
        let ele: any = ul.closest("li.menu").querySelectorAll(".nav-link");
        if (ele) {
          ele = ele[0];
          setTimeout(() => {
            ele?.classList.add("active");
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

  return (
    <header className="z-40">
      <div className="shadow-sm">
        <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
          <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <span className="hidden align-middle text-2xl  font-semibold  transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">
                Absen Haji
              </span>
            </Link>
            <button
              type="button"
              className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>
          <div className="flex justify-end space-x-1.5 ml-auto dark:text-[#d0d2d6] lg:space-x-4">
            <div>
              {themeConfig.theme === "light" ? (
                <button
                  className={`${
                    themeConfig.theme === "light" &&
                    "flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                  }`}
                  onClick={() => dispatch(toggleTheme("dark"))}
                >
                  <IconSun />
                </button>
              ) : (
                ""
              )}
              {themeConfig.theme === "dark" && (
                <button
                  className={`${
                    themeConfig.theme === "dark" &&
                    "flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                  }`}
                  onClick={() => dispatch(toggleTheme("system"))}
                >
                  <IconMoon />
                </button>
              )}
              {themeConfig.theme === "system" && (
                <button
                  className={`${
                    themeConfig.theme === "system" &&
                    "flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                  }`}
                  onClick={() => dispatch(toggleTheme("light"))}
                >
                  <IconLaptop />
                </button>
              )}
            </div>
            <div className="dropdown flex shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement="bottom-end"
                btnClassName="relative group block"
                button={
                  <img
                    className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                    src="/assets/images/user-profile.jpeg"
                    alt="userProfile"
                  />
                }
              >
                <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                  <li>
                    <div className="flex items-center px-4 py-4">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src="/assets/images/user-profile.jpeg"
                        alt="userProfile"
                      />
                      <div className="truncate ltr:pl-4 rtl:pr-4">
                        <h4 className="text-base">John Doe</h4>
                        <button
                          type="button"
                          className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                        >
                          johndoe@gmail.com
                        </button>
                      </div>
                    </div>
                  </li>
                  <li className="border-t border-white-light dark:border-white-light/10">
                    <Link
                      href="/auth/boxed-signin"
                      className="!py-3 text-danger"
                    >
                      <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                      Sign Out
                    </Link>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
