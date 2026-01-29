"use client";

import { useState } from "react";

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Yes, Confirm",
    cancelText = "Cancel",
    type = "warning" // warning, danger, info
}) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const getTypeColor = () => {
        switch (type) {
            case "danger": return "#ef4444";
            case "warning": return "#f59e0b";
            case "info": return "#3b82f6";
            default: return "#f59e0b";
        }
    };

    const getTypeIcon = () => {
        switch (type) {
            case "danger": return "⛔";
            case "warning": return "⚠️";
            case "info": return "ℹ️";
            default: return "⚠️";
        }
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px"
        }}>
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "16px",
                border: "1px solid #334155",
                maxWidth: "400px",
                width: "100%",
                padding: "24px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}>
                {/* Icon */}
                <div style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: `${getTypeColor()}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "28px"
                }}>
                    {getTypeIcon()}
                </div>

                {/* Title */}
                <h3 style={{
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "600",
                    textAlign: "center",
                    marginBottom: "12px"
                }}>
                    {title}
                </h3>

                {/* Message */}
                <p style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    textAlign: "center",
                    marginBottom: "24px",
                    lineHeight: "1.5"
                }}>
                    {message}
                </p>

                {/* Buttons */}
                <div style={{
                    display: "flex",
                    gap: "12px"
                }}>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: "12px 20px",
                            backgroundColor: "#334155",
                            color: "#94a3b8",
                            border: "1px solid #475569",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.5 : 1
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: "12px 20px",
                            backgroundColor: getTypeColor(),
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Suspension dialog with duration options
export function SuspensionDialog({ isOpen, onClose, onConfirm, supplierName }) {
    const [duration, setDuration] = useState("7");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm(parseInt(duration));
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const durations = [
        { value: "1", label: "1 Day" },
        { value: "3", label: "3 Days" },
        { value: "7", label: "7 Days" },
        { value: "15", label: "15 Days" },
        { value: "30", label: "1 Month" },
    ];

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px"
        }}>
            <div style={{
                backgroundColor: "#1e293b",
                borderRadius: "16px",
                border: "1px solid #334155",
                maxWidth: "400px",
                width: "100%",
                padding: "24px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}>
                {/* Icon */}
                <div style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "#f59e0b20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "28px"
                }}>
                    ⏱️
                </div>

                {/* Title */}
                <h3 style={{
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "600",
                    textAlign: "center",
                    marginBottom: "8px"
                }}>
                    Suspend Supplier
                </h3>

                {/* Supplier Name */}
                <p style={{
                    color: "#3b82f6",
                    fontSize: "14px",
                    textAlign: "center",
                    marginBottom: "20px"
                }}>
                    {supplierName}
                </p>

                {/* Duration Selection */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={{
                        display: "block",
                        color: "#94a3b8",
                        fontSize: "13px",
                        marginBottom: "10px"
                    }}>
                        Suspension Duration
                    </label>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: "8px"
                    }}>
                        {durations.map((d) => (
                            <button
                                key={d.value}
                                onClick={() => setDuration(d.value)}
                                style={{
                                    padding: "10px 8px",
                                    backgroundColor: duration === d.value ? "#f59e0b" : "#334155",
                                    color: duration === d.value ? "#000" : "#94a3b8",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div style={{
                    display: "flex",
                    gap: "12px"
                }}>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: "12px 20px",
                            backgroundColor: "#334155",
                            color: "#94a3b8",
                            border: "1px solid #475569",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: "12px 20px",
                            backgroundColor: "#f59e0b",
                            color: "#000",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading ? "Processing..." : "Suspend"}
                    </button>
                </div>
            </div>
        </div>
    );
}
