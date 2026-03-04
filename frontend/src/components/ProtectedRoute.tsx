import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children?: ReactNode;
    requireAuth?: boolean;
}

export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    if (requireAuth) {
        if (!isAuthenticated) {
            // User is not authenticated, redirect to login page
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    } else {
        // This is for guest-only pages like login/register
        if (isAuthenticated) {
            // User is already authenticated, redirect to home page
            return <Navigate to="/" replace />;
        }
    }

    return children ? <>{children}</> : <Outlet />;
}
