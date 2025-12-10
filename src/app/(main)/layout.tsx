import { ReactNode } from 'react';
import { Header, Footer } from '@/components/layouts';

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </>
    );
}
