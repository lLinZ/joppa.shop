// <ai_context>
// A reusable molecule component using Mantine to display a list of available product colors as selectable swatches.
// </ai_context>

import React from 'react';
import { Group, ColorSwatch, useMantineTheme, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export interface ProductColor {
    /** Unique identifier for the color */
    id: string;
    /** Hex code or valid CSS color to render the swatch */
    hex: string;
    /** Human-readable name of the color used for accessibility */
    name: string;
}

export interface ColorPickerProps {
    /** List of available colors to display */
    colors: ProductColor[];
    /** The currently selected hex code */
    selectedColorHex?: string;
    /** Callback fired when a color is selected */
    onChange: (hex: string) => void;
}

/**
 * ColorPicker Molecule Component
 * 
 * Displays a horizontally aligned list of Mantine ColorSwatches. 
 * Allows users to choose a product color and visually indicates the selected color.
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
    colors,
    selectedColorHex,
    onChange,
}) => {
    const theme = useMantineTheme();

    return (
        <Group gap="sm">
            {colors.map((color) => {
                const isSelected = selectedColorHex === color.hex;

                return (
                    <ColorSwatch
                        key={color.id}
                        component="button"
                        type="button"
                        color={color.hex}
                        onClick={() => onChange(color.hex)}
                        size={32}
                        withShadow
                        style={{
                            cursor: 'pointer',
                            outlineOffset: rem(2),
                            // Use primary brand color for the outline to match theme
                            outline: isSelected ? `2px solid ${theme.colors[theme.primaryColor][6]}` : 'none',
                        }}
                        aria-label={`Select ${color.name}`}
                    >
                        {isSelected && (
                            <IconCheck
                                style={{
                                    width: rem(16),
                                    height: rem(16),
                                    color: '#fff',
                                    mixBlendMode: 'difference' // Ensures visibility against both light and dark swatches
                                }}
                            />
                        )}
                    </ColorSwatch>
                );
            })}
        </Group>
    );
};
