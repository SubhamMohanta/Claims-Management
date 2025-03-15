"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle } from "lucide-react"

export default function PatientDashboard() {
    const [claims, setClaims] = useState([])

    useEffect(() => {
        fetchClaims()
    }, [])

    const fetchClaims = async () => {
        try {
            const res = await fetch("/api/claims")
            if (!res.ok) throw new Error("Failed to fetch claims")
            const data = await res.json()
            setClaims(data)
        } catch (error) {
            console.error(error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            case "approved":
                return "bg-green-100 text-green-800 hover:bg-green-100"
            case "rejected":
                return "bg-red-100 text-red-800 hover:bg-red-100"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
    }

    return (
        <main className="px-10 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">Your Claims</h1>
                <div className="flex gap-2">
                    <Button asChild className="flex-1 sm:flex-auto">
                        <Link href="/patient/submit-claim">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            <span className="sm:inline">Submit New Claim</span>
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Claims History</CardTitle>
                    <CardDescription>View and manage all your submitted insurance claims</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Claim ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date Submitted</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {claims.length > 0 ? (
                                    claims.map((claim) => (
                                        <TableRow key={claim.id}>
                                            <TableCell className="font-medium">{claim.id}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(claim.status)} variant="outline">
                                                    {claim.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(claim.submissionDate).toLocaleDateString()}</TableCell>
                                            <TableCell>${claim.amount || "N/A"}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/patient/claim/${claim.id}`}>View Details</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">No claims found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
