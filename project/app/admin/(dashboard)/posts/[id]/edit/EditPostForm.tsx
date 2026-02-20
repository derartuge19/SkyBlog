'use client';

import { updatePost } from '@/app/actions/posts';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Globe, MousePointer2, Settings2, Image as ImageIcon } from 'lucide-react';

interface EditPostFormProps {
    post: {
        id: string;
        title: string;
        content: string;
        excerpt: string | null;
        imageUrl: string | null;
        published: boolean;
        metaTitle?: string | null;
        metaDescription?: string | null;
        keywords?: string | null;
        ctaText?: string | null;
        ctaLink?: string | null;
    };
}

export default function EditPostForm({ post }: EditPostFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(post.imageUrl);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            await updatePost(post.id, formData);
            router.push('/admin/posts');
            router.refresh();
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-32">
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
                            defaultValue={post.title}
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
                            defaultValue={post.excerpt || ''}
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
                            defaultValue={post.content}
                            placeholder="Unfold the technical depth here..."
                            className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-300 font-mono text-sm leading-relaxed resize-y shadow-inner"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div>
                            <label htmlFor="imageUrl" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                <span className="flex items-center gap-2">
                                    <ImageIcon className="w-3 h-3" />
                                    Featured Asset
                                </span>
                            </label>
                            <div className="space-y-4">
                                <input
                                    type="url"
                                    name="imageUrl"
                                    id="imageUrl"
                                    defaultValue={post.imageUrl || ''}
                                    placeholder="External URL (e.g., https://...)"
                                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-8 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
                                />

                                <div className="relative group/upload">
                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="image"
                                        className="flex flex-col items-center justify-center w-full min-h-[140px] px-8 py-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-100/50 hover:border-blue-400/50 transition-all cursor-pointer group-hover/upload:shadow-inner"
                                    >
                                        {imagePreview ? (
                                            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg ring-4 ring-white">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Change Image</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="p-4 rounded-full bg-white shadow-sm mb-3 group-hover/upload:scale-110 transition-transform">
                                                    <ImageIcon className="w-6 h-6 text-slate-400 group-hover/upload:text-blue-500" />
                                                </div>
                                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Upload Local Asset</p>
                                                <p className="text-[10px] text-slate-400 mt-1 font-medium">PNG, JPG, WebP up to 5MB</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end pb-5">
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="published"
                                        id="published"
                                        value="true"
                                        defaultChecked={post.published}
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
                            defaultValue={post.metaTitle || ''}
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
                            defaultValue={post.metaDescription || ''}
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
                            defaultValue={post.keywords || ''}
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
                            defaultValue={post.ctaText || ''}
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
                            defaultValue={post.ctaLink || ''}
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
                    Discard Changes
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
                            Synergizing...
                        </span>
                    ) : (
                        'Save & Deploy'
                    )}
                </button>
            </div>
        </form>
    );
}
