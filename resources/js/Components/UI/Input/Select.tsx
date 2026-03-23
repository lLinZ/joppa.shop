// <ai_context>
// A reusable Mantine-compliant Select component for dropdown forms, with standardized JOPPA themes.
// Strictly avoids Tailwind CSS.
// </ai_context>

import React from 'react';
import { Select as MantineSelect } from '@mantine/core';

export interface SelectProps extends React.ComponentProps<typeof MantineSelect> {}

/**
 * Standardized JOPPA Select Component
 * 
 * Wraps `@mantine/core/Select` to enforce consistent styling.
 * - Defaults to `radius="md"`.
 * - Ensures focus ring aligns strictly with the 'darkGreen' brand color.
 */
export const Select = React.forwardRef<HTMLInputElement, SelectProps>(
    ({ radius = 'md', styles, ...rest }, ref) => {
        return (
            <MantineSelect
                ref={ref}
                radius={radius}
                styles={{
                    input: {
                        '&:focus, &:focus-within': {
                            borderColor: 'var(--mantine-color-darkGreen-7)',
                        },
                    },
                    ...(typeof styles === 'object' ? styles : {}),
                }}
                {...rest}
            />
        );
    }
);

Select.displayName = 'Select';
