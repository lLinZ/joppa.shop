import { useEffect, useRef } from 'react';
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const CRM_BASE = (import.meta.env.VITE_CRM_API_URL as string) || 'http://localhost:8000/api';
const TRACKING_URL = `${CRM_BASE}/tracking/heartbeat`;

// Instancia global en memoria para no reconectar en cada navegación SPA
let globalEchoInstance: any = null;

export function useWebTracker() {
    const isTabActive = useRef(true);

    useEffect(() => {
        let visitorId = localStorage.getItem('joppa_visitor_id');
        if (!visitorId) {
            visitorId = crypto.randomUUID();
            localStorage.setItem('joppa_visitor_id', visitorId);
        }

        // Envía un latido confiable al CRM por HTTP (ahora sin intervalos, solo al entrar/salir de página)
        const sendHeartbeat = () => {
            if (isTabActive.current || !isTabActive.current) {
                // sendBeacon es no-bloqueante y garantizado incluso al cerrar la pestaña
                const data = new Blob([JSON.stringify({
                    visitor_id: visitorId,
                    url: window.location.href,
                })], { type: 'application/json' });
                
                navigator.sendBeacon(TRACKING_URL, data);
            }
        };

        // Latido inicial de carga de página
        sendHeartbeat();

        if (typeof window !== 'undefined') {
            if (!(window as any).Pusher) {
                (window as any).Pusher = Pusher;
            }

            if (!globalEchoInstance) {
                globalEchoInstance = new Echo({
                    broadcaster: 'reverb',
                    key: import.meta.env.VITE_REVERB_APP_KEY as string,
                    wsHost: import.meta.env.VITE_REVERB_HOST as string,
                    wsPort: import.meta.env.VITE_REVERB_PORT ? Number(import.meta.env.VITE_REVERB_PORT) : 8080,
                    wssPort: import.meta.env.VITE_REVERB_PORT ? Number(import.meta.env.VITE_REVERB_PORT) : 443,
                    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
                    enabledTransports: ['ws', 'wss'],
                    disableStats: true,
                    authorizer: (channel: any, _options: any) => {
                        return {
                            authorize: (socketId: string, callback: any) => {
                                axios.post(`${CRM_BASE}/broadcasting/auth`, {
                                    socket_id: socketId,
                                    channel_name: channel.name,
                                    visitor_id: visitorId,
                                    url: window.location.href
                                })
                                .then(response => {
                                    callback(false, response.data);
                                })
                                .catch(error => {
                                    callback(true, error);
                                });
                            }
                        };
                    },
                });

                globalEchoInstance.join('presence-store');
            } else {
                // Si la instancia ya existe (es una navegación SPA), susurramos a todos la nueva URL
                const channel = globalEchoInstance.join('presence-store');
                setTimeout(() => {
                    channel.whisper('navigated', {
                        id: visitorId,
                        url: window.location.href
                    });
                }, 500); // Pequeño delay para asegurar que la vista cargó
            }
        }

        const onVisibilityChange = () => {
            isTabActive.current = document.visibilityState === 'visible';
            sendHeartbeat(); // Registrar si ocultó o mostró la pantalla
        };
        
        const onBeforeUnload = () => {
            sendHeartbeat(); // Guardar el último segundo exacto antes de cerrar pestaña
        };

        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('beforeunload', onBeforeUnload);

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.removeEventListener('beforeunload', onBeforeUnload);
            // No desconectamos globalEchoInstance aquí para que persista durante la navegación SPA
        };
    }, []);
}
