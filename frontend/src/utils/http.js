import useAuth from "../stores/useAuth";
import { df, getLang } from "./lang";
export async function http(url, options = {}) {


    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "Authorization": "Bearer " + useAuth.getState().accessToken,
        },
    };

    if (options.body instanceof FormData) {
        delete defaultOptions.headers['Content-Type'];
    }

    // Merge user options
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: { ...defaultOptions.headers, ...options.headers },
    };

    try {

        url = url + (url.includes('?') ? '&' : '?') + 'lang=' + getLang();
        const response = await fetch(url, finalOptions);
        const data = await response.json().catch(() => null);
        return data;
    } catch (error) {
        return { status: 'error', message: df('error') };
    }
}
