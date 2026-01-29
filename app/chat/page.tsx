"use client";

import { useState } from "react";
import Image from "next/image";
import PreChatQuestionnaire from "@/app/components/chat/PreChatQuestionnaire";
import ChatInterface from "@/app/components/chat/ChatInterface";

interface UserRequirements {
    location: string;
    category: string;
    quantity: string;
    budget: string;
}

export default function ChatPage() {
    const [showQuestionnaire, setShowQuestionnaire] = useState(true);
    const [userRequirements, setUserRequirements] = useState<UserRequirements>({
        location: "",
        category: "",
        quantity: "",
        budget: "",
    });

    const handleQuestionnaireComplete = (requirements: UserRequirements) => {
        setUserRequirements(requirements);
        setShowQuestionnaire(false);
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Background gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 h-screen flex flex-col">
                {/* Navbar */}
                <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/assests/chidiyaailogo.png"
                            alt="ChidiyaAI"
                            width={130}
                            height={35}
                            style={{ height: "35px", width: "auto" }}
                            priority
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="/"
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Home
                        </a>
                        <a
                            href="/supplier"
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            For Suppliers
                        </a>
                    </div>
                </nav>

                {/* Chat container */}
                <div className="flex-1 max-w-4xl mx-auto w-full">
                    {showQuestionnaire ? (
                        <div className="h-full flex items-center justify-center p-6">
                            {/* Welcome screen behind questionnaire */}
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden animate-pulse">
                                    <Image
                                        src="/assests/chidiyaaiicon.png"
                                        alt="ChidiyaAI"
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-3">
                                    Welcome to ChidiyaAI
                                </h2>
                                <p className="text-slate-400 max-w-md mx-auto">
                                    Let us help you find the perfect suppliers for your business.
                                    Answer a few quick questions to get started.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border-x border-slate-800/50">
                            <ChatInterface userRequirements={userRequirements} />
                        </div>
                    )}
                </div>
            </div>

            {/* Show questionnaire modal */}
            {showQuestionnaire && (
                <PreChatQuestionnaire onComplete={handleQuestionnaireComplete} />
            )}
        </div>
    );
}
