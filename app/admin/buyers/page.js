"use client";

import { useState, useEffect } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

const tabs = ["all", "flagged", "warned", "restricted"];

export default function BuyersPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dialog states
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, buyer: null, action: null });
    const [chatModal, setChatModal] = useState({ isOpen: false, buyer: null, chats: [] });
    const [contactsModal, setContactsModal] = useState({ isOpen: false, buyer: null, contacts: [] });

    useEffect(() => {
        fetchBuyers();
    }, []);

    const fetchBuyers = async () => {
        try {
            const res = await fetch("/api/admin/buyers");
            const data = await res.json();
            if (res.ok) setBuyers(data);
        } catch (error) {
            console.error("Failed to fetch buyers", error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredBuyers = () => {
        if (activeTab === "all") return buyers.filter(b => b.status !== "restricted");
        if (activeTab === "flagged") return buyers.filter(b => b.flagged && b.status !== "warned" && b.status !== "restricted");
        if (activeTab === "warned") return buyers.filter(b => b.status === "warned");
        if (activeTab === "restricted") return buyers.filter(b => b.status === "restricted");
        return buyers;
    };

    const openConfirmDialog = (buyer, action) => {
        setConfirmDialog({ isOpen: true, buyer, action });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({ isOpen: false, buyer: null, action: null });
    };

    const handleConfirmedAction = async () => {
        const { buyer, action } = confirmDialog;
        await handleAction(buyer.id, action);
    };

    const handleAction = async (id, action) => {
        try {
            const res = await fetch("/api/admin/buyers", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, action }),
            });

            if (res.ok) {
                const updated = await res.json();
                setBuyers(buyers.map(b => b.id === id ? updated : b));
            }
        } catch (error) {
            console.error("Action failed", error);
        }
    };

    const viewChats = async (buyer) => {
        try {
            const res = await fetch(`/api/admin/buyers/${buyer.id}/chats`);
            const data = await res.json();
            setChatModal({ isOpen: true, buyer, chats: data.chatSessions || [] });
        } catch (error) {
            console.error("Failed to fetch chats", error);
            setChatModal({ isOpen: true, buyer, chats: [] });
        }
    };

    const viewContacts = async (buyer) => {
        try {
            const res = await fetch(`/api/admin/buyers/${buyer.id}/contacts`);
            const data = await res.json();
            setContactsModal({ isOpen: true, buyer, contacts: data.contacts || [] });
        } catch (error) {
            console.error("Failed to fetch contacts", error);
            setContactsModal({ isOpen: true, buyer, contacts: [] });
        }
    };

    const getDialogConfig = (action) => {
        switch (action) {
            case "flag":
                return { title: "Flag Buyer", message: "Are you sure you want to flag this buyer?", type: "warning", confirmText: "Flag" };
            case "dismiss":
                return { title: "Dismiss Flag", message: "This will remove the flag from this buyer.", type: "info", confirmText: "Dismiss" };
            case "warn":
                return { title: "Warn Buyer", message: "Are you sure you want to warn this buyer?", type: "warning", confirmText: "Send Warning" };
            case "restrict":
                return { title: "Restrict Buyer", message: "This will restrict the buyer's access. They won't be able to use the platform.", type: "danger", confirmText: "Restrict" };
            case "restore":
                return { title: "Restore Buyer", message: "This will restore the buyer's access to the platform.", type: "info", confirmText: "Restore" };
            default:
                return { title: "Confirm Action", message: "Are you sure?", type: "warning", confirmText: "Confirm" };
        }
    };

    const stats = [
        { label: "Total", value: buyers.filter(b => b.status !== "restricted").length, color: "#3b82f6" },
        { label: "Flagged", value: buyers.filter(b => b.flagged).length, color: "#ef4444" },
        { label: "Warned", value: buyers.filter(b => b.status === "warned").length, color: "#f59e0b" },
        { label: "Restricted", value: buyers.filter(b => b.status === "restricted").length, color: "#94a3b8" },
    ];

    return (
        <div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .buy-title { font-size: 24px; font-weight: bold; color: white; margin-bottom: 4px; }
                .buy-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
                .buy-stat { background: #1e293b; padding: 16px; border-radius: 10px; border: 1px solid #334155; text-align: center; }
                .buy-stat-value { font-size: 28px; font-weight: bold; }
                .buy-stat-label { font-size: 12px; color: #94a3b8; margin-top: 4px; }
                .buy-tabs { display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 8px; }
                .buy-tab { padding: 10px 16px; border-radius: 8px; font-size: 14px; white-space: nowrap; cursor: pointer; border: 1px solid #334155; background: #1e293b; color: #94a3b8; text-transform: capitalize; }
                .buy-tab.active { background: #3b82f6; border-color: #3b82f6; color: white; }
                .buy-card { background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 16px; margin-bottom: 12px; }
                .buy-card-header { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
                .buy-card-name { font-size: 16px; font-weight: 600; color: white; }
                .buy-card-badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; }
                .buy-card-meta { font-size: 13px; color: #94a3b8; margin-bottom: 8px; }
                .buy-card-stats { display: flex; gap: 16px; font-size: 12px; color: #64748b; margin-bottom: 12px; }
                .buy-card-flag { background: #0f172a; padding: 10px; border-radius: 6px; margin-bottom: 12px; font-size: 13px; color: #94a3b8; border-left: 3px solid #ef4444; }
                .buy-card-actions { display: flex; gap: 8px; flex-wrap: wrap; }
                .buy-btn { padding: 8px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; border: none; }
                .buy-empty { background: #1e293b; border-radius: 12px; padding: 40px; text-align: center; color: #64748b; }
                
                @media (min-width: 768px) {
                    .buy-title { font-size: 28px; }
                    .buy-stats { grid-template-columns: repeat(4, 1fr); }
                }
            `}} />

            {/* Header */}
            <div style={{ marginBottom: "20px" }}>
                <h1 className="buy-title">Buyer Monitoring</h1>
                <p style={{ color: "#64748b", fontSize: "14px" }}>Monitor buyer accounts, view chats, and manage access</p>
            </div>

            {/* Stats - 2 columns on mobile, 4 on desktop */}
            <div className="buy-stats">
                {stats.map((stat, i) => (
                    <div key={i} className="buy-stat">
                        <div className="buy-stat-value" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="buy-stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="buy-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`buy-tab ${activeTab === tab ? "active" : ""}`}
                    >
                        {tab === "all" ? "All Buyers" : tab}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading ? (
                <div className="buy-empty">Loading buyers...</div>
            ) : (
                <>
                    {/* Buyer Cards */}
                    {getFilteredBuyers().length === 0 ? (
                        <div className="buy-empty">
                            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                            No buyers in this category
                        </div>
                    ) : (
                        getFilteredBuyers().map((buyer) => (
                            <div key={buyer.id} className="buy-card">
                                <div className="buy-card-header">
                                    <span className="buy-card-name">{buyer.name}</span>
                                    {buyer.flagged && (
                                        <span className="buy-card-badge" style={{ background: "#ef444420", color: "#ef4444" }}>
                                            🚩 {buyer.flagSeverity?.toUpperCase() || "FLAGGED"}
                                        </span>
                                    )}
                                    {buyer.status === "warned" && (
                                        <span className="buy-card-badge" style={{ background: "#f59e0b20", color: "#f59e0b" }}>⚠️ Warned</span>
                                    )}
                                    {buyer.status === "restricted" && (
                                        <span className="buy-card-badge" style={{ background: "#ef444420", color: "#ef4444" }}>⛔ Restricted</span>
                                    )}
                                </div>

                                <div className="buy-card-meta">
                                    📧 {buyer.email} {buyer.phone && `• 📱 ${buyer.phone}`}
                                </div>

                                <div className="buy-card-stats">
                                    <span>💬 {buyer.chatCount || buyer._count?.chatSessions || 0} chats</span>
                                    <span>📞 {buyer.contactCount || buyer._count?.contactLogs || 0} contacts viewed</span>
                                    <span>📅 Last active: {buyer.lastActive ? new Date(buyer.lastActive).toLocaleDateString() : "N/A"}</span>
                                </div>

                                {buyer.flagReason && (
                                    <div className="buy-card-flag">
                                        <strong style={{ color: "white" }}>AI Flag:</strong> {buyer.flagReason}
                                    </div>
                                )}

                                <div className="buy-card-actions">
                                    {/* View Actions */}
                                    <button onClick={() => viewChats(buyer)} className="buy-btn" style={{ background: "#3b82f620", color: "#3b82f6", border: "1px solid #3b82f6" }}>
                                        💬 View Chats
                                    </button>
                                    <button onClick={() => viewContacts(buyer)} className="buy-btn" style={{ background: "#8b5cf620", color: "#8b5cf6", border: "1px solid #8b5cf6" }}>
                                        📞 Contacts
                                    </button>

                                    {/* Status Actions */}
                                    {buyer.status === "active" && buyer.flagged && (
                                        <>
                                            <button onClick={() => openConfirmDialog(buyer, "dismiss")} className="buy-btn" style={{ background: "#334155", color: "#94a3b8" }}>Dismiss</button>
                                            <button onClick={() => openConfirmDialog(buyer, "warn")} className="buy-btn" style={{ background: "#f59e0b20", color: "#f59e0b", border: "1px solid #f59e0b" }}>Warn</button>
                                            <button onClick={() => openConfirmDialog(buyer, "restrict")} className="buy-btn" style={{ background: "#ef444420", color: "#ef4444", border: "1px solid #ef4444" }}>Restrict</button>
                                        </>
                                    )}
                                    {buyer.status === "active" && !buyer.flagged && (
                                        <>
                                            <button onClick={() => openConfirmDialog(buyer, "flag")} className="buy-btn" style={{ background: "#f59e0b20", color: "#f59e0b", border: "1px solid #f59e0b" }}>🚩 Flag</button>
                                            <button onClick={() => openConfirmDialog(buyer, "warn")} className="buy-btn" style={{ background: "#f59e0b20", color: "#f59e0b", border: "1px solid #f59e0b" }}>⚠️ Warn</button>
                                            <button onClick={() => openConfirmDialog(buyer, "restrict")} className="buy-btn" style={{ background: "#ef444420", color: "#ef4444", border: "1px solid #ef4444" }}>⛔ Restrict</button>
                                        </>
                                    )}
                                    {buyer.status === "warned" && (
                                        <>
                                            <button onClick={() => openConfirmDialog(buyer, "restore")} className="buy-btn" style={{ background: "#22c55e20", color: "#22c55e", border: "1px solid #22c55e" }}>Remove Warning</button>
                                            <button onClick={() => openConfirmDialog(buyer, "restrict")} className="buy-btn" style={{ background: "#ef444420", color: "#ef4444", border: "1px solid #ef4444" }}>Restrict</button>
                                        </>
                                    )}
                                    {buyer.status === "restricted" && (
                                        <button onClick={() => openConfirmDialog(buyer, "restore")} className="buy-btn" style={{ background: "#22c55e20", color: "#22c55e", border: "1px solid #22c55e" }}>Restore</button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </>
            )}

            {/* Confirm Dialog */}
            {confirmDialog.isOpen && (
                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    onClose={closeConfirmDialog}
                    onConfirm={handleConfirmedAction}
                    {...getDialogConfig(confirmDialog.action)}
                    message={`${getDialogConfig(confirmDialog.action).message} (${confirmDialog.buyer?.name})`}
                />
            )}

            {/* Chat Modal */}
            {chatModal.isOpen && (
                <ChatModal
                    buyer={chatModal.buyer}
                    chats={chatModal.chats}
                    onClose={() => setChatModal({ isOpen: false, buyer: null, chats: [] })}
                />
            )}

            {/* Contacts Modal */}
            {contactsModal.isOpen && (
                <ContactsModal
                    buyer={contactsModal.buyer}
                    contacts={contactsModal.contacts}
                    onClose={() => setContactsModal({ isOpen: false, buyer: null, contacts: [] })}
                />
            )}
        </div>
    );
}

// Chat History Modal
function ChatModal({ buyer, chats, onClose }) {
    const [expandedSession, setExpandedSession] = useState(null);

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px"
        }}>
            <div style={{ backgroundColor: "#1e293b", borderRadius: "16px", border: "1px solid #334155", maxWidth: "700px", width: "100%", padding: "24px", maxHeight: "85vh", overflow: "auto" }}>
                <h3 style={{ color: "white", fontSize: "20px", marginBottom: "8px" }}>💬 Chat History</h3>
                <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>{buyer.name} - {buyer.email}</p>

                {chats.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                        <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                        No chat sessions found
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {chats.map((session, i) => (
                            <div key={i} style={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #334155", overflow: "hidden" }}>
                                {/* Session Header */}
                                <div
                                    onClick={() => setExpandedSession(expandedSession === i ? null : i)}
                                    style={{
                                        padding: "14px 16px", cursor: "pointer",
                                        display: "flex", justifyContent: "space-between", alignItems: "center"
                                    }}
                                >
                                    <div>
                                        <div style={{ color: "white", fontWeight: "500" }}>
                                            Session {i + 1} - {session.category || "General"}
                                        </div>
                                        <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>
                                            📍 {session.location || "N/A"} •
                                            📅 {new Date(session.createdAt).toLocaleDateString()} •
                                            💬 {session.messages?.length || 0} messages
                                        </div>
                                    </div>
                                    <span style={{ color: "#64748b" }}>{expandedSession === i ? "▲" : "▼"}</span>
                                </div>

                                {/* Messages */}
                                {expandedSession === i && session.messages && (
                                    <div style={{ borderTop: "1px solid #334155", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflow: "auto" }}>
                                        {session.messages.map((msg, j) => (
                                            <div key={j} style={{
                                                padding: "10px 14px",
                                                borderRadius: "8px",
                                                backgroundColor: msg.role === "user" ? "#3b82f620" : "#1e293b",
                                                borderLeft: msg.role === "user" ? "3px solid #3b82f6" : "3px solid #22c55e",
                                                maxWidth: "90%",
                                                alignSelf: msg.role === "user" ? "flex-end" : "flex-start"
                                            }}>
                                                <div style={{ color: msg.role === "user" ? "#3b82f6" : "#22c55e", fontSize: "11px", marginBottom: "4px" }}>
                                                    {msg.role === "user" ? "Buyer" : "AI Assistant"}
                                                </div>
                                                <div style={{ color: "#e2e8f0", fontSize: "13px", lineHeight: "1.5" }}>{msg.content}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <button onClick={onClose} style={{ marginTop: "20px", width: "100%", padding: "12px", backgroundColor: "#334155", color: "#94a3b8", border: "none", borderRadius: "8px", cursor: "pointer" }}>Close</button>
            </div>
        </div>
    );
}

// Contacted Suppliers Modal
function ContactsModal({ buyer, contacts, onClose }) {
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px"
        }}>
            <div style={{ backgroundColor: "#1e293b", borderRadius: "16px", border: "1px solid #334155", maxWidth: "500px", width: "100%", padding: "24px", maxHeight: "80vh", overflow: "auto" }}>
                <h3 style={{ color: "white", fontSize: "20px", marginBottom: "8px" }}>📞 Contacted Suppliers</h3>
                <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>{buyer.name} - {contacts.length} suppliers contacted</p>

                {contacts.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                        <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                        No suppliers contacted yet
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {contacts.map((contact, i) => (
                            <div key={i} style={{ padding: "14px 16px", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #334155" }}>
                                <div style={{ color: "white", fontWeight: "500", marginBottom: "4px" }}>
                                    {contact.supplier?.companyName || contact.supplierId}
                                </div>
                                <div style={{ color: "#64748b", fontSize: "12px" }}>
                                    📅 Viewed: {new Date(contact.viewedAt).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </div>
                                {contact.supplier?.email && (
                                    <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>
                                        📧 {contact.supplier.email}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <button onClick={onClose} style={{ marginTop: "20px", width: "100%", padding: "12px", backgroundColor: "#334155", color: "#94a3b8", border: "none", borderRadius: "8px", cursor: "pointer" }}>Close</button>
            </div>
        </div>
    );
}
