export function basename(path, suffix = '') {
    // Handle both Unix (/) and Windows (\) paths
    if (!path) return '';
    const parts = path.split(/[\\/]/);
    let base = parts[parts.length - 1];

    if (suffix && base.endsWith(suffix)) {
        base = base.slice(0, -suffix.length);
    }

    return base;
}

export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const isImage = (filename) => {
    if (!filename) return false;
    const ext = filename.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
};

export const isAudio = (filename) => {
    if (!filename) return false;
    const ext = filename.split('.').pop().toLowerCase();
    return ['wav', 'mp3', 'ogg', 'm4a', 'aac', 'webm'].includes(ext);
};

export function isLink(text) {
    if (typeof text !== 'string' || text.trim() === '') {
        return false;
    }

    // Reject if contains spaces or control characters
    if (/\s/.test(text)) {
        return false;
    }

    try {
        const urlStr = text.includes('://') ? text : `https://${text}`;
        const url = new URL(urlStr);

        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
            return false;
        }

        const host = url.hostname;

        // Must have a hostname
        if (!host) return false;

        // ✅ Allow IP addresses (IPv4 or IPv6)
        if (isIP(host)) {
            return true;
        }

        // ✅ Require at least one dot (to avoid treating "ee" or "localhost" as links)
        //    BUT also allow "localhost" explicitly if you want (optional)
        if (host === 'localhost') {
            return true; // optional: remove if you don't want localhost
        }

        // Require at least one dot and reasonable structure
        if (!host.includes('.')) {
            return false;
        }

        // Optional: basic TLD check (at least 2 chars after last dot)
        const tld = host.split('.').pop();
        if (tld.length < 2) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

export function ensureProtocol(url) {
    return url.startsWith('http') ? url : 'https://' + url;
}

function isIP(str) {
    return (
        /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(str) || // IPv4
        /^[\da-fA-F:]+$/.test(str) // very basic IPv6 (good enough for this use case)
    );
}