import createServer from '@inertiajs/react/server';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from './theme';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../css/app.css';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx')
            ),
        setup({ App, props }) {
            return (
                <MantineProvider theme={theme} defaultColorScheme="light">
                    <Notifications />
                    <App {...props} />
                </MantineProvider>
            );
        },
    })
);
