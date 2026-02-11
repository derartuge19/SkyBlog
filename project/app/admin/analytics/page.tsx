import { getAnalyticsData } from '@/app/actions/posts';
import { BarChart3, TrendingUp, Users, Clock, Eye, ArrowUpRight, MessageSquare, Heart } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const data = await getAnalyticsData();
    const posts = (data.posts as any[]) || [];
    const totalViews = data.totalViews || 0;
    const viewsLast30Days = (data as any).viewsLast30Days || 0;
    const viewsPrev30Days = (data as any).viewsPrev30Days || 0;
    const totalEngagement = (data as any).totalEngagement || 0;
    const viewsOverTime = (data.viewsOverTime as any[]) || [];

    // Calculate growth
    const growth = viewsPrev30Days === 0 ? 100 : Math.round(((viewsLast30Days - viewsPrev30Days) / viewsPrev30Days) * 100);

    // Process views over time (group by day for the last 30 days)
    const viewsByDay = new Array(30).fill(0);
    const now = new Date();

    viewsOverTime.forEach(view => {
        const viewDate = new Date(view.createdAt);
        const dayDiff = Math.floor((now.getTime() - viewDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff >= 0 && dayDiff < 30) {
            viewsByDay[29 - dayDiff]++;
        }
    });

    const maxViews = Math.max(...viewsByDay, 1);

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in-up pb-24">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Insights Dashboard</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Performance Matrix</h1>
                    <p className="text-slate-500 font-medium text-lg">Predictive and historical analysis of your digital footprint.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest border border-slate-100">
                        <Clock className="w-4 h-4 text-blue-500" />
                        30 Day Retention Cycle
                    </div>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="group bg-white border border-slate-100 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-blue-500/10 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-5 bg-blue-50 rounded-3xl text-blue-600 group-hover:rotate-12 transition-transform">
                                <Eye className="w-8 h-8" />
                            </div>
                            <span className={`flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border ${growth >= 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'
                                }`}>
                                <TrendingUp className={`w-3.5 h-3.5 ${growth < 0 ? 'rotate-180' : ''}`} />
                                {growth >= 0 ? '+' : ''}{growth}%
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Aggregate Reach</p>
                        <div className="flex items-baseline gap-3">
                            <p className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">{totalViews.toLocaleString()}</p>
                            <span className="text-slate-400 font-bold text-sm">Impressions</span>
                        </div>
                    </div>
                </div>

                <div className="group bg-white border border-slate-100 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-purple-500/10 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/30 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-5 bg-purple-50 rounded-3xl text-purple-600 group-hover:rotate-12 transition-transform">
                                <BarChart3 className="w-8 h-8" />
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Density Index</p>
                        <div className="flex items-baseline gap-3">
                            <p className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">
                                {posts.length > 0 ? Math.round(totalViews / posts.length) : 0}
                            </p>
                            <span className="text-slate-400 font-bold text-sm">Avg / Piece</span>
                        </div>
                    </div>
                </div>

                <div className="group bg-white border border-slate-100 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-amber-500/10 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/30 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-5 bg-amber-50 rounded-3xl text-amber-600 group-hover:rotate-12 transition-transform">
                                <Heart className="w-8 h-8" />
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Engagement Index</p>
                        <div className="flex items-baseline gap-3">
                            <p className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">
                                {totalEngagement}
                            </p>
                            <span className="text-slate-400 font-bold text-sm">Real Interactions</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Trend Chart */}
            <div className="bg-white border border-slate-100 rounded-[4rem] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.03)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 opacity-20"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 relative z-10">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Engagement Velocity</h2>
                        <p className="text-slate-500 font-medium mt-2">Daily view distribution metrics for the current business cycle.</p>
                    </div>
                    <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600 shadow-lg shadow-blue-500/50 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">View Count</span>
                        </div>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Baseline</span>
                        </div>
                    </div>
                </div>

                <div className="h-80 flex items-end justify-between gap-2 md:gap-4 relative z-10 group/chart">
                    {viewsByDay.map((count, i) => {
                        const height = (count / maxViews) * 100;
                        return (
                            <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-3xl transition-all duration-[1.5s] ease-out hover:from-blue-400 hover:to-purple-500 hover:scale-x-110 group relative border border-transparent shadow-lg shadow-blue-500/20"
                                style={{ height: `${Math.max(height, 6)}%` }}
                            >
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] font-black text-white px-4 py-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap shadow-[0_20px_40px_rgba(0,0,0,0.3)] z-50 pointer-events-none">
                                    {count} Interaction Points
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-12 pt-10 border-t border-slate-100/60 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] relative z-10">
                    <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Start of Cycle</span>
                    <span className="text-slate-100 font-bold overflow-hidden select-none">────────────────────────────────────────────────────────────────────────</span>
                    <span className="text-blue-600">Present Analysis Day</span>
                </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-white border border-slate-100 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-12 py-12 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Top Performance Piece</h2>
                        <p className="text-slate-500 font-medium text-sm mt-1">Leading content ranked by audience retention and engagement.</p>
                    </div>
                </div>
                <div className="divide-y divide-slate-50">
                    {posts.length === 0 ? (
                        <div className="px-12 py-32 text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                <BarChart3 className="w-10 h-10 text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-black text-sm tracking-[0.3em] uppercase">No metrics available</p>
                        </div>
                    ) : (
                        posts.map((post: any, idx) => (
                            <div key={post.id} className="px-12 py-9 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50 transition-all group cursor-default gap-6">
                                <div className="flex items-center gap-10 min-w-0">
                                    <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center font-black text-2xl transition-all flex-shrink-0 ${idx === 0 ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 rotate-3' : 'bg-white border border-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="min-w-0 space-y-1">
                                        <h3 className="text-2xl font-black text-slate-900 truncate tracking-tight group-hover:text-blue-600 transition-all duration-300">
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                                                ID: {post.id.slice(0, 8)}
                                            </p>
                                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                            <p className="text-xs text-slate-500 font-medium italic">
                                                Registered {new Date(post.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12 self-end md:self-center">
                                    <div className="text-right">
                                        <div className="flex items-center gap-3 justify-end mb-1">
                                            <p className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{post._count?.views || 0}</p>
                                            <div className="p-2 bg-emerald-50 rounded-xl">
                                                <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Captured Reach</p>
                                    </div>
                                    <button className="p-5 bg-white border border-slate-100 rounded-3xl text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all hidden lg:block">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
