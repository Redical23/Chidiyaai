"use client";

import { useState, useEffect } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [supplierCategories, setSupplierCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, category: null });
    const [totalSuppliers, setTotalSuppliers] = useState(0);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/admin/categories");
            const data = await res.json();
            if (res.ok) {
                setCategories(data.categories || []);
                setSupplierCategories(data.supplierCategories || []);
                setTotalSuppliers(data.totalSuppliers || 0);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditCategory(null);
        setFormData({ name: "", description: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setEditCategory(category);
        setFormData({ name: category.name, description: category.description || "" });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const url = "/api/admin/categories";
            const method = editCategory ? "PUT" : "POST";
            const body = editCategory
                ? { id: editCategory.id, ...formData }
                : formData;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                fetchCategories();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Save failed", error);
        }
    };

    const toggleStatus = async (category) => {
        try {
            const res = await fetch("/api/admin/categories", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: category.id, isActive: !category.isActive })
            });

            if (res.ok) {
                setCategories(categories.map(c =>
                    c.id === category.id ? { ...c, isActive: !c.isActive } : c
                ));
            }
        } catch (error) {
            console.error("Toggle failed", error);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/admin/categories?id=${confirmDialog.category.id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setCategories(categories.filter(c => c.id !== confirmDialog.category.id));
                setConfirmDialog({ isOpen: false, category: null });
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const stats = [
        { label: "Total Categories", value: categories.length, color: "#3b82f6" },
        { label: "Active", value: categories.filter(c => c.isActive).length, color: "#22c55e" },
        { label: "Inactive", value: categories.filter(c => !c.isActive).length, color: "#f59e0b" },
        { label: "Suppliers Listed", value: totalSuppliers, color: "#8b5cf6" },
    ];

    return (
        <div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .cat-title { font-size: 24px; font-weight: bold; color: white; margin-bottom: 4px; }
                .cat-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; }
                .cat-stat { background: #1e293b; padding: 16px; border-radius: 10px; border: 1px solid #334155; text-align: center; }
                .cat-stat-value { font-size: 28px; font-weight: bold; }
                .cat-stat-label { font-size: 12px; color: #94a3b8; margin-top: 4px; }
                .cat-table { width: 100%; background: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; }
                .cat-table th { text-align: left; padding: 16px; background: #0f172a; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                .cat-table td { padding: 16px; border-top: 1px solid #334155; }
                .cat-btn { padding: 8px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; border: none; }
                .cat-empty { padding: 40px; text-align: center; color: #64748b; }
                .cat-supplier-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
                .cat-supplier-tag { padding: 6px 12px; background: #334155; border-radius: 20px; font-size: 12px; color: #94a3b8; }
                
                @media (min-width: 768px) {
                    .cat-title { font-size: 28px; }
                    .cat-stats { grid-template-columns: repeat(4, 1fr); }
                }
            `}} />

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                    <h1 className="cat-title">Categories</h1>
                    <p style={{ color: "#64748b", fontSize: "14px" }}>Manage product categories and see supplier distribution</p>
                </div>
                <button
                    onClick={openAddModal}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    ➕ Add Category
                </button>
            </div>

            {/* Stats */}
            <div className="cat-stats">
                {stats.map((stat, i) => (
                    <div key={i} className="cat-stat">
                        <div className="cat-stat-value" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="cat-stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Categories Table */}
            {loading ? (
                <div className="cat-table">
                    <div className="cat-empty">Loading categories...</div>
                </div>
            ) : categories.length === 0 ? (
                <div className="cat-table">
                    <div className="cat-empty">
                        <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                        No categories found. Add one to get started.
                    </div>
                </div>
            ) : (
                <table className="cat-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Suppliers</th>
                            <th>Inquiries</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>
                                    <div style={{ color: "white", fontWeight: "500" }}>{category.name}</div>
                                    {category.description && (
                                        <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>{category.description}</div>
                                    )}
                                </td>
                                <td>
                                    <span style={{
                                        padding: "4px 10px",
                                        backgroundColor: category.supplierCount > 0 ? "#3b82f620" : "#33415520",
                                        color: category.supplierCount > 0 ? "#3b82f6" : "#64748b",
                                        borderRadius: "12px",
                                        fontSize: "13px",
                                        fontWeight: "500"
                                    }}>
                                        {category.supplierCount} suppliers
                                    </span>
                                </td>
                                <td>
                                    <span style={{ color: "#94a3b8", fontSize: "14px" }}>
                                        {category.inquiryCount || 0}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => toggleStatus(category)}
                                        style={{
                                            padding: "6px 12px",
                                            backgroundColor: category.isActive ? "#22c55e20" : "#f59e0b20",
                                            color: category.isActive ? "#22c55e" : "#f59e0b",
                                            border: `1px solid ${category.isActive ? "#22c55e" : "#f59e0b"}`,
                                            borderRadius: "6px",
                                            fontSize: "12px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {category.isActive ? "Active" : "Inactive"}
                                    </button>
                                </td>
                                <td>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button
                                            onClick={() => openEditModal(category)}
                                            className="cat-btn"
                                            style={{ background: "#334155", color: "#94a3b8" }}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => setConfirmDialog({ isOpen: true, category })}
                                            className="cat-btn"
                                            style={{ background: "#ef444420", color: "#ef4444" }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Supplier Categories Info */}
            {supplierCategories.length > 0 && (
                <div style={{ marginTop: "24px", padding: "20px", backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155" }}>
                    <h3 style={{ color: "white", fontSize: "16px", marginBottom: "12px" }}>
                        📦 All Categories from Suppliers ({supplierCategories.length})
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "12px" }}>
                        These are the categories that suppliers have listed in their profiles:
                    </p>
                    <div className="cat-supplier-tags">
                        {supplierCategories.slice(0, 50).map((cat, i) => (
                            <span key={i} className="cat-supplier-tag">{cat}</span>
                        ))}
                        {supplierCategories.length > 50 && (
                            <span className="cat-supplier-tag">+{supplierCategories.length - 50} more</span>
                        )}
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px"
                }}>
                    <div style={{ backgroundColor: "#1e293b", borderRadius: "16px", border: "1px solid #334155", maxWidth: "450px", width: "100%", padding: "24px" }}>
                        <h3 style={{ color: "white", fontSize: "20px", marginBottom: "20px" }}>
                            {editCategory ? "Edit Category" : "Add Category"}
                        </h3>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Category name"
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

                        <div style={{ marginBottom: "24px" }}>
                            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>Description (optional)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Category description"
                                rows={3}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    backgroundColor: "#0f172a",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                    color: "white",
                                    fontSize: "14px",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    resize: "vertical"
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: "12px" }}>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{ flex: 1, padding: "12px", backgroundColor: "#334155", color: "#94a3b8", border: "none", borderRadius: "8px", cursor: "pointer" }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formData.name.trim()}
                                style={{ flex: 1, padding: "12px", backgroundColor: formData.name.trim() ? "#3b82f6" : "#1e293b", color: "white", border: "none", borderRadius: "8px", cursor: formData.name.trim() ? "pointer" : "not-allowed" }}
                            >
                                {editCategory ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {confirmDialog.isOpen && (
                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    onClose={() => setConfirmDialog({ isOpen: false, category: null })}
                    onConfirm={handleDelete}
                    title="Delete Category"
                    message={`Are you sure you want to delete "${confirmDialog.category?.name}"? This action cannot be undone.`}
                    type="danger"
                    confirmText="Delete"
                />
            )}
        </div>
    );
}
