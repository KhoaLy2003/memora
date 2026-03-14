import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import api from "@/api/axios";
import { useTranslation } from "react-i18next";

export default function LoginSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const { t } = useTranslation();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            // Fetch profile using token via our api client
            api.get("/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    const responseData = res.data;
                    if (responseData.status === "success" || responseData.code === 200) {
                        const userData = responseData.data;
                        login(
                            {
                                id: userData.id,
                                name: userData.fullName,
                                email: userData.email,
                                avatar: userData.avatarUrl,
                            },
                            token
                        );
                        navigate("/");
                    } else {
                        navigate("/login?error=profile_fetch_failed");
                    }
                })
                .catch((err) => {
                    console.error("Profile fetch error:", err);
                    navigate("/login?error=network_error");
                });
        } else {
            navigate("/login?error=auth_failed");
        }
    }, [searchParams, navigate, login]);


    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h2 className="text-xl font-medium">{t("auth.completingLogin")}</h2>
                <p className="text-muted-foreground">{t("auth.pleaseWait")}</p>
            </div>
        </div>
    );
}
