import "@/styles/index.css";
import ClientProviders from '@/components/ClientProviders';
import AppLayout from '@/components/AppLayout';

export const metadata = {
    title: 'Finance Dashboard',
    description: 'Manage your finances',
    verification: {
        google: 'bvkfGgOPLJ9ntndeRPwD5kwQJth0Z09AXl7Z7S9TgR0',
    },
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
