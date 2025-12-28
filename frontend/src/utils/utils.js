export function basename(path, suffix = '') {
    // Handle both Unix (/) and Windows (\) paths
    const parts = path.split(/[\\/]/);
    let base = parts[parts.length - 1];

    if (suffix && base.endsWith(suffix)) {
        base = base.slice(0, -suffix.length);
    }

    return base;
}