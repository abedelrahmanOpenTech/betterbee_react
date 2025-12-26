import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import useAuth from '../stores/useAuth';

export default function GuestRoute() {
    const [checking, setChecking] = useState(true);
    const { init } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = async () => {
            const isLoggedIn = await init();
            if (isLoggedIn) {
                navigate('/', { replace: true });
            }
            setChecking(false);
        };

        verifyAuth();
    }, [navigate]);

    if (checking) {
        return (
            <div className="vh-100 d-flex align-items-center justify-content-center text-theme">
                <div className="spinner spinner-border"></div>
            </div>
        );
    }

    return <Outlet />;
}
