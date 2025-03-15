"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileText, Download, User } from "lucide-react"
export default function ClaimReviewPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { id } = params

    // In a real app, you would fetch the claim data based on the ID
    const [claimData, setClaimData] = useState({
        id,
        patient: "John Doe",
        email: "john.doe@example.com",
        status: "pending",
        date: "2023-11-15",
        requestedAmount: "$750.00",
        approvedAmount: "",
        description:
            "Medical expenses for a routine checkup and blood tests at City Hospital on November 10, 2023. The visit included consultation with Dr. Smith and laboratory work.",
        documents: ["medical_report.pdf", "receipt.pdf"],
    })

    const [decision, setDecision] = useState("")
    const [approvedAmount, setApprovedAmount] = useState("")
    const [comments, setComments] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, you would submit the decision to your backend
        console.log("Decision submitted:", {
            claimId: id,
            decision,
            approvedAmount,
            comments,
        })
        // Update local state to reflect changes
        setClaimData({
            ...claimData,
            status: decision.toLowerCase(),
            approvedAmount: decision === "Approved" ? `$${approvedAmount}` : "$0.00",
        })
        // Redirect to dashboard after submission
        router.push("/insurer/dashboard")
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl sm:text-3xl font-bold">Review Claim {id}</h1>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Claim Details</CardTitle>
                            <CardDescription>Review the claim information submitted by the patient</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Claim ID</h3>
                                    <p className="font-medium">{claimData.id}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Date Submitted</h3>
                                    <p>{claimData.date}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Requested Amount</h3>
                                    <p className="font-medium">{claimData.requestedAmount}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Status</h3>
                                    <p className="capitalize">{claimData.status}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">patient Information</h3>
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{claimData.patient}</p>
                                        <p className="text-sm text-muted-foreground">{claimData.email}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Claim Description</h3>
                                <p className="text-sm">{claimData.description}</p>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Supporting Documents</h3>
                                <div className="space-y-2">
                                    {claimData.documents.map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{doc}</span>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Claim Decision</CardTitle>
                            <CardDescription>Review and make a decision on this claim</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="decision">Decision</Label>
                                    <Select value={decision} onValueChange={setDecision} required>
                                        <SelectTrigger id="decision">
                                            <SelectValue placeholder="Select decision" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Approved">Approve</SelectItem>
                                            <SelectItem value="Rejected">Reject</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {decision === "Approved" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="approvedAmount">Approved Amount ($)</Label>
                                        <Input
                                            id="approvedAmount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={approvedAmount}
                                            onChange={(e) => setApprovedAmount(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="comments">Comments</Label>
                                    <Textarea
                                        id="comments"
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        rows={4}
                                        placeholder="Add any notes or explanation for your decision..."
                                    />
                                </div>

                                <CardFooter className="flex justify-end px-0 pt-4">
                                    <Button type="submit" disabled={!decision}>
                                        Submit Decision
                                    </Button>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
            </>
    )
}

