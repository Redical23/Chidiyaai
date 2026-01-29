"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";

// Date formatter options (hoisted outside component)
const dateFormatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
};

interface ChatSession {
    id: string;
    location: string | null;
    category: string | null;
    quantity: string | null;
    budget: string | null;
    status: string;
    createdAt: string;
    lastMessage: string | null;
}

interface SavedSupplier {
    id: string;
    companyName: string;
    city: string | null;
    productCategories: string[];
    badges: string[];
    phone: string | null;
}

interface Activity {
    type: string;
    supplierId: string;
    supplierName: string;
    timestamp: string;
}

export default function BuyerDashboard() {
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [savedSuppliers, setSavedSuppliers] = useState<SavedSupplier[]>([]);
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"inquiries" | "saved" | "history">("inquiries");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch("/api/buyer/dashboard");
            const data = await response.json();
            if (data.success) {
                setChatSessions(data.chatSessions || []);
                setSavedSuppliers(data.savedSuppliers || []);
                setRecentActivity(data.recentActivity || []);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Memoize formatDate for stable reference (rerender optimization)
    const formatDate = useCallback((dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-IN", dateFormatOptions);
    }, []);

    return (
        <div style={{
            minHeight: "100vh",
            fontFamily: "'Inter', system-ui, sans-serif",
            backgroundColor: "#f8fafc"
        }}>
            {/* Header */}
            <header style={{
                backgroundColor: "white",
                borderBottom: "1px solid #e2e8f0",
                padding: "14px 24px"
            }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                        <Image
                            src="/assests/chidiyaailogo.png"
                            alt="ChidiyaAI"
                            width={140}
                            height={38}
                            style={{ height: "38px", width: "auto" }}
                            priority
                        />
                    </Link>
                    <div style={{ display: "flex", gap: "16px", fontSize: "14px", alignItems: "center" }}>
                        <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
                        <Link href="/account/chat" style={{
                            color: "white",
                            textDecoration: "none",
                            fontWeight: "500",
                            backgroundColor: "#3b82f6",
                            padding: "8px 16px",
                            borderRadius: "8px"
                        }}>+ New Search</Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px" }}>
                    Buyer Dashboard
                </h1>
                <p style={{ fontSize: "15px", color: "#64748b", margin: "0 0 32px" }}>
                    Manage your sourcing requests and supplier connections
                </p>

                {/* Tabs */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "0" }}>
                    {[
                        { key: "inquiries", label: "📋 My Inquiries", count: chatSessions.length },
                        { key: "saved", label: "⭐ Saved Suppliers", count: savedSuppliers.length },
                        { key: "history", label: "💬 Recent Activity", count: recentActivity.length }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as typeof activeTab)}
                            style={{
                                padding: "12px 20px",
                                backgroundColor: "transparent",
                                border: "none",
                                borderBottom: activeTab === tab.key ? "2px solid #3b82f6" : "2px solid transparent",
                                color: activeTab === tab.key ? "#0f172a" : "#64748b",
                                fontWeight: activeTab === tab.key ? "600" : "400",
                                fontSize: "14px",
                                cursor: "pointer",
                                marginBottom: "-1px"
                            }}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
                        Loading...
                    </div>
                ) : (
                    <>
                        {/* My Inquiries Tab */}
                        {activeTab === "inquiries" && (
                            <div>
                                {chatSessions.length === 0 ? (
                                    <div style={{
                                        backgroundColor: "white",
                                        borderRadius: "16px",
                                        border: "1px solid #e2e8f0",
                                        padding: "48px",
                                        textAlign: "center"
                                    }}>
                                        <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}>📦</div>
                                        <p style={{ fontSize: "15px", color: "#64748b", margin: "0 0 16px" }}>
                                            No inquiries yet
                                        </p>
                                        <Link href="/account/chat" style={{
                                            display: "inline-block",
                                            padding: "12px 24px",
                                            backgroundColor: "#0f172a",
                                            color: "white",
                                            borderRadius: "10px",
                                            textDecoration: "none",
                                            fontSize: "14px",
                                            fontWeight: "500"
                                        }}>
                                            Start Your First Search
                                        </Link>
                                    </div>
                                ) : (
                                    <div style={{ display: "grid", gap: "16px" }}>
                                        {chatSessions.map(session => (
                                            <div key={session.id} style={{
                                                backgroundColor: "white",
                                                borderRadius: "12px",
                                                border: "1px solid #e2e8f0",
                                                padding: "20px",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}>
                                                <div>
                                                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                                                        {session.category && (
                                                            <span style={{
                                                                padding: "4px 10px",
                                                                backgroundColor: "#dcfce7",
                                                                color: "#15803d",
                                                                borderRadius: "12px",
                                                                fontSize: "12px"
                                                            }}>📦 {session.category}</span>
                                                        )}
                                                        {session.location && (
                                                            <span style={{
                                                                padding: "4px 10px",
                                                                backgroundColor: "#dbeafe",
                                                                color: "#1d4ed8",
                                                                borderRadius: "12px",
                                                                fontSize: "12px"
                                                            }}>📍 {session.location}</span>
                                                        )}
                                                        {session.budget && (
                                                            <span style={{
                                                                padding: "4px 10px",
                                                                backgroundColor: "#fef3c7",
                                                                color: "#b45309",
                                                                borderRadius: "12px",
                                                                fontSize: "12px"
                                                            }}>💰 {session.budget}</span>
                                                        )}
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                                                        {formatDate(session.createdAt)}
                                                        {session.lastMessage && ` • "${session.lastMessage}..."`}
                                                    </p>
                                                </div>
                                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                    <Link
                                                        href={`/account/chat?session=${session.id}`}
                                                        style={{
                                                            padding: "8px 14px",
                                                            backgroundColor: "#0f172a",
                                                            color: "white",
                                                            borderRadius: "8px",
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            textDecoration: "none",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "4px"
                                                        }}
                                                    >
                                                        💬 Continue
                                                    </Link>
                                                    <span style={{
                                                        padding: "4px 10px",
                                                        backgroundColor: session.status === "active" ? "#dcfce7" : "#f1f5f9",
                                                        color: session.status === "active" ? "#15803d" : "#64748b",
                                                        borderRadius: "8px",
                                                        fontSize: "12px",
                                                        fontWeight: "500"
                                                    }}>
                                                        {session.status === "active" ? "Active" : "Completed"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Saved Suppliers Tab */}
                        {activeTab === "saved" && (
                            <div>
                                {savedSuppliers.length === 0 ? (
                                    <div style={{
                                        backgroundColor: "white",
                                        borderRadius: "16px",
                                        border: "1px solid #e2e8f0",
                                        padding: "48px",
                                        textAlign: "center"
                                    }}>
                                        <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}>⭐</div>
                                        <p style={{ fontSize: "15px", color: "#64748b", margin: "0 0 16px" }}>
                                            No saved suppliers yet
                                        </p>
                                        <Link href="/account/chat" style={{
                                            display: "inline-block",
                                            padding: "12px 24px",
                                            backgroundColor: "#0f172a",
                                            color: "white",
                                            borderRadius: "10px",
                                            textDecoration: "none",
                                            fontSize: "14px",
                                            fontWeight: "500"
                                        }}>
                                            Find Suppliers
                                        </Link>
                                    </div>
                                ) : (
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
                                        {savedSuppliers.map(supplier => (
                                            <div key={supplier.id} style={{
                                                backgroundColor: "white",
                                                borderRadius: "12px",
                                                border: "1px solid #e2e8f0",
                                                padding: "20px"
                                            }}>
                                                <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>
                                                    📦 {supplier.companyName}
                                                </h3>
                                                <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#64748b" }}>
                                                    📍 {supplier.city || "India"}
                                                </p>
                                                {supplier.badges && supplier.badges.length > 0 && (
                                                    <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
                                                        {supplier.badges.includes("verified") && (
                                                            <span style={{ padding: "3px 8px", backgroundColor: "#dcfce7", color: "#15803d", borderRadius: "6px", fontSize: "11px" }}>
                                                                ✓ Verified
                                                            </span>
                                                        )}
                                                        {supplier.badges.includes("gst") && (
                                                            <span style={{ padding: "3px 8px", backgroundColor: "#dbeafe", color: "#1d4ed8", borderRadius: "6px", fontSize: "11px" }}>
                                                                GST
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {supplier.phone && (
                                                    <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "#15803d" }}>
                                                        📞 {supplier.phone}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Recent Activity Tab */}
                        {activeTab === "history" && (
                            <div>
                                {recentActivity.length === 0 ? (
                                    <div style={{
                                        backgroundColor: "white",
                                        borderRadius: "16px",
                                        border: "1px solid #e2e8f0",
                                        padding: "48px",
                                        textAlign: "center"
                                    }}>
                                        <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}>💬</div>
                                        <p style={{ fontSize: "15px", color: "#64748b", margin: 0 }}>
                                            No recent activity yet
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{
                                        backgroundColor: "white",
                                        borderRadius: "12px",
                                        border: "1px solid #e2e8f0"
                                    }}>
                                        {recentActivity.map((activity, i) => (
                                            <div key={i} style={{
                                                padding: "16px 20px",
                                                borderBottom: i < recentActivity.length - 1 ? "1px solid #e2e8f0" : "none",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px"
                                            }}>
                                                <span style={{ fontSize: "20px" }}>📞</span>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: "14px", color: "#0f172a" }}>
                                                        Viewed contact for <strong>{activity.supplierName}</strong>
                                                    </p>
                                                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b" }}>
                                                        {formatDate(activity.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
