// <ai_context>
// A reusable InfiniteScroll component wrapping Mantine's `useIntersection` hook.
// Detects when the user scrolls to the bottom edge and triggers a backend load.
// Completely avoids Tailwind, safely deferring to pure Mantine architecture.
// </ai_context>

import React, { useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { Loader, Center, Box } from '@mantine/core';

export interface InfiniteScrollProps {
    /** Callback executed when the invisible boundary intersects the viewport */
    onLoadMore: () => void;
    /** Flag to know if there is more data available from the backend */
    hasMore: boolean;
    /** Standard loading flag to display Mantine's <Loader /> natively */
    isLoading: boolean;
    /** Rendered list items or application specific UI */
    children: React.ReactNode;
}

/**
 * Reusable JOPPA InfiniteScroll Component
 * 
 * Safely wraps any children and intelligently paginates by intersecting an invisible footer
 * with the user's viewport, leveraging `@mantine/hooks` directly.
 */
export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
    onLoadMore,
    hasMore,
    isLoading,
    children,
}) => {
    // Rely exclusively on Mantine's Intersection hook logic for viewport analysis
    const { ref, entry } = useIntersection({
        root: null,
        threshold: 0.1,
    });

    useEffect(() => {
        if (entry?.isIntersecting && hasMore && !isLoading) {
            onLoadMore();
        }
    }, [entry?.isIntersecting, hasMore, isLoading, onLoadMore]);

    return (
        <Box>
            {/* The primary content block rendering arbitrary dynamic data UI */}
            {children}
            
            {/* The intersecting target zone padding at the absolute bottom */}
            <Box ref={ref} py="xl">
                {isLoading && (
                    <Center>
                        <Loader color="darkGreen" type="dots" />
                    </Center>
                )}
            </Box>
        </Box>
    );
};
