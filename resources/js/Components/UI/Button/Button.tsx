// <ai_context>
// A highly reusable Button component configured securely on top of Mantine's native `<Button />`.
// Completely avoids Tailwind CSS and exclusively utilizes Mantine's built-in robust styling and custom theming parameters.
// </ai_context>

import React from 'react';
import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';

/**
 * Strongly typed interface extending Mantine's ButtonProps and standard HTML attributes.
 */
export interface ButtonProps extends MantineButtonProps, Omit<React.ComponentPropsWithoutRef<'button'>, keyof MantineButtonProps> {
    /** 
     * Custom JOPPA specific button variant mapped securely to Mantine theme colors.
     * Maps 'primary' to 'darkGreen' and 'secondary' to 'mustardGold'.
     */
    joppaVariant?: 'primary' | 'secondary';
}

/**
 * Reusable JOPPA UI Button Component
 * 
 * Provides a highly customizable button utilizing pure `@mantine/core/Button` configuration.
 * Resolves the custom `joppaVariant` into standard Mantine colors and default styling to 
 * enforce consistency without using residual Tailwind or inline CSS.
 * By default, buttons across the application will use `radius="xl"` and `size="md"`.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, joppaVariant, color, variant = 'filled', size = 'md', radius = 'xl', ...rest }, ref) => {
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
            <MantineButton
                ref={ref}
                color={mappedColor}
                variant={mappedVariant}
                size={size}
                radius={radius}
                {...rest}
            >
                {children}
            </MantineButton>
        );
    }
);

Button.displayName = 'Button';
