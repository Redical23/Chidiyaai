"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

import { getUser } from "@/app/actions/auth";

export default function CheckoutPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        getUser()
            .then((userData) => {
                if (userData) {
                    setUser(userData);
                } else {
                    router.push("/supplier/login?next=checkout");
                }
            })
            .catch(() => router.push("/supplier/login?next=checkout"))
            .finally(() => setLoading(false));
    }, [router]);

    const handlePayment = async () => {
        if (!user) return;
        setProcessing(true);

        const amount = 299900; // ₹2,999

        try {
            const res = await fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, email: user.email, plan: "pro" }),
            });

            const order = await res.json();
            if (!res.ok) throw new Error(order.error || "Payment initiation failed");

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount,
                currency: "INR",
                name: "ChidiyaAI",
                description: "Pro Subscription",
                order_id: order.id,
                handler: async (response: any) => {
                    try {
                        const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                        await fetch("/api/users/updateSubscription", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                email: user.email,
                                subscribe: true,
                                subscriptionExpiry: expiryDate,
                                orderId: order.id,
                            }),
                        });
                        alert("Payment Successful! Redirecting to Dashboard.");
                        router.push("/supplier/dashboard");
                    } catch (error) {
                        console.error(error);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: user.first_name,
                    email: user.email,
                },
                theme: {
                    color: "#0f172a",
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</div>;

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "40px 20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", maxWidth: "500px", width: "100%" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px", color: "#0f172a" }}>Choose Your Plan</h1>
                <p style={{ color: "#64748b", marginBottom: "32px" }}>Start with our free trial or go Pro for full access.</p>

                {/* Free Trial Option */}
                <div style={{
                    padding: "24px",
                    backgroundColor: "#f0fdf4",
                    borderRadius: "12px",
                    border: "2px solid #22c55e",
                    marginBottom: "16px"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                <span style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>🎉 Free Trial</span>
                                <span style={{ padding: "2px 8px", backgroundColor: "#22c55e", color: "white", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>RECOMMENDED</span>
                            </div>
                            <div style={{ fontSize: "13px", color: "#64748b" }}>6 months free, no credit card required</div>
                        </div>
                        <div style={{ fontSize: "28px", fontWeight: "bold", color: "#22c55e" }}>₹0</div>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px 0", fontSize: "14px", color: "#475569" }}>
                        <li style={{ marginBottom: "8px" }}>✓ Full platform access for 6 months</li>
                        <li style={{ marginBottom: "8px" }}>✓ Get verified badge</li>
                        <li style={{ marginBottom: "8px" }}>✓ Receive buyer enquiries</li>
                        <li>✓ No payment required now</li>
                    </ul>
                    <button
                        onClick={() => router.push("/supplier/dashboard")}
                        style={{
                            width: "100%",
                            padding: "14px",
                            backgroundColor: "#22c55e",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        Start Free Trial
                    </button>
                    <div style={{ textAlign: "center", marginTop: "8px", fontSize: "12px", color: "#64748b" }}>
                        Then ₹2,999/month after 6 months
                    </div>
                </div>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "24px 0" }}>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }}></div>
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>or</span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }}></div>
                </div>

                {/* Pro Plan */}
                <div style={{
                    padding: "24px",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                        <div>
                            <div style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>Pro Plan</div>
                            <div style={{ fontSize: "13px", color: "#64748b" }}>Monthly Subscription</div>
                        </div>
                        <div>
                            <span style={{ fontSize: "28px", fontWeight: "bold", color: "#0f172a" }}>₹2,999</span>
                            <span style={{ fontSize: "14px", color: "#64748b" }}>/mo</span>
                        </div>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px 0", fontSize: "14px", color: "#475569" }}>
                        <li style={{ marginBottom: "8px" }}>✓ Everything in Free Trial</li>
                        <li style={{ marginBottom: "8px" }}>✓ Priority listing in search results</li>
                        <li style={{ marginBottom: "8px" }}>✓ Advanced analytics dashboard</li>
                        <li>✓ Dedicated account manager</li>
                    </ul>
                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        style={{
                            width: "100%",
                            padding: "14px",
                            backgroundColor: "#0f172a",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: processing ? "not-allowed" : "pointer"
                        }}
                    >
                        {processing ? "Processing..." : "Subscribe Now"}
                    </button>
                </div>

                <div style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#94a3b8" }}>
                    Secure payment via Razorpay
                </div>
            </div>
        </div>
    );
}
