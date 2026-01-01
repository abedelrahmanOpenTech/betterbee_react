import { Outlet } from "react-router-dom";
import { useAuthInit } from "../hooks/useAuthQuery";
import { useEffect } from "react";
import useAuth from "../stores/useAuth";

export default function AppRoute() {
    const { refetch: fetchAuth } = useAuthInit(false);
    const auth = useAuth();

    useEffect(() => {
        async function init() {
            if (await auth.init()) {
                fetchAuth();
            }
        }
        init();
    }, []);

    return <Outlet />;
}
