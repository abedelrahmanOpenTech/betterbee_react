import { create } from 'zustand'
import { getStorage, removeStorage, setStorage } from '../utils/storage';
import { setTheme } from '../utils/theme';

const useAuth = create((set, get) => ({
    user: {},
    accessToken: "",
    isTeacher: () => get().user.type == 'teacher',
    isStudent: () => get().user.type == 'student',
    set: async (newAuth, newAccessToken = null) => {
        // Apply settings directly
        if (newAuth.settings) {
            if (newAuth.settings.theme_color) {
                setTheme(newAuth.settings.theme_color);
            }
            if (newAuth.settings.lang) {
                localStorage.setItem('user-language', newAuth.settings.lang);
            }
        }

        //set newAccessToken only if not null
        if (newAccessToken) {
            set({ user: newAuth, accessToken: newAccessToken });
            await setStorage("accessToken", newAccessToken);
        } else {
            set({ user: newAuth });
        }
        await setStorage("auth", JSON.stringify(newAuth));
    },
    init: async () => {
        try {
            const auth = await getStorage("auth");
            const accessToken = await getStorage("accessToken");
            set({ user: JSON.parse(auth), accessToken });
            return accessToken;
        } catch (error) {

            return false;
        }
    },
    clear: async () => {
        set({ user: {}, accessToken: "" });
        await removeStorage("auth");
        await removeStorage("accessToken");
    },
}))


export default useAuth;
