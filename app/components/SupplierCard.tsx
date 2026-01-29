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
}

export default function SupplierCard({ supplier, onViewContact, onSave, isSaved = false }: SupplierCardProps) {
    const [showPhone, setShowPhone] = useState(false);
    const [saved, setSaved] = useState(isSaved);
    const [isLoading, setIsLoading] = useState(false);

    const handleViewContact = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const result = await onViewContact?.(supplier.id);
            // Only show phone if contact view was allowed (not exceeded limit)
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

    // Generate star rating display
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
        <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "20px",
            marginBottom: "12px",
            transition: "box-shadow 0.2s"
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
                            padding: "3px 8px",
                            backgroundColor: "#dcfce7",
                            color: "#15803d",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "500"
                        }}>
                            ✓ Verified
                        </span>
                    )}
                    {supplier.badges.includes("gst") && (
                        <span style={{
                            padding: "3px 8px",
                            backgroundColor: "#dbeafe",
                            color: "#1d4ed8",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "500"
                        }}>
                            GST Registered
                        </span>
                    )}
                    {supplier.badges.includes("premium") && (
                        <span style={{
                            padding: "3px 8px",
                            backgroundColor: "#fef3c7",
                            color: "#b45309",
                            borderRadius: "6px",
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
                <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>
                    PRODUCTS
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "#0f172a" }}>
                    {supplier.productCategories.join(", ")}
                </p>
            </div>

            {/* MOQ */}
            {supplier.moq && (
                <div style={{ marginBottom: "16px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>
                        MIN ORDER
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#0f172a" }}>
                        {supplier.moq}
                    </p>
                </div>
            )}

            {/* Phone */}
            {showPhone && supplier.phone && (
                <div style={{
                    padding: "12px",
                    backgroundColor: "#f0fdf4",
                    borderRadius: "10px",
                    marginBottom: "12px",
                    textAlign: "center"
                }}>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#15803d", fontWeight: "500" }}>
                        CONTACT NUMBER
                    </p>
                    <p style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>
                        📞 {supplier.phone}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
                {!showPhone && (
                    <button
                        onClick={handleViewContact}
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            padding: "10px",
                            backgroundColor: isLoading ? "#64748b" : "#0f172a",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: isLoading ? "wait" : "pointer"
                        }}
                    >
                        {isLoading ? "Loading..." : "📞 View Contact"}
                    </button>
                )}
                <button
                    onClick={handleSave}
                    style={{
                        flex: showPhone ? 1 : 0,
                        padding: "10px 16px",
                        backgroundColor: saved ? "#dcfce7" : "#f1f5f9",
                        color: saved ? "#15803d" : "#64748b",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer"
                    }}
                >
                    {saved ? "✓ Saved" : "⭐ Save"}
                </button>
            </div>
        </div>
    );
}

