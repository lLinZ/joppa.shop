// <ai_context>
// A reusable Mantine-compliant NumberInput component for forms.
// </ai_context>

import React from 'react';
import { NumberInput as MantineNumberInput } from '@mantine/core';

export interface NumberInputProps extends React.ComponentProps<typeof MantineNumberInput> {}

/**
 * Standardized JOPPA NumberInput Component
 * 
 * Wraps `@mantine/core/NumberInput` to ensure only numeric values.
 * - Same styling defaults as TextInput (`radius="md"`, darkGreen focus ring).
 */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    ({ radius = 'md', styles, ...rest }, ref) => {
        return (
            <MantineNumberInput
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

NumberInput.displayName = 'NumberInput';
