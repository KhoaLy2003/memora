import { useTranslation } from "react-i18next";

export default function RegisterPage() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 space-y-4 bg-card border rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-center">{t("auth.registerTitle")}</h2>
                <p className="text-center text-muted-foreground">
                    {t("auth.registerSubtitle")}
                </p>
                {/* Registration form will be implemented here */}
            </div>
        </div>
    );
}
