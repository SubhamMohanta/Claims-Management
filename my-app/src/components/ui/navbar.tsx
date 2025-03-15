"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';
import { LogOut, FileText, Menu, HomeIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent,  } from '@/components/ui/sheet';


const navItems = [
    {
        title: "Dashboard",
        href: "/patient/dashboard",
        icon: HomeIcon,
    }
]

export default function Navbar() {

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("email");
        Cookies.remove("role");
        window.location.reload();
    };

    const pathname = usePathname();

    const [cookieValue, setCookieValue] = useState("");
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const value = Cookies.get("role"); // Replace with your cookie name
        setCookieValue(value || "No cookie found");
    }, []);
    

    return (
        <>
            {/* Desktop Navbar */}

            <header className="sticky top-0 z-10 border-b bg-background px-10">
                <div className="container flex h-16 items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                        <FileText className="h-6 w-6" />
                        <span className="text-lg font-bold">{cookieValue} Portal</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 text-sm font-medium ${pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        ))}
                        <Button
                            onClick={handleLogout}
                            variant={'default'}
                            className="flex items-center gap-2 text-sm font-medium"
                        >
                            <LogOut className="h-4 w-4" />
                            LogOut
                        </Button>
                    </nav>
                    <div className="md:hidden">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <span className="sr-only">Toggle menu</span>
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                                <nav className="flex flex-col gap-4 mt-8">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className={`flex items-center gap-2 p-2 rounded-md text-sm font-medium ${pathname === item.href
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                                }`}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {item.title}
                                        </Link>
                                    ))}
                                    <Button
                                        onClick={handleLogout}
                                        variant={'secondary'}
                                        className="text-zinc-50"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        LogOut
                                    </Button>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </>
    )
}