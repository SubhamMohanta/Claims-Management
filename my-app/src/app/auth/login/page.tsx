"use client"

import { useState } from "react";
import Link from "next/link";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("patient");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "login", email, password, role }),
            });

            const data = await response.json();
            if (response.ok) {
                Cookies.set('token', data.token, { expires: 1 });
                Cookies.set('role', role, { expires: 1 });
                Cookies.set('email', email, { expires: 1 });

                toast({ title: "Login successful", description: "Redirecting...", duration: 2000 });
                setTimeout(() => router.push(`/${role}/dashboard`), 2000);
            } else {
                toast({ title: "Login failed", description: data.error, duration: 2000 });
            }
        } catch {
            toast({ title: "Error", description: "An error occurred during login", duration: 2000 });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-[350px] space-y-6">
                <h1 className="text-3xl font-bold text-center">Login</h1>
                <Tabs defaultValue="patient" onValueChange={setRole}>
                    <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="patient">Patient</TabsTrigger>
                        <TabsTrigger value="insurer">Insurer</TabsTrigger>
                    </TabsList>
                </Tabs>
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
                    </Button>
                </form>
                <p className="text-center text-sm">
                    Don’t have an account? <Link href="/auth/signup" className="underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
