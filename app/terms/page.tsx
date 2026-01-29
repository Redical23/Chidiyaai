"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TermsPage() {
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
                <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
                    📄 Terms & Conditions
                </h1>
                <p style={{ color: "#64748b", marginBottom: "32px" }}>Last Updated: January 2026</p>

                <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <p style={{ color: "#334155", lineHeight: "1.7", marginBottom: "24px" }}>
                        Welcome to ChidiyaAI. These Terms and Conditions ("Terms") govern your access to and use of the ChidiyaAI website, platform, and services ("Service"). By accessing or using ChidiyaAI, you agree to be bound by these Terms.
                    </p>
                    <p style={{ color: "#64748b", marginBottom: "32px" }}>If you do not agree, please do not use the Service.</p>

                    <Section title="1. About ChidiyaAI">
                        ChidiyaAI is an AI-powered sourcing platform that connects buyers with suppliers, provides deal discovery, alerts, and related business tools. ChidiyaAI does not manufacture, own, or sell products directly unless explicitly stated.
                    </Section>

                    <Section title="2. Eligibility">
                        <ul style={{ paddingLeft: "20px", color: "#334155", lineHeight: "1.8" }}>
                            <li>Be at least 18 years old</li>
                            <li>Be legally capable of entering contracts</li>
                            <li>Use the platform for business or commercial purposes</li>
                        </ul>
                    </Section>

                    <Section title="3. Account Registration">
                        <ul style={{ paddingLeft: "20px", color: "#334155", lineHeight: "1.8" }}>
                            <li>You may need to create an account to access certain features.</li>
                            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                            <li>You agree to provide accurate, complete, and up-to-date information.</li>
                        </ul>
                        <p style={{ marginTop: "12px", color: "#64748b" }}>ChidiyaAI reserves the right to suspend or terminate accounts with false or misleading information.</p>
                    </Section>

                    <Section title="4. Platform Role Disclaimer">
                        <p style={{ color: "#334155", marginBottom: "12px" }}>ChidiyaAI:</p>
                        <ul style={{ paddingLeft: "20px", color: "#334155", lineHeight: "1.8" }}>
                            <li>Acts as a technology platform only</li>
                            <li>Does not guarantee transactions</li>
                            <li>Is not responsible for product quality, delivery, pricing disputes, or payment issues between buyers and suppliers</li>
                        </ul>
                        <p style={{ marginTop: "12px", color: "#64748b" }}>All commercial agreements are solely between buyers and suppliers.</p>
                    </Section>

                    <Section title="5. Use of AI & Automation">
                        <ul style={{ paddingLeft: "20px", color: "#334155", lineHeight: "1.8" }}>
                            <li>ChidiyaAI uses AI to provide recommendations, matches, alerts, and insights.</li>
                            <li>AI outputs are assistance tools, not guarantees.</li>
                            <li>Users should independently verify critical business decisions.</li>
                        </ul>
                    </Section>

                    <Section title="6. Prohibited Activities">
                        <p style={{ color: "#334155", marginBottom: "12px" }}>You agree not to:</p>
                        <ul style={{ paddingLeft: "20px", color: "#334155", lineHeight: "1.8" }}>
                            <li>Misrepresent identity or business details</li>
                            <li>Upload false, illegal, or harmful content</li>
                            <li>Attempt to reverse-engineer the platform</li>
                            <li>Use the platform for fraud, spam, or abuse</li>
                            <li>Circumvent platform safeguards</li>
                        </ul>
                    </Section>

                    <Section title="7. Intellectual Property">
                        All platform content, logos, software, and AI models are owned by ChidiyaAI or its licensors. You may not copy, reproduce, or distribute without permission.
                    </Section>

                    <Section title="8. Termination">
                        <p style={{ color: "#334155", marginBottom: "12px" }}>ChidiyaAI may suspend or terminate access:</p>
                        <ul style={{ paddingLeft: "20px", color: "#334155", lineHeight: "1.8" }}>
                            <li>For violation of Terms</li>
                            <li>For legal or security reasons</li>
                            <li>At its discretion, with or without notice</li>
                        </ul>
                    </Section>

                    <Section title="9. Limitation of Liability">
                        <p style={{ color: "#334155", marginBottom: "12px" }}>To the maximum extent permitted by law:</p>
                        <ul style={{ paddingLeft: "20px", color: "#334155", lineHeight: "1.8" }}>
                            <li>ChidiyaAI shall not be liable for indirect, incidental, or consequential damages</li>
                            <li>Total liability shall not exceed the amount paid by you to ChidiyaAI in the last 6 months (if any)</li>
                        </ul>
                    </Section>

                    <Section title="10. Changes to Terms">
                        We may update these Terms from time to time. Continued use after updates means acceptance.
                    </Section>

                    <Section title="11. Governing Law">
                        These Terms shall be governed by the laws of India, without regard to conflict of law principles.
                    </Section>

                    <Section title="12. Contact">
                        <p style={{ color: "#334155" }}>For questions, contact: 📧 support@chidiyaai.com</p>
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
