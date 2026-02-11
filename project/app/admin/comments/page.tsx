import { getAllCommentsForAdmin, approveComment, deleteComment } from '@/app/actions/comments';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function CommentsAdminPage() {
    const comments = await getAllCommentsForAdmin();

    return (
        <div className="space-y-10 animate-fade-in-up pb-20">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Comments</h1>
                <p className="text-slate-500 mt-2 font-medium">Manage reader feedback and engage with your audience.</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User Identity</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Content</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Context (Post)</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {comments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-24 text-center">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">No signals detected yet</p>
                                    </td>
                                </tr>
                            ) : (
                                comments.map((comment) => (
                                    <tr key={comment.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 text-xs font-black mr-4 shadow-inner">
                                                    {(comment.user.name || comment.user.email).charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-base font-black text-slate-900 truncate">{comment.user.name || 'Anonymous'}</p>
                                                    <p className="text-[10px] text-slate-400 truncate uppercase tracking-tighter">{comment.user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <p className="text-sm text-slate-600 font-medium line-clamp-2 max-w-sm leading-relaxed">
                                                {comment.content}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-8">
                                            <Link
                                                href={`/blog/${comment.post.slug}`}
                                                className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors truncate block max-w-[150px] uppercase tracking-widest"
                                            >
                                                {comment.post.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${comment.approved
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                }`}>
                                                {comment.approved ? 'Live' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!comment.approved && (
                                                    <form action={async () => {
                                                        'use server';
                                                        await approveComment(comment.id);
                                                    }}>
                                                        <button
                                                            type="submit"
                                                            className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                                                            title="Approve"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </button>
                                                    </form>
                                                )}
                                                <form action={async () => {
                                                    'use server';
                                                    await deleteComment(comment.id);
                                                }}>
                                                    <button
                                                        type="submit"
                                                        className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all active:scale-95"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
