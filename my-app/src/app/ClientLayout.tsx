"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/ui/navbar";

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    const hideLayoutRoutes = ["/auth/signup", "/auth/login"];

    return (
        <>
            {!hideLayoutRoutes.includes(pathname) && <Navbar />}
            
            {children}
        </>
    );
}
