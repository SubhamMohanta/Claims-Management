"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [name, setName] = useState(""); // Added name field
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("patient"); // Default role
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "signup", name, email, password, role: role.toLowerCase() }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Account created",
                    description: "Your account has been created successfully. Please log in.",
                    duration: 2500,
                });

                setTimeout(() => {
                    router.push("/auth/login");
                }, 2500);
            } else {
                toast({
                    title: "Sign up failed",
                    description: data.error || "An error occurred during sign up",
                    duration: 2500,
                });

                if (data.error === "Email already exists for this role") {
                    setTimeout(() => {
                        router.push("/auth/login");
                    }, 2500);
                }
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                duration: 2500,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-center">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Create an account</h1>
                        <Tabs defaultValue="patient" className="w-full" onValueChange={setRole}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="patient">Patient</TabsTrigger>
                                <TabsTrigger value="insurer">Insurer</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <p className="text-balance text-muted-foreground">
                            Enter your details below to create your account
                        </p>
                    </div>
                    <form className="grid gap-4" onSubmit={handleSubmit}>
                        {/* Name Input */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        {/* Email Input */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {/* Password Input */}
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {/* Signup Button */}
                        <Button
                            type="submit"
                            className="w-full bg-zinc-700 text-zinc-50 hover:bg-zinc-800"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing up...
                                </>
                            ) : (
                                "Sign up"
                            )}
                        </Button>
                    </form>
                    <div className="text-center text-sm">
                        Have an account?{" "}
                        <Link href="/auth/login" className="underline">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
