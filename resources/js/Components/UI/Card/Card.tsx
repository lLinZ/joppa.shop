// <ai_context>
// A reusable Mantine-compliant compound Card component for product or layout displays.
// </ai_context>

import React from 'react';
import { Card as MantineCard, CardSection } from '@mantine/core';

export interface CardProps extends React.ComponentPropsWithoutRef<typeof MantineCard> {
    children?: React.ReactNode;
    padding?: string | number;
    radius?: string | number;
    shadow?: string;
}

/**
 * Standardized JOPPA Card Component
 * 
 * Wraps `@mantine/core/Card` and exposes `Card.Section` as a compound component.
 * - Defaults padding to `md`, radius to `md`, and shadow to `sm`.
 */
const CardBase = React.forwardRef<HTMLDivElement, CardProps>(
    ({ padding = 'md', radius = 'md', shadow = 'sm', children, ...rest }, ref) => {
        return (
            <MantineCard
                ref={ref}
                padding={padding}
                radius={radius}
                shadow={shadow}
                {...rest}
            >
                {children}
            </MantineCard>
        );
    }
);

CardBase.displayName = 'Card';

export const Card = Object.assign(CardBase, {
    Section: CardSection,
});
