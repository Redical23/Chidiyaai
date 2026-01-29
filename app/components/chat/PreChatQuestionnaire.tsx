"use client";

import { useState } from "react";

interface UserRequirements {
    location: string;
    category: string;
    quantity: string;
    budget: string;
}

interface PreChatQuestionnaireProps {
    onComplete: (requirements: UserRequirements) => void;
}

const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
    "Noida", "Gurgaon", "Surat", "Indore", "Coimbatore"
];

const categories = [
    "Packaging", "Textiles", "Electronics", "Chemicals",
    "Industrial Equipment", "Furniture", "Food & Beverages",
    "Automotive Parts", "Construction Materials", "Medical Supplies"
];

const quantities = [
    "Less than 100 units",
    "100 - 500 units",
    "500 - 1000 units",
    "1000 - 5000 units",
    "5000+ units",
    "Bulk/Wholesale"
];

const budgets = [
    "Under ₹50,000",
    "₹50,000 - ₹1 Lakh",
    "₹1 Lakh - ₹5 Lakh",
    "₹5 Lakh - ₹10 Lakh",
    "₹10 Lakh+",
    "Flexible"
];

export default function PreChatQuestionnaire({ onComplete }: PreChatQuestionnaireProps) {
    const [step, setStep] = useState(0);
    const [requirements, setRequirements] = useState<UserRequirements>({
        location: "",
        category: "",
        quantity: "",
        budget: "",
    });

    const steps = [
        {
            title: "Where are you looking for suppliers?",
            subtitle: "Select your preferred city",
            field: "location" as const,
            options: cities,
            icon: "📍",
        },
        {
            title: "What product category?",
            subtitle: "Select the type of products you need",
            field: "category" as const,
            options: categories,
            icon: "📦",
        },
        {
            title: "Expected quantity?",
            subtitle: "Approximate order size",
            field: "quantity" as const,
            options: quantities,
            icon: "📊",
        },
        {
            title: "What's your budget?",
            subtitle: "Expected investment range",
            field: "budget" as const,
            options: budgets,
            icon: "💰",
        },
    ];

    const handleSelect = (value: string) => {
        setRequirements({ ...requirements, [steps[step].field]: value });
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete({ ...requirements, [steps[step].field]: value });
        }
    };

    const handleSkip = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete(requirements);
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const currentStep = steps[step];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden"
                style={{
                    animation: "fadeInUp 0.4s ease-out",
                }}
            >
                {/* Progress bar */}
                <div className="h-1 bg-slate-800">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                    />
                </div>

                {/* Header */}
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{currentStep.icon}</span>
                        <div>
                            <h2 className="text-xl font-semibold text-white">{currentStep.title}</h2>
                            <p className="text-slate-400 text-sm">{currentStep.subtitle}</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-xs mt-2">
                        Step {step + 1} of {steps.length} • Press Skip if not sure
                    </p>
                </div>

                {/* Options */}
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3">
                        {currentStep.options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleSelect(option)}
                                className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] ${requirements[currentStep.field] === option
                                        ? "bg-blue-500/20 border-blue-500 text-blue-400"
                                        : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-slate-800 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={step === 0}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${step === 0
                                ? "text-slate-600 cursor-not-allowed"
                                : "text-slate-400 hover:text-white"
                            }`}
                    >
                        ← Back
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSkip}
                            className="px-6 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            Skip
                        </button>
                        <button
                            onClick={() => requirements[currentStep.field] && handleSelect(requirements[currentStep.field])}
                            disabled={!requirements[currentStep.field]}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${requirements[currentStep.field]
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                                }`}
                        >
                            {step === steps.length - 1 ? "Start Chat" : "Next →"}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
