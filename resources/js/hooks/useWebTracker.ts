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
        let visitorSource = localStorage.getItem('joppa_visitor_source');
        if (!visitorId) {
            visitorId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : 'v-' + Date.now() + '-' + Math.random().toString(36).substring(2);
            localStorage.setItem('joppa_visitor_id', visitorId);

            const urlParams = new URLSearchParams(window.location.search);
            let source = 'Orgánico / Directo';
            if (urlParams.has('fbclid')) source = '📱 Facebook / IG Ads';
            else if (urlParams.has('gclid')) source = '🔍 Google Ads';
            else if (urlParams.has('utm_source')) source = '📢 ' + urlParams.get('utm_source');
            else if (document.referrer) {
                if (document.referrer.includes('instagram.com')) source = '📸 Instagram';
                else if (document.referrer.includes('facebook.com')) source = '📘 Facebook';
                else if (document.referrer.includes('tiktok.com')) source = '🎵 TikTok';
                else if (document.referrer.includes('google.')) source = '🔍 Búsqueda Google';
                else {
                    try { source = '🔗 ' + new URL(document.referrer).hostname; } catch(e) { source = '🔗 Referido'; }
                }
            }
            localStorage.setItem('joppa_visitor_source', source);
            visitorSource = source;
        }

        // Envía un latido confiable al CRM por HTTP
        // Envía un latido confiable al CRM por HTTP
        const sendHeartbeat = () => {
            fetch(TRACKING_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitor_id: visitorId,
                    url: window.location.href,
                    source: visitorSource || localStorage.getItem('joppa_visitor_source') || 'Orgánico / Directo'
                }),
                keepalive: true,
                credentials: 'omit'
            }).catch(() => {});

            if (globalEchoInstance) {
                const channel = globalEchoInstance.join('store');
                channel.whisper('navigated', {
                    id: visitorId,
                    url: window.location.href
                });
            }
        };

        // Latido inicial de carga de página
        sendHeartbeat();

        // Poliing de seguridad: actualiza duración cada 15 segundos mientras la pestaña esté activa
        const interval = setInterval(() => {
            if (isTabActive.current) {
                sendHeartbeat();
            }
        }, 15000);

        if (typeof window !== 'undefined') {
            if (!(window as any).Pusher) {
                (window as any).Pusher = Pusher;
            }
            
            // Forzar el log directamente en el módulo importado para Vite
            Pusher.logToConsole = true;
            Pusher.log = (message) => {
                console.log('PUSHER LOG:', message);
            };

            const reverbKey = import.meta.env.VITE_REVERB_APP_KEY as string;
            
            console.log('Tracker: Iniciando...', { 
                tieneLlave: !!reverbKey, 
                yaInstanciado: !!globalEchoInstance,
                url: import.meta.env.VITE_REVERB_HOST,
                port: import.meta.env.VITE_REVERB_PORT
            });

            if (reverbKey && !globalEchoInstance) {
                console.log('Tracker: Ejecutando new Echo()...');
                
                try {
                    globalEchoInstance = new Echo({
                        broadcaster: 'reverb',
                        key: reverbKey,
                        wsHost: import.meta.env.VITE_REVERB_HOST as string,
                        wsPort: import.meta.env.VITE_REVERB_PORT ? Number(import.meta.env.VITE_REVERB_PORT) : 8080,
                        wssPort: import.meta.env.VITE_REVERB_PORT ? Number(import.meta.env.VITE_REVERB_PORT) : 443,
                        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
                        enabledTransports: ['ws', 'wss'],
                        disableStats: true,
                        authorizer: (channel: any, _options: any) => {
                            return {
                                authorize: (socketId: string, callback: any) => {
                                    console.log('Tracker: Autorizando Pusher Socket ID:', socketId);
                                    axios.post(`${CRM_BASE}/broadcasting/auth`, {
                                        socket_id: socketId,
                                        channel_name: channel.name,
                                        visitor_id: visitorId,
                                        url: window.location.href,
                                        source: localStorage.getItem('joppa_visitor_source') || 'Directo'
                                    })
                                    .then(response => {
                                        console.log('Tracker: Autorizado OK', response.data);
                                        callback(null, response.data);
                                    })
                                    .catch(error => {
                                        console.error('Tracker: Error de Autenticación', error);
                                        callback(new Error(error), { auth: '' });
                                    });
                                }
                            };
                        },
                    });

                    console.log('Tracker: Instancia Echo creada con éxito. Uniendo a canal...');
                    globalEchoInstance.join('store');
                    console.log('Tracker: Instrucción Join enviada.');
                } catch (e) {
                    console.error('Tracker: CRASH creando Echo:', e);
                }
            } else if (globalEchoInstance) {
                // Si la instancia ya existe (es una navegación SPA), susurramos a todos la nueva URL
                const channel = globalEchoInstance.join('store');
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

        const handleNavigate = () => {
            setTimeout(() => {
                sendHeartbeat();
            }, 100); // small delay to let window.location.href update
        };

        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('beforeunload', onBeforeUnload);
        // Escuchar cambios de ruta en Inertia para SPA
        document.addEventListener('inertia:navigate', handleNavigate);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.removeEventListener('beforeunload', onBeforeUnload);
            document.removeEventListener('inertia:navigate', handleNavigate);
            // No desconectamos globalEchoInstance aquí para que persista durante la navegación SPA
        };
    }, []);
}
