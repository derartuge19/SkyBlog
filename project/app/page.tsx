
import { getPosts, getCategories } from '@/app/actions/posts';
import { getGlobalSettings } from '@/app/actions/settings';
import Link from 'next/link';
import Image from 'next/image';
import { MainNav } from '@/components/MainNav';
import { COMPANY_INFO } from '@/lib/constants';

// --- Type Definitions ---
// These interfaces explicitly define the shape of the data we expect.
// We use these to cast the results from the server actions, ensuring
// TypeScript knows exactly what properties are available.

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface Author {
  name?: string | null;
  email?: string | null;
  bio?: string | null;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  createdAt: Date | string;
  author: Author;
  categories: Category[];
  _count?: {
    views?: number;
    likes?: number;
    comments?: number;
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  // Safely access properties from searchParams
  const categorySlug = searchParams?.category;
  const searchQuery = searchParams?.search;

  // Fetch data in parallel
  const [postsRaw, categoriesRaw, settings] = await Promise.all([
    getPosts({
      published: true,
      category: categorySlug,
      search: searchQuery,
    }),
    getCategories(),
    getGlobalSettings(),
  ]);

  // --- Strict Type Casting ---
  // We cast to unknown first, then to our strict interfaces.
  // This bypasses any inferred union types (like PostView) that might be causing confusion.
  const posts = (postsRaw as unknown) as Post[];
  const categories = (categoriesRaw as unknown) as Category[];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-600">
      <MainNav />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-slate-50/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-50 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              SkyKin Technologies
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
            {COMPANY_INFO.name}
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {COMPANY_INFO.slogan}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12">
            {COMPANY_INFO.description}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16 px-4">
            <form action="/" className="relative group">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search solutions, insights, or updates..."
                className="w-full bg-white border border-slate-200 hover:border-blue-400 focus:border-blue-500 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 shadow-lg shadow-slate-200/50 placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-4 rounded-2xl transition-all shadow-lg shadow-blue-500/30 active:scale-95 hover:bg-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories & Filter */}
      <div className="sticky top-20 z-30 bg-white/95 border-y border-slate-100 py-6 px-4 overflow-x-auto no-scrollbar backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3">
          <Link
            href="/"
            className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${!categorySlug
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
          >
            All Insights
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.slug}${searchQuery ? `&search=${searchQuery}` : ''}`}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${categorySlug === cat.slug
                ? 'text-white'
                : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
              style={categorySlug === cat.slug ? { backgroundColor: cat.color } : {}}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {posts.length === 0 ? (
          <div className="text-center py-40 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-xl font-bold">No results found matching your search.</p>
            <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block font-bold">
              View all insights
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col h-full bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-blue-200 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] shadow-sm"
              >
                <div className="relative h-72 w-full bg-slate-100 overflow-hidden">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-200">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Category Badge - Safely Rendered */}
                  <div className="absolute top-6 left-6">
                    {post.categories && post.categories.length > 0 && (
                      <span
                        className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl"
                        style={{ backgroundColor: post.categories[0].color || '#3b82f6' }}
                      >
                        {post.categories[0].name || 'Uncategorized'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-10 flex flex-col flex-1">
                  <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span className="text-blue-500">
                      {Math.ceil((post.content?.length || 0) / 1000)} min read
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-slate-500 text-base mb-8 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 shadow-inner">
                        {(post.author?.name || post.author?.email || 'S')
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {post.author?.name || 'Team SkyKin'}
                      </span>
                    </div>

                    <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-20">
            <div className="max-w-2xl">
              <Link href="/" className="inline-flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                  {COMPANY_INFO.name}
                </span>
              </Link>
              <p className="text-slate-500 text-lg leading-relaxed">
                {COMPANY_INFO.description}
              </p>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-200 text-center">
            <p className="text-slate-400 text-sm font-medium">
              &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. Crafted with technical excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}