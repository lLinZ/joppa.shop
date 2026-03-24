import { useEffect, useRef } from 'react';
import axios from 'axios';

// Interval to send tracking pings (15 seconds)
const PING_INTERVAL = 15000;
// URL to ping 
const TRACKING_URL = 'http://localhost:8000/api/tracking/heartbeat';

export function useWebTracker() {
    const isTabActive = useRef(true);

    useEffect(() => {
        // Retrieve or generate visitor ID
        let visitorId = localStorage.getItem('joppa_visitor_id');
        if (!visitorId) {
            visitorId = crypto.randomUUID();
            localStorage.setItem('joppa_visitor_id', visitorId);
        }

        const sendHeartbeat = async () => {
            // Only ping if tab is active to preserve backend resources for actual view time
            if (isTabActive.current) {
                try {
                    await axios.post(TRACKING_URL, {
                        visitor_id: visitorId,
                        url: window.location.href, // Sends the current page URL
                    });
                } catch (error) {
                    console.error('Tracking heartbeat failed:', error);
                }
            }
        };

        // Fire immediately on mount
        sendHeartbeat();

        // Setup interval for continuous pings
        const interval = setInterval(sendHeartbeat, PING_INTERVAL);

        // Listen for visibility changes (to pause tracking when user switches tabs)
        const onVisibilityChange = () => {
            isTabActive.current = document.visibilityState === 'visible';
            // If they just came back to tab, send an immediate ping
            if (isTabActive.current) {
                sendHeartbeat();
            }
        };

        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);
}
