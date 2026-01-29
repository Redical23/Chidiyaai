"use client";

import { useState, useEffect } from "react";

const logTypes = [
    { id: "all", label: "All Actions" },
    { id: "approval", label: "Approvals" },
    { id: "suspension", label: "Suspensions" },
    { id: "badge", label: "Badges" },
    { id: "buyer_action", label: "Buyer Actions" },
    { id: "category", label: "Categories" },
    { id: "login", label: "Logins" },
    { id: "inquiry", label: "Inquiries" },
];

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetchLogs();
    }, [filterType, searchTerm, page]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                type: filterType,
                search: searchTerm,
                page: page.toString(),
                limit: "50"
            });

            const res = await fetch(`/api/admin/logs?${params}`);
            const data = await res.json();

            if (res.ok) {
                setLogs(data.logs || []);
                setTotalPages(data.totalPages || 1);
                setTotal(data.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "approval": return "#22c55e";
            case "suspension": return "#ef4444";
            case "badge": return "#f59e0b";
            case "buyer_action": return "#8b5cf6";
            case "category": return "#3b82f6";
            case "login": return "#64748b";
            case "inquiry": return "#14b8a6";
            default: return "#94a3b8";
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "approval": return "✓";
            case "suspension": return "⛔";
            case "badge": return "🏅";
            case "buyer_action": return "👤";
            case "category": return "📁";
            case "login": return "🔐";
            case "inquiry": return "📬";
            default: return "📋";
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await fetch("/api/admin/logs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: filterType, search: searchTerm })
            });

            const data = await res.json();

            if (res.ok && data.logs) {
                // Generate PDF content
                const content = generatePDFContent(data.logs);
                downloadAsPDF(content, `audit_logs_${new Date().toISOString().split('T')[0]}.html`);
            }
        } catch (error) {
            console.error("Export failed", error);
            alert("Failed to export logs");
        } finally {
            setExporting(false);
        }
    };

    const generatePDFContent = (exportLogs) => {
        const rows = exportLogs.map(log => `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-size: 10px;">${log.id.slice(0, 8)}...</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${log.action}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${log.details}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${log.user}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${formatDate(log.timestamp)}</td>
            </tr>
        `).join("");

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>ChidiyaAI Audit Logs</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #1e293b; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #1e293b; color: white; padding: 12px 8px; text-align: left; }
                    tr:nth-child(even) { background: #f8fafc; }
                    .meta { color: #64748b; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <h1>🔐 ChidiyaAI Audit Logs</h1>
                <div class="meta">
                    <p>Exported: ${new Date().toLocaleString()}</p>
                    <p>Total Records: ${exportLogs.length}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Log ID</th>
                            <th>Action</th>
                            <th>Details</th>
                            <th>User</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </body>
            </html>
        `;
    };

    const downloadAsPDF = (content, filename) => {
        // For now, download as HTML that can be printed as PDF
        const blob = new Blob([content], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const stats = [
        { label: "Total Logs", value: total, color: "#3b82f6" },
        { label: "This Page", value: logs.length, color: "#22c55e" },
        { label: "Approvals", value: logs.filter(l => l.type === "approval").length, color: "#f59e0b" },
        { label: "Suspensions", value: logs.filter(l => l.type === "suspension").length, color: "#ef4444" },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                    <h1 className="admin-title">Audit Logs</h1>
                    <p style={{ color: "#64748b", fontSize: "14px" }}>
                        Real-time activity history of all admin actions
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={exporting}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: exporting ? "#1e293b" : "#334155",
                        color: "white",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: exporting ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    {exporting ? "⏳ Exporting..." : "📥 Export Logs"}
                </button>
            </div>

            {/* Filters */}
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "24px",
                border: "1px solid #334155"
            }}>
                <div className="admin-filters">
                    {/* Search */}
                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            placeholder="Search logs..."
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                backgroundColor: "#0f172a",
                                border: "1px solid #334155",
                                borderRadius: "8px",
                                color: "white",
                                fontSize: "14px",
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    {/* Type Filter */}
                    <select
                        value={filterType}
                        onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                        style={{
                            padding: "12px 16px",
                            backgroundColor: "#0f172a",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                            color: "white",
                            fontSize: "14px",
                            outline: "none",
                            minWidth: "150px"
                        }}
                    >
                        {logTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="admin-stats-grid" style={{ marginBottom: "24px" }}>
                {stats.map((stat, i) => (
                    <div key={i} style={{
                        backgroundColor: "#1e293b",
                        padding: "16px",
                        borderRadius: "10px",
                        border: "1px solid #334155"
                    }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Loading */}
            {loading ? (
                <div style={{
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    padding: "48px",
                    textAlign: "center",
                    color: "#64748b"
                }}>
                    Loading logs...
                </div>
            ) : (
                <>
                    {/* Logs List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {logs.length === 0 ? (
                            <div style={{
                                backgroundColor: "#1e293b",
                                borderRadius: "12px",
                                padding: "48px",
                                textAlign: "center",
                                color: "#64748b"
                            }}>
                                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                                No logs found matching your criteria
                            </div>
                        ) : (
                            logs.map((log) => (
                                <div key={log.id} style={{
                                    backgroundColor: "#1e293b",
                                    borderRadius: "10px",
                                    border: "1px solid #334155",
                                    borderLeft: `4px solid ${getTypeColor(log.type)}`,
                                    padding: "14px"
                                }}>
                                    <div className="admin-row">
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: 1 }}>
                                            <span style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "8px",
                                                backgroundColor: `${getTypeColor(log.type)}20`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "16px",
                                                flexShrink: 0
                                            }}>
                                                {getTypeIcon(log.type)}
                                            </span>
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                                    <span style={{ color: "white", fontSize: "15px", fontWeight: "500" }}>
                                                        {log.action}
                                                    </span>
                                                    <span style={{
                                                        padding: "2px 6px",
                                                        backgroundColor: `${getTypeColor(log.type)}20`,
                                                        color: getTypeColor(log.type),
                                                        borderRadius: "6px",
                                                        fontSize: "10px",
                                                        textTransform: "uppercase"
                                                    }}>
                                                        {log.type.replace("_", " ")}
                                                    </span>
                                                </div>
                                                <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>
                                                    {log.details}
                                                </div>
                                                <div style={{ color: "#475569", fontSize: "11px", marginTop: "4px" }}>
                                                    ID: {log.id.slice(0, 8)}...
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ minWidth: "120px", textAlign: "right" }}>
                                            <div style={{ color: "#64748b", fontSize: "12px" }}>{formatDate(log.timestamp)}</div>
                                            <div style={{ color: "#475569", fontSize: "11px" }}>by {log.user}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    <div style={{
                        marginTop: "24px",
                        padding: "16px",
                        backgroundColor: "#1e293b",
                        borderRadius: "10px",
                        border: "1px solid #334155",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px"
                    }}>
                        <span style={{ color: "#64748b", fontSize: "14px" }}>
                            Page {page} of {totalPages} ({total} total logs)
                        </span>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: page === 1 ? "#1e293b" : "#334155",
                                    color: page === 1 ? "#475569" : "#94a3b8",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "13px",
                                    cursor: page === 1 ? "not-allowed" : "pointer"
                                }}
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: page === totalPages ? "#1e293b" : "#334155",
                                    color: page === totalPages ? "#475569" : "#94a3b8",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "13px",
                                    cursor: page === totalPages ? "not-allowed" : "pointer"
                                }}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
