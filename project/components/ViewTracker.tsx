'use client';

import { useEffect } from 'react';
import { incrementView } from '@/app/actions/posts';

export default function ViewTracker({ postId }: { postId: string }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            incrementView(postId);
        }, 5000); // Wait 5 seconds to count as a view

        return () => clearTimeout(timer);
    }, [postId]);

    return null;
}
