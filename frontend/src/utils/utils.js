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
    return text.startsWith('http://') || text.startsWith('https://') || text.startsWith('www.');
}

export function ensureProtocol(url) {
    return url.startsWith('http') ? url : 'https://' + url;
}

