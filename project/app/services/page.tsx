import { MainNav } from '@/components/MainNav';
import { COMPANY_INFO } from '@/lib/constants';
import Link from 'next/link';

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-600">
            <MainNav />

            {/* Header */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-slate-50/50">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-50 rounded-full blur-[140px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-8">
                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Our Expertise</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-slate-900 leading-none">
                        Digital <span className="text-blue-600">Solutions.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-bold">
                        Leading the next era of industrial transformation with intelligent software and scalable infrastructure.
                    </p>
                </div>
            </section>

            {/* Solutions Grid */}
            <section className="py-32 relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {COMPANY_INFO.solutions.map((solution) => (
                            <div
                                key={solution.id}
                                className="group p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-blue-200 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] shadow-sm"
                            >
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                    <span className="text-2xl font-black text-white">{solution.id}</span>
                                </div>
                                <h3 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {solution.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed font-medium group-hover:text-slate-600 transition-colors text-lg">
                                    {solution.description}
                                </p>
                                <div className="mt-10 pt-8 border-t border-slate-50">
                                    <Link href="/contact" className="inline-flex items-center text-sm font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">
                                        Learn more
                                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industrial Transformation Section - Bright Editorial Look */}
            <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1 lg:max-w-xl">
                            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
                                Driving <span className="text-blue-400">Industrial</span> Transformation.
                            </h2>
                            <div className="space-y-8">
                                <p className="text-xl text-slate-400 leading-relaxed font-medium">
                                    We bridge the gap between global innovation and local industry needs, driving efficiency and enhancing connectivity across critical sectors.
                                </p>
                                <ul className="space-y-6">
                                    {['Custom Architectures', 'Strategic Global Partnerships', 'Scalable Cloud Solutions', 'Intelligent Edge Metrics'].map((item, i) => (
                                        <li key={i} className="flex items-center space-x-4 text-slate-100 font-bold text-lg">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="flex-1 w-full aspect-square lg:aspect-video relative rounded-[4rem] overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 group">
                            <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-3xl group-hover:bg-blue-600/20 transition-all duration-700" />
                            <div className="absolute inset-0 flex items-center justify-center p-16">
                                <div className="grid grid-cols-2 gap-6 w-full opacity-40">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-32 md:h-40 rounded-3xl bg-slate-800 border border-slate-700 animate-pulse-slow" style={{ animationDelay: `${i * 0.5}s` }}>
                                            <div className="w-1/2 h-2 bg-slate-700 rounded-full m-8" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-slate-100 text-center bg-white">
                <p className="text-slate-400 text-sm font-bold">
                    &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
