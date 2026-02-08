"use client";

import { useState } from "react";

interface Supplier {
    id: string;
    companyName: string;
    city: string;
    state?: string;
    productCategories: string[];
    moq?: string;
    badges: string[];
    phone?: string;
    description?: string;
    matchScore?: number;
    rating?: number;
    price?: string;
    priceUnit?: string;
}

interface SupplierCardProps {
    supplier: Supplier;
    onViewContact?: (supplierId: string) => Promise<boolean> | void;
    onSave?: (supplierId: string) => void;
    isSaved?: boolean;
    contactsRemaining?: number; // Contacts remaining for free tier warning
}

export default function SupplierCard({
    supplier,
    onViewContact,
    onSave,
    isSaved = false,
    contactsRemaining = 3
}: SupplierCardProps) {
    const [showPhone, setShowPhone] = useState(false);
    const [saved, setSaved] = useState(isSaved);
    const [isLoading, setIsLoading] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);

    const handleViewContactClick = () => {
        // Show warning modal for free tier users
        if (contactsRemaining <= 3 && contactsRemaining > 0) {
            setShowWarningModal(true);
        } else {
            confirmViewContact();
        }
    };

    const confirmViewContact = async () => {
        setShowWarningModal(false);
        if (isLoading) return;
        setIsLoading(true);

        try {
            const result = await onViewContact?.(supplier.id);
            if (result !== false) {
                setShowPhone(true);
            }
        } catch {
            console.error("Failed to view contact");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        setSaved(!saved);
        onSave?.(supplier.id);
    };

    const matchColor = supplier.matchScore && supplier.matchScore >= 80
        ? "#22c55e"
        : supplier.matchScore && supplier.matchScore >= 60
            ? "#f59e0b"
            : "#64748b";

    const renderRating = () => {
        if (!supplier.rating) return null;
        const fullStars = Math.floor(supplier.rating);
        const hasHalf = supplier.rating % 1 >= 0.5;
        return (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
                <span style={{ fontSize: "14px" }}>
                    {"⭐".repeat(fullStars)}{hasHalf ? "⭐" : ""}
                </span>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                    {supplier.rating.toFixed(1)}
                </span>
            </div>
        );
    };

    return (
        <>
            {/* Warning Modal */}
            {showWarningModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    backdropFilter: "blur(4px)"
                }}>
                    <div style={{
                        backgroundColor: "white",
                        borderRadius: "20px",
                        padding: "28px",
                        maxWidth: "400px",
                        width: "90%",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                        animation: "fadeIn 0.2s ease-out"
                    }}>
                        <div style={{ textAlign: "center", marginBottom: "20px" }}>
                            <div style={{
                                width: "56px",
                                height: "56px",
                                backgroundColor: "#fef3c7",
                                borderRadius: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 16px",
                                fontSize: "24px"
                            }}>
                                ⚠️
                            </div>
                            <h3 style={{
                                margin: "0 0 8px",
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#0f172a"
                            }}>
                                Free Tier Limit
                            </h3>
                            <p style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#64748b",
                                lineHeight: "1.5"
                            }}>
                                You can view <strong>{contactsRemaining}</strong> more contact{contactsRemaining !== 1 ? "s" : ""} today.
                                <br />
                                <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                                    Subscribe for unlimited access.
                                </span>
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: "12px" }}>
                            <button
                                onClick={() => setShowWarningModal(false)}
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    backgroundColor: "#f1f5f9",
                                    color: "#64748b",
                                    border: "none",
                                    borderRadius: "12px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmViewContact}
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                                }}
                            >
                                Yes, View Contact
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Card */}
            <div style={{
                backgroundColor: "white",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "20px",
                marginBottom: "12px",
                transition: "all 0.2s",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
            }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                        <h3 style={{
                            margin: "0 0 4px",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#0f172a"
                        }}>
                            📦 {supplier.companyName}
                        </h3>
                        <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                            📍 {supplier.city}{supplier.state ? `, ${supplier.state}` : ""}
                        </p>
                    </div>
                    {supplier.matchScore && (
                        <div style={{
                            padding: "4px 10px",
                            backgroundColor: `${matchColor}15`,
                            color: matchColor,
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "600"
                        }}>
                            {supplier.matchScore}% Match
                        </div>
                    )}
                </div>

                {/* Rating */}
                {renderRating()}

                {/* Price */}
                {supplier.price && (
                    <div style={{
                        padding: "10px 14px",
                        backgroundColor: "#f0fdf4",
                        borderRadius: "10px",
                        marginBottom: "12px"
                    }}>
                        <p style={{ margin: "0", fontSize: "12px", color: "#15803d", fontWeight: "500" }}>
                            PRICE
                        </p>
                        <p style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
                            {supplier.price}
                            {supplier.priceUnit && (
                                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "400", marginLeft: "4px" }}>
                                    /{supplier.priceUnit}
                                </span>
                            )}
                        </p>
                    </div>
                )}

                {/* Badges */}
                {supplier.badges && supplier.badges.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                        {supplier.badges.includes("verified") && (
                            <span style={{
                                padding: "4px 10px",
                                backgroundColor: "#dcfce7",
                                color: "#15803d",
                                borderRadius: "8px",
                                fontSize: "11px",
                                fontWeight: "500"
                            }}>
                                ✓ Verified
                            </span>
                        )}
                        {supplier.badges.includes("gst") && (
                            <span style={{
                                padding: "4px 10px",
                                backgroundColor: "#dbeafe",
                                color: "#1d4ed8",
                                borderRadius: "8px",
                                fontSize: "11px",
                                fontWeight: "500"
                            }}>
                                GST Registered
                            </span>
                        )}
                        {supplier.badges.includes("premium") && (
                            <span style={{
                                padding: "4px 10px",
                                backgroundColor: "#fef3c7",
                                color: "#b45309",
                                borderRadius: "8px",
                                fontSize: "11px",
                                fontWeight: "500"
                            }}>
                                ⭐ Premium
                            </span>
                        )}
                    </div>
                )}

                {/* Products */}
                <div style={{ marginBottom: "12px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#94a3b8", fontWeight: "600", letterSpacing: "0.5px" }}>
                        PRODUCTS
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#0f172a" }}>
                        {supplier.productCategories.join(", ")}
                    </p>
                </div>

                {/* MOQ */}
                {supplier.moq && (
                    <div style={{ marginBottom: "16px" }}>
                        <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#94a3b8", fontWeight: "600", letterSpacing: "0.5px" }}>
                            MIN ORDER
                        </p>
                        <p style={{ margin: 0, fontSize: "13px", color: "#0f172a" }}>
                            {supplier.moq}
                        </p>
                    </div>
                )}

                {/* Phone Revealed */}
                {showPhone && supplier.phone && (
                    <div style={{
                        padding: "14px",
                        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                        borderRadius: "12px",
                        marginBottom: "12px",
                        textAlign: "center",
                        border: "1px solid #bbf7d0"
                    }}>
                        <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#15803d", fontWeight: "600", letterSpacing: "0.5px" }}>
                            CONTACT NUMBER
                        </p>
                        <a
                            href={`tel:${supplier.phone}`}
                            style={{
                                display: "block",
                                margin: 0,
                                fontSize: "20px",
                                fontWeight: "700",
                                color: "#0f172a",
                                textDecoration: "none"
                            }}
                        >
                            📞 {supplier.phone}
                        </a>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                    {!showPhone && (
                        <button
                            onClick={handleViewContactClick}
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                padding: "12px 16px",
                                background: isLoading
                                    ? "#94a3b8"
                                    : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: isLoading ? "wait" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                boxShadow: isLoading ? "none" : "0 4px 12px rgba(59, 130, 246, 0.25)",
                                transition: "all 0.2s"
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <span style={{
                                        width: "14px",
                                        height: "14px",
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        borderTopColor: "white",
                                        borderRadius: "50%",
                                        animation: "spin 0.8s linear infinite"
                                    }} />
                                    Loading...
                                </>
                            ) : (
                                <>📞 View Contact</>
                            )}
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        style={{
                            flex: showPhone ? 1 : 0.4,
                            padding: "12px 16px",
                            backgroundColor: saved ? "#dcfce7" : "#f8fafc",
                            color: saved ? "#15803d" : "#64748b",
                            border: saved ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
                            borderRadius: "12px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            transition: "all 0.2s"
                        }}
                    >
                        {saved ? "✓ Saved" : "⭐ Save"}
                    </button>
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </>
    );
}
