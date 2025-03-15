"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload } from "lucide-react"

export default function SubmitClaimPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        amount: "",
        description: "",
        document: null as File | null,
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, document: e.target.files![0] }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const form = new FormData()
            form.append("name", formData.name)
            form.append("email", formData.email)
            form.append("amount", formData.amount)
            form.append("description", formData.description)
            if (formData.document) {
                form.append("document", formData.document)
            }

            const res = await fetch("/api/claims", {
                method: "POST",
                body: form
            })

            const data = await res.json()
            if (res.ok) {
                setMessage("Claim submitted successfully!")
                router.push("/patient/dashboard")
            } else {
                setMessage(data.error || "Failed to submit claim.")
            }
        } catch (error) {
            setMessage("Something went wrong!")
        }

        setLoading(false)
    }

    return (
        <main className="px-10 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl sm:text-3xl font-bold">Submit New Claim</h1>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Claim Information</CardTitle>
                    <CardDescription>Please fill out all required fields to submit your insurance claim</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />

                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />

                            <Label htmlFor="amount">Claim Amount ($)</Label>
                            <Input id="amount" name="amount" type="number" min="0" step="0.01" value={formData.amount} onChange={handleChange} required />

                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />

                            <Label htmlFor="document">Upload Supporting Documents</Label>
                            <Input id="document" name="document" type="file" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.docx" />

                            <CardFooter className="flex justify-end px-0 pt-4">
                                <Button type="submit" size="lg" disabled={loading}>
                                    {loading ? "Submitting..." : "Submit Claim"}
                                </Button>
                            </CardFooter>
                        </div>
                    </form>
                    {message && <p className="text-center text-red-500">{message}</p>}
                </CardContent>
            </Card>
        </main>
    )
}
