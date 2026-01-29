"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BuyerTermsPage() {
    const router = useRouter();

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* Header with Back Button */}
            <header style={{ backgroundColor: "white", borderBottom: "1px solid #e2e8f0", padding: "16px 24px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <button
                        onClick={() => router.back()}
                        style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#0f172a", fontWeight: "500" }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <Image src="/assests/chidiyaailogo.png" alt="ChidiyaAI" width={100} height={35} style={{ height: "35px", width: "auto" }} />
                </div>
            </header>

            {/* Content */}
            <main style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "32px" }}>🛒</span>
                    <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a" }}>
                        Terms & Conditions for Buyers
                    </h1>
                </div>
                <p style={{ color: "#64748b", marginBottom: "32px" }}>These Buyer Terms apply if you use ChidiyaAI as a buyer.</p>

                <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>

                    <Section title="1. Buyer Responsibilities">
                        <p style={{ marginBottom: "12px" }}>Buyers agree to:</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Provide accurate sourcing requirements</li>
                            <li>Independently verify suppliers and offers</li>
                            <li>Use platform recommendations responsibly</li>
                        </ul>
                    </Section>

                    <Section title="2. Supplier Matching">
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Matches are generated using AI and available data</li>
                            <li>ChidiyaAI does not guarantee pricing, availability, or fulfillment</li>
                            <li>Final negotiation is between buyer and supplier</li>
                        </ul>
                    </Section>

                    <Section title="3. Payments & Transactions">
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>ChidiyaAI does not handle payments unless explicitly stated</li>
                            <li>Any payments are made directly between buyer and supplier</li>
                            <li>ChidiyaAI is not responsible for payment disputes or refunds</li>
                        </ul>
                    </Section>

                    <Section title="4. Communication">
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Buyers must communicate professionally</li>
                            <li>Harassment, misuse, or spamming suppliers is prohibited</li>
                        </ul>
                    </Section>

                    <Section title="5. Risk Acknowledgement">
                        <p style={{ marginBottom: "12px" }}>Buyers acknowledge that:</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Business transactions involve risk</li>
                            <li>ChidiyaAI is a facilitation tool, not a broker or agent</li>
                        </ul>
                    </Section>
                </div>
            </main>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>{title}</h2>
            <div style={{ color: "#334155", lineHeight: "1.7" }}>{children}</div>
        </div>
    );
}
