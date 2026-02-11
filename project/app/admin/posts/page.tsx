import { getPosts, deletePost, togglePublish } from '@/app/actions/posts';
import Link from 'next/link';

export default async function PostsPage() {
    const posts = await getPosts();

    return (
        <div className="space-y-10 animate-fade-in-up pb-20">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Posts</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage and curate your repository of digital insights.</p>
                </div>
                <Link
                    href="/admin/posts/create"
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
                </Link>
            </div>

            {/* Posts List */}
            {posts.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] px-10 py-32 text-center shadow-2xl shadow-slate-200/50">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No posts yet</h3>
                    <p className="text-slate-500 mb-10 font-medium">Get started by creating your first technical insight.</p>
                    <Link
                        href="/admin/posts/create"
                        className="inline-flex items-center px-10 py-5 bg-white border-2 border-slate-900 text-slate-900 text-xs font-black uppercase tracking-widest rounded-full hover:bg-slate-900 hover:text-white transition-all shadow-lg active:scale-95"
                    >
                        Create Your First Post
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                    <div className="divide-y divide-slate-50">
                        {posts.map((post) => (
                            <div key={post.id} className="px-10 py-8 hover:bg-slate-50/50 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-4 mb-3">
                                            <h3 className="text-xl font-black text-slate-900 truncate tracking-tight">
                                                {post.title}
                                            </h3>
                                            <span
                                                className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full flex-shrink-0 ${post.published
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                    }`}
                                            >
                                                {post.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        {post.excerpt && (
                                            <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-medium leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-lg bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500">
                                                    {((post.author as any).name || (post.author as any).email).charAt(0).toUpperCase()}
                                                </div>
                                                {(post.author as any).name || (post.author as any).email}
                                            </span>
                                            <span>•</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <form action={togglePublish.bind(null, post.id)}>
                                            <button
                                                type="submit"
                                                className={`inline-flex items-center px-5 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all active:scale-95 ${post.published
                                                    ? 'text-amber-600 border-amber-100 bg-amber-50 hover:bg-amber-100'
                                                    : 'text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100'
                                                    }`}
                                                title={post.published ? 'Unpublish' : 'Publish'}
                                            >
                                                {post.published ? 'Draft' : 'Publish'}
                                            </button>
                                        </form>
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="inline-flex items-center px-5 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl text-blue-600 border border-blue-100 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                                        >
                                            Edit
                                        </Link>
                                        <form action={deletePost.bind(null, post.id)}>
                                            <button
                                                type="submit"
                                                className="inline-flex items-center px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all active:scale-95"
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
