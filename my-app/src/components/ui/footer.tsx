import Link from "next/link"

export default function Footer() {
    return (
        <footer className="flex px-4 sm:px-6 lg:px-36 bg-zinc-950 text-zinc-50 py-5 border-t-2  border-zinc-800">
            <p className="text-sm text-muted-foreground">&copy; 2024 U-Serve. All rights reserved.</p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                <Link href="https://github.com/kalviumcommunity/U-Serve" target="_blank" className="text-sm hover:underline underline-offset-4" prefetch={false}>
                    Github
                </Link>
                <Link href="https://www.figma.com/design/xqB8vlmzU0LDfDFvUoKUwW/U-serve(Volunteering-community-platform)?node-id=21-128&t=LSbou0C1T8CMidzI-1" target="_blank" className="text-sm hover:underline underline-offset-4" prefetch={false}>
                    Figma
                </Link>
            </nav>
        </footer>
    )
}