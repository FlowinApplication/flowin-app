"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { isSignedIn, isLoaded } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    console.log('ProtectedLayout - isSignedIn:', isSignedIn, 'isLoaded:', isLoaded);

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.replace(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`);
        }
    }, [isLoaded, isSignedIn, pathname, router]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen grid place-items-center">
                <Image src="/assets/images/loading-frog.webp" alt="Loading..." fill={true} />
            </div>
        );
    }

    return <div>{children}</div>;
}