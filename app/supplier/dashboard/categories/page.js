"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SupplierCategoriesPage() {
    const [supplierCategories, setSupplierCategories] = useState([]);
    const [categoryTemplates, setCategoryTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [customDescription, setCustomDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch supplier categories and all templates
    useEffect(() => {
        async function fetchData() {
            try {
                const [categoriesRes, templatesRes] = await Promise.all([
                    fetch("/api/supplier/categories"),
                    fetch("/api/categories/templates")
                ]);

                if (categoriesRes.ok) {
                    const cats = await categoriesRes.json();
                    setSupplierCategories(cats.categories || []);
                }
                if (templatesRes.ok) {
                    const temps = await templatesRes.json();
                    setCategoryTemplates(temps.categories || []);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/supplier/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categoryTemplateId: selectedTemplate,
                    customDescription
                })
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess("Category request submitted! It will be reviewed by admin.");
                setShowAddCategory(false);
                setSelectedTemplate("");
                setCustomDescription("");
                // Refresh categories
                const catRes = await fetch("/api/supplier/categories");
                if (catRes.ok) {
                    const cats = await catRes.json();
                    setSupplierCategories(cats.categories || []);
                }
            } else {
                setError(data.error || "Failed to add category");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            approved: { bg: "#dcfce7", color: "#166534", text: "✓ Approved" },
            pending: { bg: "#fef9c3", color: "#854d0e", text: "⏳ Pending" },
            rejected: { bg: "#fee2e2", color: "#991b1b", text: "✗ Rejected" }
        };
        const s = styles[status] || styles.pending;
        return (
            <span style={{
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "500",
                backgroundColor: s.bg,
                color: s.color
            }}>
                {s.text}
            </span>
        );
    };

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8fafc"
            }}>
                <div style={{ color: "#64748b" }}>Loading...</div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#f8fafc",
            fontFamily: "'Inter', system-ui, sans-serif"
        }}>
            {/* Header */}
            <header style={{
                padding: "16px 24px",
                backgroundColor: "white",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <Link href="/supplier/dashboard" style={{
                        color: "#64748b",
                        textDecoration: "none",
                        fontSize: "14px"
                    }}>
                        ← Back to Dashboard
                    </Link>
                    <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a" }}>
                        My Categories
                    </h1>
                </div>
                <button
                    onClick={() => setShowAddCategory(true)}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    + Add Category
                </button>
            </header>

            <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
                {/* Success/Error Messages */}
                {success && (
                    <div style={{
                        padding: "12px 16px",
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        borderRadius: "8px",
                        marginBottom: "24px",
                        fontSize: "14px"
                    }}>
                        {success}
                    </div>
                )}
                {error && (
                    <div style={{
                        padding: "12px 16px",
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        borderRadius: "8px",
                        marginBottom: "24px",
                        fontSize: "14px"
                    }}>
                        {error}
                    </div>
                )}

                {/* Action Cards */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "20px",
                    marginBottom: "40px"
                }}>
                    <div
                        onClick={() => setShowAddCategory(true)}
                        style={{
                            padding: "24px",
                            backgroundColor: "white",
                            borderRadius: "12px",
                            border: "2px dashed #e2e8f0",
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.2s"
                        }}
                    >
                        <div style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: "#f0f9ff",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 12px",
                            fontSize: "24px"
                        }}>
                            📁
                        </div>
                        <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>
                            Request New Category
                        </h3>
                        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                            Add a new product category (requires admin approval)
                        </p>
                    </div>

                    <Link
                        href="/supplier/dashboard/products/add"
                        style={{
                            padding: "24px",
                            backgroundColor: "#0f172a",
                            borderRadius: "12px",
                            textDecoration: "none",
                            textAlign: "center",
                            display: "block"
                        }}
                    >
                        <div style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 12px",
                            fontSize: "24px"
                        }}>
                            📦
                        </div>
                        <h3 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "4px" }}>
                            Add Product
                        </h3>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                            Add products to your approved categories
                        </p>
                    </Link>
                </div>

                {/* Categories List */}
                <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "16px" }}>
                    Your Categories ({supplierCategories.length})
                </h2>

                {supplierCategories.length === 0 ? (
                    <div style={{
                        padding: "48px",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        textAlign: "center",
                        color: "#64748b"
                    }}>
                        <p style={{ fontSize: "18px", marginBottom: "8px" }}>No categories yet</p>
                        <p style={{ fontSize: "14px" }}>
                            Click "Add Category" to request your first product category
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {supplierCategories.map((cat) => (
                            <div
                                key={cat.id}
                                style={{
                                    padding: "20px",
                                    backgroundColor: "white",
                                    borderRadius: "12px",
                                    border: "1px solid #e2e8f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{
                                        width: "56px",
                                        height: "56px",
                                        backgroundColor: "#f0f9ff",
                                        borderRadius: "8px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "24px"
                                    }}>
                                        📁
                                    </div>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
                                                {cat.categoryTemplate?.name || cat.customName || "Custom Category"}
                                            </h3>
                                            {cat.isPrimary && (
                                                <span style={{
                                                    padding: "2px 8px",
                                                    backgroundColor: "#dbeafe",
                                                    color: "#1d4ed8",
                                                    borderRadius: "4px",
                                                    fontSize: "11px",
                                                    fontWeight: "500"
                                                }}>
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
                                            {cat.customDescription || cat.categoryTemplate?.description || "No description"}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    {getStatusBadge(cat.status)}
                                    {cat.status === "approved" && (
                                        <Link
                                            href={`/supplier/dashboard/products/add?categoryId=${cat.id}`}
                                            style={{
                                                padding: "8px 16px",
                                                backgroundColor: "#0f172a",
                                                color: "white",
                                                textDecoration: "none",
                                                borderRadius: "6px",
                                                fontSize: "13px",
                                                fontWeight: "500"
                                            }}
                                        >
                                            + Add Product
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add Category Modal */}
            {showAddCategory && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    padding: "20px"
                }}>
                    <div style={{
                        backgroundColor: "white",
                        borderRadius: "16px",
                        padding: "32px",
                        maxWidth: "500px",
                        width: "100%",
                        maxHeight: "90vh",
                        overflow: "auto"
                    }}>
                        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", marginBottom: "24px" }}>
                            Request New Category
                        </h2>

                        <form onSubmit={handleAddCategory}>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{
                                    display: "block",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#0f172a",
                                    marginBottom: "6px"
                                }}>
                                    Select Category *
                                </label>
                                <select
                                    value={selectedTemplate}
                                    onChange={(e) => setSelectedTemplate(e.target.value)}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        backgroundColor: "white"
                                    }}
                                >
                                    <option value="">Choose a category</option>
                                    {categoryTemplates
                                        .filter(t => !supplierCategories.some(sc => sc.categoryTemplateId === t.id))
                                        .map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div style={{ marginBottom: "24px" }}>
                                <label style={{
                                    display: "block",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#0f172a",
                                    marginBottom: "6px"
                                }}>
                                    Description *
                                </label>
                                <textarea
                                    value={customDescription}
                                    onChange={(e) => setCustomDescription(e.target.value)}
                                    required
                                    placeholder="Describe what products you'll add in this category..."
                                    rows={4}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        resize: "vertical",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div style={{
                                padding: "12px 16px",
                                backgroundColor: "#fef9c3",
                                borderRadius: "8px",
                                marginBottom: "24px",
                                fontSize: "13px",
                                color: "#854d0e"
                            }}>
                                ⚠️ New category requests require admin approval. You'll be notified once approved.
                            </div>

                            <div style={{ display: "flex", gap: "12px" }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddCategory(false)}
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        backgroundColor: "white",
                                        color: "#0f172a",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        fontWeight: "600",
                                        cursor: "pointer"
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !selectedTemplate || !customDescription}
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        backgroundColor: selectedTemplate && customDescription ? "#3b82f6" : "#e2e8f0",
                                        color: selectedTemplate && customDescription ? "white" : "#94a3b8",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontWeight: "600",
                                        cursor: selectedTemplate && customDescription ? "pointer" : "not-allowed"
                                    }}
                                >
                                    {submitting ? "Submitting..." : "Submit Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
