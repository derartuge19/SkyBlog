import { MainNav } from '@/components/MainNav';
import { COMPANY_INFO } from '@/lib/constants';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-600">
            <MainNav />

            <section className="relative pt-40 pb-32 overflow-hidden bg-slate-50/50">
                <div className="absolute inset-0 z-0">
                    <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[140px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter text-slate-900 leading-tight">
                            Let's <span className="text-blue-600">Connect.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-bold">
                            Have a project in mind or want to learn more about our transformative digital solutions? We're here to help.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-20 items-start">
                        {/* Contact Info */}
                        <div className="space-y-12">
                            <div className="p-8 md:p-10 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 relative group overflow-hidden transition-all duration-300 hover:shadow-blue-100/50 hover:-translate-y-1">
                                <h3 className="text-2xl font-black mb-10 tracking-tight">Contact Information</h3>

                                <div className="space-y-10">
                                    <div className="flex items-start space-x-8 group">
                                        <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Us</p>
                                            <p className="text-xl font-bold text-slate-900">{COMPANY_INFO.contact.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-8 group">
                                        <div className="w-16 h-16 rounded-3xl bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform shadow-sm">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Call Us</p>
                                            <p className="text-xl font-bold text-slate-900">{COMPANY_INFO.contact.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-8 group">
                                        <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shadow-sm">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Our Location</p>
                                            <p className="text-xl font-bold text-slate-900">{COMPANY_INFO.contact.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 rounded-[3.5rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/10 relative overflow-hidden group">
                                <div className="relative z-10 text-center">
                                    <h4 className="text-xs font-black mb-3 uppercase tracking-[0.3em] text-blue-400">Availability</h4>
                                    <p className="text-2xl font-black">Mon - Fri: 9AM - 6PM</p>
                                </div>
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                                    <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white border border-slate-100 p-8 md:p-12 rounded-3xl shadow-2xl shadow-slate-200/50">
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Jane Doe"
                                            className="w-full bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-2xl px-8 py-5 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-8 focus:ring-blue-500/5 transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="jane@example.com"
                                            className="w-full bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-2xl px-8 py-5 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-8 focus:ring-blue-500/5 transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Subject</label>
                                    <select className="w-full bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-2xl px-8 py-5 text-slate-900 focus:outline-none focus:ring-8 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer font-bold">
                                        <option>General Inquiry</option>
                                        <option>Custom Software</option>
                                        <option>Digital Transformation</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Message</label>
                                    <textarea
                                        rows={6}
                                        placeholder="Tell us about your project..."
                                        className="w-full bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-[2rem] px-8 py-6 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-8 focus:ring-blue-500/5 transition-all resize-none font-bold"
                                    ></textarea>
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-500/30 active:scale-95 transition-all uppercase tracking-widest text-xs">
                                    Send Message
                                </button>
                            </form>
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
