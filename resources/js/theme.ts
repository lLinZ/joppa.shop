// <ai_context>
// Defines the global Mantine theme for the JOPPA brand, incorporating custom colors, fonts, and component defaults.
// </ai_context>

import { createTheme, MantineColorsTuple } from '@mantine/core';

/**
 * 10-shade definition for the JOPPA Dark Green brand color.
 * The primary brand dark green (#0B3022) is mapped to shade 7.
 */
const darkGreen: MantineColorsTuple = [
    '#e6f0ec',
    '#c2dbcf',
    '#9ec6b2',
    '#7ab195',
    '#569c78',
    '#32875b',
    '#19583e',
    '#0b3022', // primary brand color
    '#072118',
    '#04120d',
];

/**
 * 10-shade definition for the JOPPA Mustard Gold brand color.
 * The primary brand mustard gold (#D4A017) is mapped to shade 6.
 */
const mustardGold: MantineColorsTuple = [
    '#fdf8e8',
    '#f8eabc',
    '#f3dc90',
    '#eece64',
    '#e9c038',
    '#e4b20c',
    '#d4a017', // primary brand color
    '#a87f12',
    '#7d5e0d',
    '#513d09',
];

/**
 * 10-shade definition for the JOPPA Cream Background color.
 * The primary brand cream background (#F5F5DC) is mapped to shade 1.
 */
const creamBackground: MantineColorsTuple = [
    '#fbfbf6',
    '#f5f5dc', // primary brand color
    '#dfdfba',
    '#c8c898',
    '#b2b276',
    '#9c9c54',
    '#818143',
    '#666635',
    '#4b4b27',
    '#303019',
];

/**
 * The JOPPA custom Mantine theme configuration object.
 * Applies the brand's color palette, sets the primary color, and defines default component props.
 */
export const theme = createTheme({
    /**
     * Custom colors definition extending the default Mantine colors.
     */
    colors: {
        darkGreen,
        mustardGold,
        creamBackground,
    },
    
    /**
     * Default primary color key.
     */
    primaryColor: 'darkGreen',

    /**
     * Defines the default font family for the application.
     * Uses a robust modern sans-serif stack as per brand guidelines.
     */
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    
    /**
     * Default radius for all components to give a modern look.
     */
    defaultRadius: 'md',
    
    /**
     * Component default properties overrides.
     */
    components: {
        Button: {
            defaultProps: {
                radius: 'md',
            },
        },
        Card: {
            defaultProps: {
                radius: 'md',
            },
        },
        TextInput: {
            defaultProps: {
                radius: 'md',
            },
        },
        PasswordInput: {
            defaultProps: {
                radius: 'md',
            },
        },
        Select: {
            defaultProps: {
                radius: 'md',
            },
        },
    },
});
