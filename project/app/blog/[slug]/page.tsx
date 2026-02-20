import { getPostBySlug } from '@/app/actions/posts';
import { getPostComments } from '@/app/actions/comments';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MainNav } from '@/components/MainNav';
import CommentSection from '@/components/CommentSection';
import ViewTracker from '@/components/ViewTracker';
import LikeButton from '@/components/LikeButton';
import SocialShare from '@/components/SocialShare';

import { Share2, Clock, Eye, MessageSquare, ChevronLeft, ArrowRight, User as UserIcon } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    if (!post) return {};

    const p = post as any;
    return {
        title: p.metaTitle || p.title,
        description: p.metaDescription || p.excerpt,
        keywords: p.keywords,
        openGraph: {
            title: p.metaTitle || p.title,
            description: p.metaDescription || p.excerpt,
            images: [p.imageUrl].filter(Boolean) as string[],
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: { slug: string };
}) {
    const postData = await getPostBySlug(params.slug);

    if (!postData || !postData.published) {
        notFound();
    }

    const post = postData as any;
    const comments = await getPostComments(post.id);

    return (
        <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-600">
            <MainNav />
            <ViewTracker postId={post.id} />

            {/* Hero Header Segment */}
            <div className="relative pt-40 pb-20 overflow-hidden bg-slate-50/50">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[140px]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-all font-black text-[10px] uppercase tracking-[0.2em] mb-12 group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Insights Archive</span>
                    </Link>

                    {post.categories && post.categories[0] && (
                        <div className="mb-8">
                            <span
                                className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-500/10"
                                style={{ backgroundColor: post.categories[0].color }}
                            >
                                {post.categories[0].name}
                            </span>
                        </div>
                    )}

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-10 leading-[1.1] tracking-tighter">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-8 text-sm text-slate-500 border-b border-slate-100 pb-10">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Published</span>
                            <span className="font-black text-slate-900 mt-1">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>

                        <div className="flex items-center space-x-6 shrink-0 pt-4 sm:pt-0">
                            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="font-black text-slate-900 text-[11px] uppercase tracking-wider">{(post._count?.views || 0)} Views</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                                <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <span className="font-black text-slate-900 text-[11px] uppercase tracking-wider">{(post._count?.comments || 0)} Comments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="relative -mt-10 mb-20 group">
                    {post.imageUrl && (
                        <div className="relative h-[25rem] md:h-[40rem] w-full rounded-[3rem] overflow-hidden shadow-2xl border border-white shadow-slate-200">
                            <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover transform group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-40" />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Interaction Sidebar */}
                    <div className="lg:col-span-1 hidden lg:block sticky top-32 h-fit">
                        <div className="flex flex-col space-y-8 items-center">
                            <div className="flex flex-col items-center space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 [writing-mode:vertical-lr] mb-2">React</span>
                                <LikeButton
                                    postId={post.id}
                                    initialLiked={post.isLiked}
                                    initialCount={post._count?.likes || 0}
                                />
                            </div>

                            <div className="flex flex-col items-center space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 [writing-mode:vertical-lr] mb-2">Share</span>
                                <SocialShare title={post.title} slug={post.slug} />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-11 max-w-none">
                        {post.excerpt && (
                            <div className="bg-slate-50 border-l-8 border-blue-600 p-10 rounded-r-[2.5rem] mb-16 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14H15.017C13.9124 14 13.017 13.1046 13.017 12V6C13.017 4.89543 13.9124 4 15.017 4H21.017C22.1216 4 23.017 4.89543 23.017 6V12C23.017 14.3901 22.0435 16.5512 20.4776 18.1171L18.4142 20.1805L17 18.7663L18.7663 17H16.017C15.4647 17 15.017 17.4477 15.017 18V21H14.017ZM1.017 21L1.017 18C1.017 16.8954 1.91243 16 3.017 16H6.017V14H2.017C0.912431 14 0.017 13.1046 0.017 12V6C0.017 4.89543 0.912431 4 2.017 4H8.017C9.12157 4 10.017 4.89543 10.017 6V12C10.017 14.3901 9.0435 16.5512 7.47761 18.1171L5.41421 20.1805L4 18.7663L5.76631 17H3.017C2.46472 17 2.017 17.4477 2.017 18V21H1.017Z" /></svg>
                                </div>
                                <p className="text-xl md:text-3xl text-slate-800 italic font-black leading-tight relative z-10">
                                    &ldquo;{post.excerpt}&rdquo;
                                </p>
                            </div>
                        )}

                        <div className="text-slate-700 leading-[1.8] whitespace-pre-wrap font-medium text-lg md:text-xl selection:bg-blue-100">
                            {post.content}
                        </div>

                        {/* CTA Section (Conversion) */}
                        {post.ctaText && post.ctaLink && (
                            <div className="mt-16 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-2xl shadow-blue-500/30 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                                    <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M13 3l3.293 3.293-7 7 1.414 1.414 7-7L21 11V3h-8z" />
                                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black mb-6 relative z-10 leading-tight">
                                    Take the next step in your <br /> digital transformation.
                                </h3>
                                <Link
                                    href={post.ctaLink}
                                    className="inline-flex items-center px-10 py-4 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-xl active:scale-95 relative z-10"
                                >
                                    {post.ctaText}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </div>
                        )}

                        {/* Author Bio (Trust) */}
                        {post.author?.bio && (
                            <div className="mt-20 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8">
                                <div className="w-24 h-24 shrink-0 bg-blue-100 rounded-[2rem] flex items-center justify-center text-blue-600 font-black text-3xl shadow-lg border-4 border-white">
                                    {(post.author?.name || post.author?.email || 'A').charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 mb-2">{post.author?.name || post.author?.email || 'Admin Expert'}</h4>
                                    <p className="text-slate-500 leading-relaxed font-medium">
                                        {post.author?.bio}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Related Posts (Retention) */}
                        {post.relatedPosts && post.relatedPosts.length > 0 && (
                            <div className="mt-24">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Keep Reading</h3>
                                    <Link href="/" className="text-xs font-black uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1">All Insights</Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {post.relatedPosts.map((rp: any) => (
                                        <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block">
                                            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-all border border-slate-100 bg-slate-100">
                                                {rp.imageUrl ? (
                                                    <Image src={rp.imageUrl} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                                        <UserIcon className="w-8 h-8 opacity-20" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">
                                                    {rp.categories?.[0]?.name || 'Insights'}
                                                </span>
                                                <h4 className="text-md font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                                                    {rp.title || 'Untitled Article'}
                                                </h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mobile Interaction Bar */}
                        <div className="mt-16 lg:hidden flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="flex items-center space-x-4">
                                <LikeButton
                                    postId={post.id}
                                    initialLiked={post.isLiked}
                                    initialCount={post._count?.likes || 0}
                                />
                                <div className="w-[1px] h-8 bg-slate-200 mx-2" />
                                <div className="flex items-center space-x-2">
                                    <SocialShare title={post.title} slug={post.slug} />
                                </div>
                            </div>
                        </div>

                        {/* Tags Section */}
                        {post.categories && post.categories.length > 0 && (
                            <div className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap gap-4 items-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Filed Under</span>
                                {post.categories.map((cat: any) => (
                                    <Link
                                        key={cat.id}
                                        href={`/?category=${cat.slug}`}
                                        className="px-6 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-black text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                    >
                                        #{cat.name?.toUpperCase() || 'TAG'}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Comments Section */}
                        <div className="mt-24">
                            <CommentSection postId={post.id} initialComments={comments} />
                        </div>
                    </div>
                </div>
            </article>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
                        SkyKin Technologies &copy; {new Date().getFullYear()} — Engineering the Future
                    </p>
                </div>
            </footer>
        </div>
    );
}
