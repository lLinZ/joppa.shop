// <ai_context>
// A reusable Mantine-compliant TextInput component for forms, with standardized JOPPA themes.
// Strictly avoids Tailwind CSS and utilizes native Mantine styles API to enforce the 'darkGreen' brand focus border.
// </ai_context>

import React from 'react';
import { TextInput as MantineTextInput } from '@mantine/core';

/**
 * Strongly typed interface capturing all native props of Mantine's `<TextInput />`.
 */
export interface TextInputProps extends React.ComponentProps<typeof MantineTextInput> {}

/**
 * Standardized JOPPA TextInput Component
 * 
 * Wraps `@mantine/core/TextInput` to enforce consistent styling and error handling.
 * - Defaults to `radius="md"` for a cohesive form experience.
 * - Ensures focus ring aligns strictly with the 'darkGreen' brand color.
 * - Inherits native support for Mantine's `error` prop (showing red borders/text).
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
    ({ radius = 'md', styles, ...rest }, ref) => {
        return (
            <MantineTextInput
                ref={ref}
                radius={radius}
                // Explicitly enforce the focus border to match the primary darkGreen theme
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

TextInput.displayName = 'TextInput';
