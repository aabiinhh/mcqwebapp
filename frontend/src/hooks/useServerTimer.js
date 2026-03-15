import { useState, useEffect } from 'react';

const useServerTimer = (serverStartTime, totalDurationMinutes) => {
    const [timeLeftMs, setTimeLeftMs] = useState(null);

    useEffect(() => {
        if (!serverStartTime || !totalDurationMinutes) {
            setTimeLeftMs(null);
            return;
        }

        const startTime = new Date(serverStartTime).getTime();
        const durationMs = totalDurationMinutes * 60 * 1000;
        const endTime = startTime + durationMs;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const remaining = endTime - now;

            if (remaining <= 0) {
                setTimeLeftMs(0);
                clearInterval(timer);
            } else {
                setTimeLeftMs(remaining);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [serverStartTime, totalDurationMinutes]);

    const formatTime = (ms) => {
        if (ms === null) return "--:--";
        if (ms <= 0) return "00:00:00";

        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return { timeLeftMs, formattedTime: formatTime(timeLeftMs), isExpired: timeLeftMs === 0 };
};

export default useServerTimer;
