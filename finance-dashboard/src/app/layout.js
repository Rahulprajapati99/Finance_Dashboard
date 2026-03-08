import "@/styles/index.css";
import ClientProviders from '@/components/ClientProviders';
import AppLayout from '@/components/AppLayout';

export const metadata = {
    title: 'Finance Dashboard',
    description: 'Manage your finances',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <ClientProviders>
                    <AppLayout>
                        {children}
                    </AppLayout>
                </ClientProviders>
            </body>
        </html>
    );
}
