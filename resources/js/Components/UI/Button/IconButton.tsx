// <ai_context>
// A reusable Mantine-compliant IconButton component using ActionIcon.
// </ai_context>

import React from 'react';
import { ActionIcon, ActionIconProps as MantineActionIconProps } from '@mantine/core';

export interface IconButtonProps extends MantineActionIconProps, Omit<React.ComponentPropsWithoutRef<'button'>, keyof MantineActionIconProps> {
    /** Custom JOPPA specific variant mapped to brand colors */
    joppaVariant?: 'primary' | 'secondary';
}

/**
 * Reusable JOPPA IconButton Component
 * 
 * Wraps `@mantine/core/ActionIcon`. Maps `joppaVariant` to `darkGreen` or `mustardGold`.
 * Defaults `radius="xl"`.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ children, joppaVariant, color, variant = 'filled', radius = 'xl', ...rest }, ref) => {
        let mappedColor = color;
        let mappedVariant = variant;

        if (joppaVariant === 'primary') {
            mappedColor = 'darkGreen';
            mappedVariant = 'filled';
        } else if (joppaVariant === 'secondary') {
            mappedColor = 'mustardGold';
            mappedVariant = 'filled';
        }

        return (
            <ActionIcon
                ref={ref}
                color={mappedColor}
                variant={mappedVariant}
                radius={radius}
                {...rest}
            >
                {children}
            </ActionIcon>
        );
    }
);

IconButton.displayName = 'IconButton';
