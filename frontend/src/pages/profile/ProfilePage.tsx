import { useTranslation } from "react-i18next";

export default function ProfilePage() {
    const { t } = useTranslation();

    return (
        <div className="container py-8 mx-auto">
            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 mb-4 bg-muted rounded-full"></div>
                <h1 className="text-3xl font-bold">{t("profile.title")}</h1>
                <p className="text-muted-foreground">{t("profile.joined")}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* User stats, albums, memories will be here */}
            </div>
        </div>
    );
}
