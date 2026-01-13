"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Mock data
const stats = [
    { label: "Pending Approvals", value: 12, color: "#f59e0b", icon: "⏳", href: "/admin/suppliers" },
    { label: "Active Suppliers", value: 156, color: "#22c55e", icon: "🏭", href: "/admin/suppliers" },
    { label: "Flagged Buyers", value: 5, color: "#ef4444", icon: "🚩", href: "/admin/buyers" },
    { label: "Today's Inquiries", value: 47, color: "#3b82f6", icon: "📬", href: "/admin/logs" },
];

const recentActivity = [
    { id: 1, type: "approval", message: "Approved supplier: Excel Manufacturing", time: "5 min ago", icon: "✓" },
    { id: 2, type: "flag", message: "AI flagged buyer: suspicious activity", time: "12 min ago", icon: "🚩" },
    { id: 3, type: "badge", message: "Awarded 'Premium' badge to Quality Fabrics", time: "1 hour ago", icon: "🏆" },
    { id: 4, type: "suspend", message: "Suspended supplier: Fake Corp", time: "2 hours ago", icon: "⛔" },
    { id: 5, type: "category", message: "Created new category: Industrial Equipment", time: "3 hours ago", icon: "📁" },
];

const aiAlerts = [
    { id: 1, severity: "high", title: "Potential fake supplier detected", desc: "New registration with mismatched GST", action: "Review" },
    { id: 2, severity: "medium", title: "Unusual inquiry pattern", desc: "Buyer sent 15 identical inquiries", action: "Investigate" },
    { id: 3, severity: "low", title: "Document verification pending", desc: "3 suppliers awaiting review for 48+ hours", action: "Process" },
];

export default function AdminDashboard() {
    const [windowWidth, setWindowWidth] = useState(1024);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = windowWidth < 768;

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: "bold", color: "white", marginBottom: "4px" }}>
                    Dashboard
                </h1>
                <p style={{ color: "#64748b", fontSize: "14px" }}>
                    Welcome back! Here's what's happening today.
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                gap: isMobile ? "12px" : "16px",
                marginBottom: "24px"
            }}>
                {stats.map((stat, i) => (
                    <Link key={i} href={stat.href} style={{ textDecoration: "none" }}>
                        <div style={{
                            backgroundColor: "#1e293b",
                            padding: isMobile ? "14px" : "20px",
                            borderRadius: "12px",
                            border: "1px solid #334155"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ fontSize: isMobile ? "20px" : "24px" }}>{stat.icon}</span>
                            </div>
                            <div style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "bold", color: stat.color, marginBottom: "4px" }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: isMobile ? "11px" : "13px", color: "#94a3b8" }}>{stat.label}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Main Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? "16px" : "24px"
            }}>
                {/* AI Alerts */}
                <div style={{
                    backgroundColor: "#1e293b",
                    borderRadius: "16px",
                    border: "1px solid #334155",
                    padding: isMobile ? "16px" : "20px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <h2 style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: "600", color: "white" }}>🤖 AI Alerts</h2>
                        <span style={{
                            padding: "4px 10px",
                            backgroundColor: "#ef444420",
                            color: "#ef4444",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500"
                        }}>
                            {aiAlerts.length} Active
                        </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {aiAlerts.map((alert) => (
                            <div key={alert.id} style={{
                                padding: isMobile ? "12px" : "14px",
                                backgroundColor: "#0f172a",
                                borderRadius: "10px",
                                borderLeft: `3px solid ${alert.severity === "high" ? "#ef4444" :
                                        alert.severity === "medium" ? "#f59e0b" : "#3b82f6"
                                    }`
                            }}>
                                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "flex-start", gap: "12px" }}>
                                    <div>
                                        <div style={{ color: "white", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>
                                            {alert.title}
                                        </div>
                                        <div style={{ color: "#64748b", fontSize: "13px" }}>{alert.desc}</div>
                                    </div>
                                    <button style={{
                                        padding: "6px 12px",
                                        backgroundColor: "#334155",
                                        border: "none",
                                        borderRadius: "6px",
                                        color: "white",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        alignSelf: isMobile ? "flex-start" : "auto"
                                    }}>
                                        {alert.action}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div style={{
                    backgroundColor: "#1e293b",
                    borderRadius: "16px",
                    border: "1px solid #334155",
                    padding: isMobile ? "16px" : "20px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <h2 style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: "600", color: "white" }}>📋 Recent Activity</h2>
                        <Link href="/admin/logs" style={{ color: "#3b82f6", fontSize: "13px", textDecoration: "none" }}>
                            View All
                        </Link>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {recentActivity.slice(0, isMobile ? 3 : 5).map((activity) => (
                            <div key={activity.id} style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px",
                                backgroundColor: "#0f172a",
                                borderRadius: "10px"
                            }}>
                                <span style={{ fontSize: "16px" }}>{activity.icon}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ color: "white", fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{activity.message}</div>
                                    <div style={{ color: "#64748b", fontSize: "11px" }}>{activity.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{
                marginTop: "24px",
                backgroundColor: "#1e293b",
                borderRadius: "16px",
                border: "1px solid #334155",
                padding: isMobile ? "16px" : "20px"
            }}>
                <h2 style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: "600", color: "white", marginBottom: "16px" }}>⚡ Quick Actions</h2>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
                    gap: "12px"
                }}>
                    {[
                        { label: "Review Pending Suppliers", href: "/admin/suppliers", color: "#f59e0b" },
                        { label: "Check Flagged Buyers", href: "/admin/buyers", color: "#ef4444" },
                        { label: "Add New Category", href: "/admin/categories", color: "#22c55e" },
                        { label: "Export Audit Logs", href: "/admin/logs", color: "#3b82f6" },
                    ].map((action, i) => (
                        <Link key={i} href={action.href} style={{
                            display: "block",
                            padding: "14px",
                            backgroundColor: `${action.color}20`,
                            color: action.color,
                            border: `1px solid ${action.color}40`,
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            textDecoration: "none",
                            textAlign: "center"
                        }}>
                            {action.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
