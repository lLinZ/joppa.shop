// <ai_context>
// The main entry point for the React application, initializing Inertia and wrapping the app in the global MantineProvider with the custom theme.
// </ai_context>

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../css/app.css';
import './bootstrap';

// Instruct Vite to process all images in resources/images
import.meta.glob([
    '../images/**',
]);

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from './theme';
import { useWebTracker } from './hooks/useWebTracker';

const RootWrapper = ({ children }: { children: React.ReactNode }) => {
    useWebTracker();
    return <>{children}</>;
};

const appName = import.meta.env.VITE_APP_NAME || 'JOPPA E-commerce';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <MantineProvider theme={theme} defaultColorScheme="light">
                <Notifications />
                <RootWrapper>
                    <App {...props} />
                </RootWrapper>
            </MantineProvider>
        );
    },
    progress: {
        color: '#D4A017',
    },
});
