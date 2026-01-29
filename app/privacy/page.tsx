"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
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
                    <span style={{ fontSize: "32px" }}>🔐</span>
                    <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a" }}>
                        Privacy Policy
                    </h1>
                </div>
                <p style={{ color: "#64748b", marginBottom: "32px" }}>Last Updated: January 2026</p>

                <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>

                    <p style={{ color: "#334155", lineHeight: "1.7", marginBottom: "24px" }}>
                        ChidiyaAI respects your privacy and is committed to protecting the personal and business information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you access or use our website, platform, and services (collectively, the "Services").
                    </p>
                    <p style={{ color: "#64748b", marginBottom: "32px" }}>
                        By using ChidiyaAI, you agree to the practices described in this Privacy Policy.
                    </p>

                    <Section title="1. Information We Collect">
                        <p style={{ fontWeight: "600", marginBottom: "8px" }}>a) Personal & Business Information</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "16px" }}>
                            <li>Name, email address, phone number</li>
                            <li>Business name and details</li>
                            <li>Account login information</li>
                        </ul>
                        <p style={{ fontWeight: "600", marginBottom: "8px" }}>b) Usage & Technical Information</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "16px" }}>
                            <li>IP address, browser type, device information</li>
                            <li>Pages visited and actions taken</li>
                            <li>Date and time of access</li>
                        </ul>
                        <p style={{ fontWeight: "600", marginBottom: "8px" }}>c) Communication Information</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Messages sent between buyers and suppliers</li>
                            <li>Emails or support requests sent to ChidiyaAI</li>
                        </ul>
                    </Section>

                    <Section title="2. How We Use Your Information">
                        <p style={{ marginBottom: "12px" }}>We use the collected information to:</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Provide and operate the ChidiyaAI platform</li>
                            <li>Match buyers with relevant suppliers</li>
                            <li>Deliver alerts, notifications, and recommendations</li>
                            <li>Improve our AI models and platform performance</li>
                            <li>Communicate updates, support messages, and service information</li>
                            <li>Prevent fraud, misuse, and security threats</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </Section>

                    <Section title="3. How We Share Information">
                        <p style={{ marginBottom: "12px" }}>We may share information only as necessary:</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Between buyers and suppliers to enable sourcing and communication</li>
                            <li>With trusted third-party service providers (hosting, analytics, email delivery)</li>
                            <li>To comply with legal requirements, court orders, or law enforcement</li>
                            <li>To protect the rights, safety, and security of ChidiyaAI and its users</li>
                        </ul>
                        <p style={{ marginTop: "12px", padding: "12px", backgroundColor: "#dcfce7", borderRadius: "8px", color: "#15803d", fontWeight: "500" }}>
                            👉 We do not sell your personal data to third parties.
                        </p>
                    </Section>

                    <Section title="4. Cookies & Tracking Technologies">
                        <p style={{ marginBottom: "12px" }}>ChidiyaAI uses cookies and similar technologies to:</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Improve user experience</li>
                            <li>Remember preferences and sessions</li>
                            <li>Analyze platform usage and performance</li>
                        </ul>
                        <p style={{ marginTop: "12px", color: "#64748b" }}>You may choose to disable cookies through your browser settings, though some features may not function properly.</p>
                    </Section>

                    <Section title="5. AI & Automated Processing">
                        <p style={{ marginBottom: "12px" }}>ChidiyaAI uses artificial intelligence and automated systems to:</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Analyze preferences and activity</li>
                            <li>Generate supplier matches and deal recommendations</li>
                            <li>Trigger alerts and notifications</li>
                        </ul>
                        <p style={{ marginTop: "12px", color: "#64748b" }}>AI outputs are intended to assist users and should not be treated as guarantees or professional advice.</p>
                    </Section>

                    <Section title="6. Data Security">
                        We implement reasonable administrative, technical, and organizational measures to protect your information. However, no system is completely secure, and we cannot guarantee absolute security of data.
                    </Section>

                    <Section title="7. Data Retention">
                        <p style={{ marginBottom: "12px" }}>We retain your information only for as long as necessary to:</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Provide our services</li>
                            <li>Meet legal and regulatory requirements</li>
                            <li>Resolve disputes and enforce agreements</li>
                        </ul>
                    </Section>

                    <Section title="8. Your Rights">
                        <p style={{ marginBottom: "12px" }}>Depending on applicable laws, you may have the right to:</p>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                            <li>Access your personal data</li>
                            <li>Request correction or updates</li>
                            <li>Request deletion of your data</li>
                            <li>Withdraw consent where applicable</li>
                        </ul>
                    </Section>

                    <Section title="9. Third-Party Links">
                        Our platform may contain links to third-party websites or services. We are not responsible for their privacy practices or content. Please review their privacy policies separately.
                    </Section>

                    <Section title="10. Children's Privacy">
                        ChidiyaAI is intended for business users only. We do not knowingly collect data from individuals under the age of 18.
                    </Section>

                    <Section title="11. Changes to This Privacy Policy">
                        We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised "Last Updated" date. Continued use of the platform constitutes acceptance of the updated policy.
                    </Section>

                    <Section title="12. Contact Us">
                        <p style={{ color: "#334155" }}>If you have any questions or concerns about this Privacy Policy or your data, please contact us:</p>
                        <p style={{ marginTop: "12px", color: "#3b82f6" }}>📧 privacy@chidiyaai.com</p>
                        <p style={{ color: "#3b82f6" }}>📧 support@chidiyaai.com</p>
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
