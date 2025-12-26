export const hexToRgba = (hex, alpha = 0.1) => {
    if (!hex || hex[0] !== '#') return hex;
    try {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch (e) {
        return hex;
    }
};

export const initTheme = () => {
    const themeColor = localStorage.getItem('theme_color');
    if (themeColor) {
        document.documentElement.style.setProperty('--theme-color', themeColor);
        document.documentElement.style.setProperty('--theme-color-light', hexToRgba(themeColor));
    }
};
