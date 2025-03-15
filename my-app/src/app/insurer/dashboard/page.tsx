"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

// Sample data for demonstration
const sampleClaims = [
    { id: "CLM-001", patient: "John Doe", status: "Pending", date: "2023-11-15", amount: "$750.00" },
    { id: "CLM-002", patient: "Jane Smith", status: "Approved", date: "2023-11-10", amount: "$1,250.00" },
    { id: "CLM-003", patient: "Robert Johnson", status: "Rejected", date: "2023-11-05", amount: "$500.00" },
    { id: "CLM-004", patient: "Emily Davis", status: "Approved", date: "2023-10-28", amount: "$2,100.00" },
    { id: "CLM-005", patient: "Michael Brown", status: "Pending", date: "2023-10-20", amount: "$350.00" },
    { id: "CLM-006", patient: "Sarah Wilson", status: "Pending", date: "2023-10-15", amount: "$890.00" },
    { id: "CLM-007", patient: "David Miller", status: "Rejected", date: "2023-10-10", amount: "$1,500.00" },
    { id: "CLM-008", patient: "Lisa Taylor", status: "Approved", date: "2023-10-05", amount: "$675.00" },
]

export default function insurerDashboard() {
    const [claims] = useState(sampleClaims)
    const [statusFilter, setStatusFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

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

    const filteredClaims = claims.filter((claim) => {
        // Filter by status
        if (statusFilter !== "all" && claim.status.toLowerCase() !== statusFilter.toLowerCase()) {
            return false
        }

        // Filter by search query
        if (
            searchQuery &&
            !claim.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !claim.patient.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
            return false
        }

        return true
    })

    return (
        <main className="px-10 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Claims Management</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Claims</CardTitle>
                    <CardDescription>Review and process insurance claims from patients</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by ID or patient name..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Claim ID</TableHead>
                                    <TableHead>patient</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date Submitted</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClaims.length > 0 ? (
                                    filteredClaims.map((claim) => (
                                        <TableRow key={claim.id} className="cursor-pointer hover:bg-muted/50">
                                            <TableCell className="font-medium">{claim.id}</TableCell>
                                            <TableCell>{claim.patient}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(claim.status)} variant="outline">
                                                    {claim.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{claim.date}</TableCell>
                                            <TableCell>{claim.amount}</TableCell>
                                            <TableCell>
                                                <Link href={`/insurer/review/${claim.id}`} className="hover:text-blue-600 font-semibold">Review</Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                            No claims found matching your filters
                                        </TableCell>
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

