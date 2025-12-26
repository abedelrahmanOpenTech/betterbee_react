import ar from '../languages/ar';
import en from '../languages/en';

const LANG_STORAGE_KEY = 'user-language';

/** Gets the current language code (e.g., 'en', 'ar'). Defaults to 'en'. */
export function getLang() {
    return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
}

/** Gets the current text direction ('ltr' or 'rtl') from the HTML 'dir' attribute. */
export function getDir() {
    return document.documentElement.getAttribute('dir') || 'rtl';
}


/**
 * Changes the language, updates localStorage, and reloads the page.
 * @param {string} newLang - The new language code.
 */
export function changeLang(newLang) {
    const currentLang = getLang();

    // If language is already set, do nothing.
    if (currentLang === newLang) {
        return;
    }

    // Persist the new language.
    localStorage.setItem(LANG_STORAGE_KEY, newLang);

    // Force a page reload to apply new CSS and attributes.
    window.location.reload();
}

/** Toggles language between 'en' and 'ar'. */
export function toggleLang() {
    const currentLang = getLang();
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    changeLang(newLang);
}

/** Initializes localization: sets HTML dir/lang attributes and imports Bootstrap CSS. */
export function initLocalization() {
    // Determine language and direction based on stored value
    const currentLang = getLang();
    const isRTL = currentLang === 'ar' || currentLang === 'he';
    const dir = isRTL ? 'rtl' : 'ltr';

    // Set HTML Attributes
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', currentLang);

    // Conditional CSS Import
    if (dir === 'rtl') {
        import('bootstrap/dist/css/bootstrap.rtl.min.css');
        import('../assets/css/rtl.css');
    } else {
        import('bootstrap/dist/css/bootstrap.min.css');
        import('../assets/css/ltr.css');
    }
}


export function df(key) {
    const lang = getLang();
    if (lang == 'en') {
        return en[key];
    } else if (lang == 'ar') {
        return ar[key];
    }
}
