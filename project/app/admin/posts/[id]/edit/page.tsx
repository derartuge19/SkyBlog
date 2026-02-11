import { getPostById } from '@/app/actions/posts';
import { notFound } from 'next/navigation';
import EditPostForm from './EditPostForm';
import Link from 'next/link';

export default async function EditPostPage({
    params,
}: {
    params: { id: string };
}) {
    const post = await getPostById(params.id);

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up">
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
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Edit Insight</h1>
                    <p className="text-slate-500 mt-2 font-medium">Update and refine your technical discourse.</p>
                </div>
            </div>
            <EditPostForm post={post as any} />
        </div>
    );
}
