"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SupplierRegister() {
    const [formData, setFormData] = useState({
        companyName: "",
        email: "",
        phone: "",
        password: "",
        location: "",
        categoryId: "",
        categoryDescription: "",
    });
    const [step, setStep] = useState(1);
    const [categoryTemplates, setCategoryTemplates] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Location options
    const locationOptions = [
        "Pan India",
        "Delhi NCR",
        "Mumbai",
        "Bangalore",
        "Chennai",
        "Kolkata",
        "Hyderabad",
        "Pune",
        "Ahmedabad",
        "Jaipur",
        "Lucknow",
        "Noida",
        "Gurugram",
        "North India",
        "South India",
        "West India",
        "East India",
    ];

    // Fetch category templates
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/categories/templates");
                if (res.ok) {
                    const data = await res.json();
                    setCategoryTemplates(data.categories || []);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoadingCategories(false);
            }
        }
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/supplier/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "register",
                    companyName: formData.companyName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    location: formData.location,
                    categoryId: formData.categoryId,
                    categoryDescription: formData.categoryDescription,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect to verification/KYC page after registration
                window.location.href = "/supplier/verify";
            } else {
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "14px",
        boxSizing: "border-box",
        color: "#0f172a",
        backgroundColor: "white"
    };

    const labelStyle = {
        display: "block",
        fontSize: "14px",
        fontWeight: "500",
        color: "#0f172a",
        marginBottom: "6px"
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#f8fafc",
            fontFamily: "'Inter', system-ui, sans-serif"
        }}>
            {/* Header */}
            <header style={{ padding: "20px 24px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link href="/supplier" style={{ fontWeight: "bold", fontSize: "20px", color: "#0f172a", textDecoration: "none" }}>
                        Chidiya<span style={{ color: "#3b82f6" }}>AI</span>
                    </Link>
                    <Link href="/supplier/login" style={{ fontSize: "14px", color: "#64748b", textDecoration: "none" }}>
                        Already registered? Sign in
                    </Link>
                </div>
            </header>

            {/* Progress */}
            <div style={{ backgroundColor: "#e2e8f0", height: "4px" }}>
                <div style={{ width: `${(step / 2) * 100}%`, height: "100%", backgroundColor: "#3b82f6", transition: "width 0.3s" }} />
            </div>

            {/* Form */}
            <main style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#0f172a", marginBottom: "8px" }}>
                        Become a Supplier at ChidiyaAI
                    </h1>
                    <p style={{ color: "#64748b" }}>Step {step} of 2</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px", textAlign: "center", padding: "12px", backgroundColor: "#fef2f2", borderRadius: "8px" }}>
                            {error}
                        </div>
                    )}

                    {/* Step 1: Account Information */}
                    {step === 1 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div>
                                <label style={labelStyle}>Company Name *</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your Company Pvt. Ltd."
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Business Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="contact@yourcompany.com"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+91 98765 43210"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    minLength={6}
                                    style={inputStyle}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={!formData.companyName || !formData.email || !formData.phone || !formData.password}
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    backgroundColor: formData.companyName && formData.email && formData.phone && formData.password ? "#0f172a" : "#e2e8f0",
                                    color: formData.companyName && formData.email && formData.phone && formData.password ? "white" : "#94a3b8",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    cursor: formData.companyName && formData.email && formData.phone && formData.password ? "pointer" : "not-allowed",
                                    marginTop: "10px"
                                }}
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {/* Step 2: Business Information (Simplified) */}
                    {step === 2 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div>
                                <label style={labelStyle}>Business Location *</label>
                                <select
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    style={{ ...inputStyle, cursor: "pointer" }}
                                >
                                    <option value="">Select your location</option>
                                    {locationOptions.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                                    Where is your business primarily located?
                                </p>
                            </div>

                            <div>
                                <label style={labelStyle}>Primary Product Category *</label>
                                {loadingCategories ? (
                                    <div style={{ padding: "12px", color: "#64748b", textAlign: "center" }}>
                                        Loading categories...
                                    </div>
                                ) : (
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        required
                                        style={{ ...inputStyle, cursor: "pointer" }}
                                    >
                                        <option value="">Select your category</option>
                                        {categoryTemplates.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                                    You can add more categories after registration
                                </p>
                            </div>

                            <div>
                                <label style={labelStyle}>About Your Products *</label>
                                <textarea
                                    name="categoryDescription"
                                    value={formData.categoryDescription}
                                    onChange={handleChange}
                                    required
                                    placeholder="Briefly describe your products (e.g., We manufacture 3-ply corrugated boxes for e-commerce packaging with custom printing options...)"
                                    rows={4}
                                    style={{ ...inputStyle, resize: "vertical" }}
                                />
                                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                                    Help buyers understand what you offer
                                </p>
                            </div>

                            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    style={{
                                        flex: 1,
                                        padding: "14px",
                                        backgroundColor: "white",
                                        color: "#0f172a",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        fontWeight: "600",
                                        cursor: "pointer"
                                    }}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !formData.location || !formData.categoryId || !formData.categoryDescription}
                                    style={{
                                        flex: 2,
                                        padding: "14px",
                                        backgroundColor: formData.location && formData.categoryId && formData.categoryDescription ? "#3b82f6" : "#e2e8f0",
                                        color: formData.location && formData.categoryId && formData.categoryDescription ? "white" : "#94a3b8",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontWeight: "600",
                                        cursor: formData.location && formData.categoryId && formData.categoryDescription ? "pointer" : "not-allowed"
                                    }}
                                >
                                    {loading ? "Creating Account..." : "Complete Registration"}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Info Box */}
                <div style={{
                    marginTop: "32px",
                    padding: "16px",
                    backgroundColor: "#f0f9ff",
                    borderRadius: "8px",
                    border: "1px solid #bae6fd"
                }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0369a1", marginBottom: "8px" }}>
                        What happens next?
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#0c4a6e", lineHeight: "1.6" }}>
                        <li>Verify your email with OTP</li>
                        <li>Complete KYC verification</li>
                        <li>Admin reviews your profile</li>
                        <li>Start adding products once approved!</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
