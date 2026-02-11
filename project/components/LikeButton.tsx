'use client';

import { useState, useTransition } from 'react';
import { toggleLike } from '@/app/actions/likes';
import { toast } from 'sonner';

interface LikeButtonProps {
    postId: string;
    initialLiked: boolean;
    initialCount: number;
}

export default function LikeButton({ postId, initialLiked, initialCount }: LikeButtonProps) {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [isPending, startTransition] = useTransition();

    const handleLike = async () => {
        // Optimistic update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setCount(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));

        startTransition(async () => {
            try {
                await toggleLike(postId);
            } catch (error: any) {
                // Rollback
                setIsLiked(!newIsLiked);
                setCount(prev => !newIsLiked ? prev + 1 : Math.max(0, prev - 1));
                toast.error(error.message || 'Something went wrong');
            }
        });
    };

    return (
        <button
            onClick={handleLike}
            disabled={isPending}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border transition-all active:scale-95 ${isLiked
                    ? 'bg-red-50 border-red-100 text-red-500 shadow-sm shadow-red-100'
                    : 'bg-white border-slate-100 text-slate-400 hover:text-red-400 hover:border-red-100'
                }`}
        >
            <svg
                className={`w-5 h-5 transition-transform ${isPending ? 'animate-pulse' : ''}`}
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            <span className="font-bold text-sm">{count}</span>
        </button>
    );
}
