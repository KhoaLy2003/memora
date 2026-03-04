import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/home/HomePage";
import GroupDetailPage from "@/pages/home/GroupDetailPage";
import CreateGroupPage from "@/pages/home/CreateGroupPage";
import AlbumDetailPage from "@/pages/home/AlbumDetailPage";
import CreateAlbumPage from "@/pages/home/CreateAlbumPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import LoginSuccess from "@/pages/auth/LoginSuccess";
import ProfilePage from "@/pages/profile/ProfilePage";
import SettingsPage from "@/pages/settings/SettingsPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "login-success",
                element: <LoginSuccess />,
            },
            {
                // Guest only routes
                element: <ProtectedRoute requireAuth={false} />,
                children: [
                    {
                        path: "login",
                        element: <LoginPage />,
                    },
                    {
                        path: "register",
                        element: <RegisterPage />,
                    },
                ],
            },
            {
                // Protected routes
                element: <ProtectedRoute requireAuth={true} />,
                children: [
                    {
                        path: "groups/new",
                        element: <CreateGroupPage />,
                    },
                    {
                        path: "groups/:groupId",
                        element: <GroupDetailPage />,
                    },
                    {
                        path: "groups/:groupId/albums/new",
                        element: <CreateAlbumPage />,
                    },
                    {
                        path: "groups/:groupId/albums/:albumId",
                        element: <AlbumDetailPage />,
                    },
                    {
                        path: "profile",
                        element: <ProfilePage />,
                    },
                    {
                        path: "settings",
                        element: <SettingsPage />,
                    },
                ],
            },
            {
                path: "*",
                element: <Navigate to="/" replace />,
            },
        ],
    },
]);


export default function AppRouter() {
    return <RouterProvider router={router} />;
}
