import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast';
import AppRoute from '../routes/AppRoute.jsx';
import ProtectedRoute from '../routes/ProtectedRoute.jsx';
import GuestRoute from '../routes/GuestRoute.jsx';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Home from "./Home.jsx";

const queryClient = new QueryClient()

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />
            <BrowserRouter basename={import.meta.env.VITE_ROOT_PATH}>
                <Routes>
                    <Route element={<AppRoute />}>
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Home />} />
                        </Route>

                        <Route element={<GuestRoute />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
