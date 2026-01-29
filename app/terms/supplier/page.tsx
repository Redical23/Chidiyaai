"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SupplierTermsPage() {
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
                    <span style={{ fontSize: "32px" }}>🏭</span>
                    <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a" }}>
                        Terms & Conditions for Suppliers
                    </h1>
                </div>
                <p style={{ color: "#64748b", marginBottom: "32px" }}>These Supplier Terms apply if you list or offer products/services on ChidiyaAI.</p>

                <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>

                    <Section title="1. Supplier Eligibility">
                        <p style={{ marginBottom: "12px" }}>Suppliers must:</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Be legally registered businesses</li>
                            <li>Provide truthful and verifiable information</li>
                            <li>Comply with applicable laws and regulations</li>
                        </ul>
                    </Section>

                    <Section title="2. Listing & Information Accuracy">
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>All product, pricing, and availability information must be accurate</li>
                            <li>Misleading listings may result in suspension or removal</li>
                        </ul>
                    </Section>

                    <Section title="3. Verification">
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>ChidiyaAI may conduct verification checks</li>
                            <li>Verification does not guarantee endorsement</li>
                            <li>Suppliers remain fully responsible for compliance</li>
                        </ul>
                    </Section>

                    <Section title="4. Buyer Interactions">
                        <p style={{ marginBottom: "12px" }}>Suppliers must:</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Respond professionally</li>
                            <li>Honor agreed pricing and terms</li>
                            <li>Resolve disputes directly with buyers</li>
                        </ul>
                    </Section>

                    <Section title="5. Platform Rights">
                        <p style={{ marginBottom: "12px" }}>ChidiyaAI reserves the right to:</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Remove listings</li>
                            <li>Suspend supplier accounts</li>
                            <li>Reject suppliers without obligation to disclose reasons</li>
                        </ul>
                    </Section>

                    <Section title="6. No Exclusivity">
                        Suppliers are free to work with other platforms unless contractually agreed otherwise.
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
