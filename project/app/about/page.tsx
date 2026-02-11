import { MainNav } from '@/components/MainNav';
import { COMPANY_INFO } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-600">
            <MainNav />

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-slate-50/50">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[140px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-slate-900 leading-tight">
                        About <span className="text-blue-600">SkyKin.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        {COMPANY_INFO.description}
                    </p>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 md:p-10 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 relative group overflow-hidden transition-all duration-300 hover:shadow-blue-100/50 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-black mb-6 text-blue-600 tracking-tight">Our Vision</h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-bold italic">
                                "{COMPANY_INFO.vision}"
                            </p>
                        </div>

                        <div className="p-8 md:p-10 rounded-3xl bg-slate-950 text-white shadow-2xl shadow-blue-900/10 relative group overflow-hidden transition-all duration-300 hover:shadow-slate-200/10 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-black mb-6 text-blue-400 tracking-tight">Our Mission</h2>
                            <p className="text-lg text-slate-100 leading-relaxed font-medium">
                                {COMPANY_INFO.mission}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Goals Grid */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black mb-4 tracking-tight text-slate-900">Strategic Goals</h2>
                        <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {COMPANY_INFO.goals.map((goal, index) => (
                            <div key={index} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 group hover:-translate-y-1">
                                <div className="text-blue-600 text-3xl font-black mb-4 opacity-10 group-hover:opacity-100 transition-opacity">0{index + 1}</div>
                                <h3 className="text-lg font-black text-slate-900 leading-tight">{goal}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="py-32">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-blue-600 rounded-[4rem] p-16 md:p-24 text-center shadow-2xl shadow-blue-500/40 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tight leading-none relative z-10">Start your journey <br />with SkyKin.</h2>
                        <Link href="/contact" className="relative z-10 inline-flex items-center px-12 py-6 bg-white text-blue-600 rounded-full text-lg font-black hover:shadow-2xl hover:scale-105 transition-all active:scale-95">
                            Work with us
                            <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 border-t border-slate-100 text-center bg-slate-50">
                <p className="text-slate-400 text-sm font-bold">
                    &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
