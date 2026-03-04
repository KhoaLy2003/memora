import { useTranslation } from "react-i18next";

export default function SettingsPage() {
    const { t } = useTranslation();

    return (
        <div className="container py-8 mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">{t("settings.title")}</h1>
            <div className="space-y-8">
                <section className="p-6 border rounded-lg bg-card">
                    <h2 className="text-xl font-semibold mb-4 text-primary">
                        {t("settings.account")}
                    </h2>
                    {/* Account settings here */}
                </section>
                <section className="p-6 border rounded-lg bg-card">
                    <h2 className="text-xl font-semibold mb-4 text-primary">
                        {t("settings.privacy")}
                    </h2>
                    {/* Privacy settings here */}
                </section>
            </div>
        </div>
    );
}
