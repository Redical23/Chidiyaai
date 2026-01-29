import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white">
            <div className="py-12">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div>
                            <Link href="/" className="flex items-center mb-4">
                                <Image
                                    src="/assests/chidiyaailogo.png"
                                    alt="ChidiyaAI"
                                    width={140}
                                    height={50}
                                    className="h-12 w-auto brightness-0 invert"
                                />
                            </Link>
                            <p className="text-sm text-slate-400">
                                AI-powered B2B sourcing made simple.
                            </p>
                        </div>

                        {/* Product Links */}
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                                <li><Link href="/account/chat" className="hover:text-white">Start Sourcing</Link></li>
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="/about" className="hover:text-white">About</Link></li>
                                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                                <li><Link href="/supplier" className="hover:text-white">For Suppliers</Link></li>
                            </ul>
                        </div>

                        {/* Legal Links */}
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
                                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                                <li><Link href="/terms/buyer" className="hover:text-white">Buyer Terms</Link></li>
                                <li><Link href="/terms/supplier" className="hover:text-white">Supplier Terms</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                        © {new Date().getFullYear()} ChidiyaAI. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Marquee Animation - Continuous Scrolling Text */}
            <div className="bg-black py-4 overflow-hidden">
                <div className="marquee-container">
                    <div className="marquee-content">
                        <span className="text-white font-bold text-4xl md:text-6xl mx-8">ChidiyaAI</span>
                        <span className="text-white font-bold text-4xl md:text-6xl mx-8">ChidiyaAI</span>
                        <span className="text-white font-bold text-4xl md:text-6xl mx-8">ChidiyaAI</span>
                        <span className="text-white font-bold text-4xl md:text-6xl mx-8">ChidiyaAI</span>
                        <span className="text-white font-bold text-4xl md:text-6xl mx-8">ChidiyaAI</span>
                        <span className="text-white font-bold text-4xl md:text-6xl mx-8">ChidiyaAI</span>
                        <span className="text-white font-bold text-4xl md:text-6xl mx-8">ChidiyaAI</span>
                        <span className="text-white font-bold text-4xl md:text-6xl mx-8">ChidiyaAI</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .marquee-container {
                    display: flex;
                    width: 100%;
                }
                .marquee-content {
                    display: flex;
                    animation: marquee 12s linear infinite;
                    white-space: nowrap;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </footer>
    );
}
