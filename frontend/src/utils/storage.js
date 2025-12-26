export const setStorage = async (key, value) => {
    localStorage.setItem(key, value);
}

export const getStorage = async (key) => {
    return localStorage.getItem(key);
}

export const removeStorage = async (key) => {
    localStorage.removeItem(key);
}
