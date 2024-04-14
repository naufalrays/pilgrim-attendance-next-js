import '../styles/tailwind.css';
import { Metadata } from 'next';
import ProviderComponent from '@/components/layouts/ProviderComponent';
import Providers from '@/components/Providers';

// export const metadata: Metadata = {
//     title: {
//         template: '%s | VRISTO - Multipurpose Tailwind Dashboard Template',
//         default: 'VRISTO - Multipurpose Tailwind Dashboard Template',
//     },
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                {/* <Providers> */}
                    <ProviderComponent>{children}</ProviderComponent>
                {/* </Providers> */}
            </body>
        </html>
    );
}
