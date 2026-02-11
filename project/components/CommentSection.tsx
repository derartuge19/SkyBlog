'use client';

import { useState } from 'react';
import { createComment } from '@/app/actions/comments';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface CommentSectionProps {
    postId: string;
    initialComments: any[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
    const { data: session } = useSession();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        setMessage(null);

        try {
            await createComment(postId, content);
            setContent('');
            setMessage({
                type: 'success',
                text: 'Your comment has been submitted and is awaiting approval.'
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Failed to submit comment. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-20 pt-16 border-t border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Discussion ({initialComments.length})</h3>

            {/* Comment Form */}
            <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 mb-16 shadow-inner shadow-slate-100/50">
                {!session ? (
                    <div className="text-center py-6">
                        <p className="text-slate-500 mb-6 font-bold text-sm">You must be signed in to join the conversation.</p>
                        <Link
                            href="/skyadmin/login"
                            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                        >
                            Sign In to Comment
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-blue-500/10">
                                {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-black text-slate-900 uppercase tracking-wider">{session.user?.name || 'Contributor'}</span>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your technical insights or feedback..."
                            rows={4}
                            className="w-full bg-white border border-slate-100 rounded-3xl px-6 py-4 text-slate-700 outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-blue-200 transition-all text-sm resize-none placeholder:text-slate-300 shadow-sm"
                            required
                        />
                        {message && (
                            <div className={`p-5 rounded-2xl text-xs font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                {message.text}
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting || !content.trim()}
                                className="px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-500/30 active:scale-95"
                            >
                                {isSubmitting ? 'Syndicating...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-12">
                {initialComments.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest italic">No comments yet. Start the discourse.</p>
                    </div>
                ) : (
                    initialComments.map((comment) => (
                        <div key={comment.id} className="flex space-x-6 group">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 uppercase shadow-sm group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                                    {(comment.user.name || comment.user.email).charAt(0)}
                                </div>
                            </div>
                            <div className="flex-1 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group-hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{comment.user.name || 'Anonymous Intelligence'}</h4>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
