import MainContainer from "@/components/layouts/MainContainer";
import Sidebar from "@/components/layouts/Sidebar";
import '../../styles/tailwind.css';
import ContentAnimation from "@/components/layouts/ContentAnimations";
import Header from "@/components/layouts/Header";
// import '.../styles/tailwind.css'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* BEGIN MAIN CONTAINER */}
            <div className="relative ltr">
                {/* <Overlay />
                <ScrollToTop /> */}

                {/* BEGIN APP SETTING LAUNCHER */}
                {/* <Setting /> */}
                {/* END APP SETTING LAUNCHER */}

                <MainContainer>
                    {/* BEGIN SIDEBAR */}
                    <Sidebar />
                    {/* END SIDEBAR */}
                    <div className="main-content flex min-h-screen flex-col">
                        {/* BEGIN TOP NAVBAR */}
                        <Header />
                        {/* END TOP NAVBAR */}

                        {/* BEGIN CONTENT AREA */}
                        <ContentAnimation>{children}</ContentAnimation>
                        {/* END CONTENT AREA */}

                        {/* BEGIN FOOTER */}
                        {/* <Footer /> */}
                        {/* END FOOTER */}
                        {/* <Portals /> */}
                    </div>
                </MainContainer>
            </div>
        </>
    );
}
