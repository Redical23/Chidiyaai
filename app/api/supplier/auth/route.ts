import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendSupplierWelcomeEmail, sendOTPEmail, generateOTP } from "../../../../lib/email";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export async function POST(req: Request) {
    try {
        const { action, ...data } = await req.json();

        // Register
        if (action === "register") {
            const {
                companyName,
                email,
                phone,
                password,
                location,
                categoryId,
                categoryDescription,
                // Legacy fields (for backward compatibility)
                productCategories,
                capacity,
                moq,
                serviceLocations,
            } = data;

            console.log("Registration attempt for:", email);

            const existing = await prisma.supplier.findUnique({
                where: { email },
                select: { id: true },
            });

            if (existing) {
                return NextResponse.json(
                    { error: "Supplier already registered" },
                    { status: 400 }
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("Password hashed");

            // Generate OTP for email verification
            const otp = generateOTP();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            console.log("OTP generated");

            // Create supplier with simplified fields
            let supplier;
            try {
                supplier = await prisma.supplier.create({
                    data: {
                        companyName,
                        email,
                        phone,
                        password: hashedPassword,
                        // New simplified field
                        serviceLocations: location || serviceLocations || "",
                        // Legacy fields (for backward compatibility)
                        productCategories: Array.isArray(productCategories) ? productCategories : [],
                        capacity: capacity || null,
                        moq: moq || null,
                        description: categoryDescription || "",
                        status: "pending",
                        emailVerified: false,
                        verificationOTP: otp,
                        otpExpiry
                    },
                    select: {
                        id: true,
                    },
                });
                console.log("Supplier created:", supplier.id);
            } catch (createErr) {
                console.error("Error creating supplier:", createErr);
                return NextResponse.json(
                    { error: "Failed to create supplier account" },
                    { status: 500 }
                );
            }

            // If a category was selected, create a SupplierCategory record
            if (categoryId) {
                try {
                    await prisma.supplierCategory.create({
                        data: {
                            supplierId: supplier.id,
                            categoryTemplateId: categoryId,
                            customDescription: categoryDescription || "",
                            status: "approved",
                            isPrimary: true,
                        }
                    });
                    console.log("SupplierCategory created");
                } catch (catError) {
                    console.error("Error creating supplier category:", catError);
                }
            }

            // Send emails (non-blocking)
            sendOTPEmail(email, otp, companyName).catch(e => console.error("OTP Email Error:", e));
            sendSupplierWelcomeEmail(email, companyName).catch(e => console.error("Welcome Email Error:", e));
            console.log("Emails queued");

            const token = jwt.sign(
                { id: supplier.id, type: "supplier" },
                JWT_SECRET,
                { expiresIn: "7d" }
            );
            console.log("Token generated");

            const response = NextResponse.json({
                success: true,
                supplierId: supplier.id,
            });

            response.cookies.delete("auth_token"); // Clear buyer session
            response.cookies.set("supplier_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60,
                path: "/",
            });

            console.log("Registration successful for:", email);
            return response;
        }


        // Login
        // Login
        if (action === "login") {
            const { email, password } = data;

            const supplier = await prisma.supplier.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    status: true,
                },
            });

            if (!supplier || !(await bcrypt.compare(password, supplier.password))) {
                return NextResponse.json(
                    { error: "Invalid credentials" },
                    { status: 401 }
                );
            }

            if (supplier.status !== "approved") {
                return NextResponse.json(
                    { error: "Account not approved yet" },
                    { status: 403 }
                );
            }

            const token = jwt.sign(
                { id: supplier.id, type: "supplier" },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            const response = NextResponse.json({ success: true });
            response.cookies.delete("auth_token"); // Clear buyer session
            response.cookies.set("supplier_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60,
                path: "/",
            });

            return response;
        }


        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Supplier Auth Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
