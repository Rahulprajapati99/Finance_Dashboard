import "@/styles/index.css";
import ClientProviders from '@/components/ClientProviders';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export const metadata = {
    title: 'Finance Dashboard',
    description: 'Manage your finances',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <ClientProviders>
                    <div id="layout-root" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
                        <Sidebar />
                        <div id="content-root" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'auto' }}>
                            <Header title="Dashboard" />
                            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                                {children}
                            </main>
                        </div>
                    </div>
                </ClientProviders>
            </body>
        </html>
    );
}
