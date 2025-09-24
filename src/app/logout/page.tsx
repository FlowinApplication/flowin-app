'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';

export default function LogoutPage() {
    const router = useRouter();
    const { signOut } = useClerk();

    useEffect(() => {
        const timeout = setTimeout(async () => {
            await signOut();
            router.push('/sign-in');
        }, 2000);

        return () => clearTimeout(timeout);
    }, [router, signOut]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted">
            <h1 className="text-xl font-semibold">Saindo da conta...</h1>
            <p className="text-muted-foreground text-sm">Você será redirecionado em instantes.</p>
        </div>
    );
}