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

export function isArabic(text) {
    if (!text) return false;
    const firstChar = text.trim().charAt(0);
    return /[\u0600-\u06FF]/.test(firstChar);
}

export async function copyContentsToClipboard(html, plainText) {
    // 1. Try modern navigator.clipboard.write (HTML + Text)
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard && navigator.clipboard.write) {
        try {
            const blob = new Blob([html], { type: 'text/html' });
            const textBlob = new Blob([plainText], { type: 'text/plain' });
            const data = [new ClipboardItem({
                'text/html': blob,
                'text/plain': textBlob
            })];
            await navigator.clipboard.write(data);
            return true;
        } catch (err) {
            console.error("Clipboard API write failed, falling back to writeText", err);
        }
    }

    // 2. Fallback to navigator.clipboard.writeText (Plain Text only)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(plainText);
            return true;
        } catch (err) {
            console.error("Clipboard API writeText failed, falling back to execCommand", err);
        }
    }

    // 3. Final fallback: document.execCommand('copy')
    try {
        const textarea = document.createElement("textarea");
        textarea.value = plainText;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        return successful;
    } catch (err) {
        console.error("All copy methods failed", err);
        return false;
    }
}
