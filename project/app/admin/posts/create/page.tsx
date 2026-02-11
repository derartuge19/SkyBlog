'use client';

import { createPost } from '@/app/actions/posts';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Globe, MousePointer2, Settings2, Image as ImageIcon } from 'lucide-react';

export default function CreatePostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            await createPost(formData);
            router.push('/admin/posts');
            router.refresh();
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
            {/* Page Header */}
            <div className="flex items-center gap-6">
                <Link
                    href="/admin/posts"
                    className="p-3 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all active:scale-95"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Create Insight</h1>
                    <p className="text-slate-500 mt-2 font-medium">Engineer a new technical discourse Piece</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Main Content Segment */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-10 shadow-2xl shadow-slate-200/50">
                    <div className="flex items-center gap-3 mb-2 text-blue-600">
                        <Settings2 className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Core Information</span>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label htmlFor="title" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                Article Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                placeholder="e.g., The Future of Edge Computing"
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-300 text-2xl font-black tracking-tight"
                            />
                        </div>

                        <div>
                            <label htmlFor="excerpt" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                Executive Summary
                            </label>
                            <textarea
                                name="excerpt"
                                id="excerpt"
                                rows={2}
                                placeholder="Provide a high-level summary..."
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-300 resize-none font-medium leading-relaxed"
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                Technical content
                            </label>
                            <textarea
                                name="content"
                                id="content"
                                rows={15}
                                required
                                placeholder="Unfold the technical depth here..."
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-300 font-mono text-sm leading-relaxed resize-y shadow-inner"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div>
                                <label htmlFor="imageUrl" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                    <span className="flex items-center gap-2">
                                        <ImageIcon className="w-3 h-3" />
                                        Featured Asset (URL)
                                    </span>
                                </label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    id="imageUrl"
                                    placeholder="https://cdn.skykin.com/assets/img.jpg"
                                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
                                />
                            </div>
                            <div className="flex items-end pb-5">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="published"
                                            id="published"
                                            value="true"
                                            className="sr-only peer"
                                        />
                                        <div className="w-16 h-8 bg-slate-100 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300 border border-slate-200"></div>
                                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full peer-checked:translate-x-8 transition-transform duration-300 shadow-sm"></div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">Live Deployment</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Growth Segment (SEO) */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-10 shadow-2xl shadow-slate-200/50">
                    <div className="flex items-center gap-3 mb-2 text-emerald-600">
                        <Globe className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Growth Vector (SEO Meta Data)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <label htmlFor="metaTitle" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                Meta Search Title
                            </label>
                            <input
                                type="text"
                                name="metaTitle"
                                id="metaTitle"
                                placeholder="Optimized title for search crawlers..."
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-300 text-sm font-black"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="metaDescription" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                Search Description
                            </label>
                            <textarea
                                name="metaDescription"
                                id="metaDescription"
                                rows={2}
                                placeholder="High-intent summary for SERP results..."
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-300 resize-none text-sm font-medium leading-relaxed"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="keywords" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                Analytical Keywords
                            </label>
                            <input
                                type="text"
                                name="keywords"
                                id="keywords"
                                placeholder="AI, SaaS, Engineering, Cloud (Comma separated)"
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Conversion Segment (CTA) */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-10 shadow-2xl shadow-slate-200/50">
                    <div className="flex items-center gap-3 mb-2 text-amber-600">
                        <MousePointer2 className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Conversion Vector (CTA)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="ctaText" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                Action Label (CTA Button)
                            </label>
                            <input
                                type="text"
                                name="ctaText"
                                id="ctaText"
                                placeholder="e.g., Discuss Your Project"
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-300 text-sm font-black uppercase tracking-widest"
                            />
                        </div>

                        <div>
                            <label htmlFor="ctaLink" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                Destination URL
                            </label>
                            <input
                                type="text"
                                name="ctaLink"
                                id="ctaLink"
                                placeholder="/contact or external link"
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-5 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Submission Segment */}
                <div className="flex justify-end gap-6 pt-10">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-10 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all active:scale-95"
                    >
                        Abort
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-12 py-5 text-xs font-black uppercase tracking-[0.2em] text-white bg-blue-600 rounded-2xl hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/40 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Orchestrating...
                            </span>
                        ) : (
                            'Execute Deployment'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
