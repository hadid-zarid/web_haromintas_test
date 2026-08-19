import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import { AuthProvider } from './context/AuthContext';
import { PeraturanProvider } from './context/PeraturanContext';
import { ToastProvider } from './context/ToastContext';
import Toast from './components/common/Toast';

const appName = import.meta.env.VITE_APP_NAME || 'HARMONITAS';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <AuthProvider>
                <PeraturanProvider>
                    <ToastProvider>
                        <Toast />
                        <App {...props} />
                    </ToastProvider>
                </PeraturanProvider>
            </AuthProvider>
        );
    },
    progress: {
        color: '#FFC800',
        showSpinner: true,
    },
});
