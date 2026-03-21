import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/use-user";
import { EditProfileModal } from "@/components/EditProfileModal";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";

export default function ProfilePage() {
    const { t, i18n } = useTranslation();
    const { user, isLoading } = useUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="container py-20 mx-auto flex justify-center">
                <div className="animate-pulse text-muted-foreground">{t("auth.pleaseWait")}</div>
            </div>
        );
    }

    if (!user) return null;

    const dateLocale = i18n.language.startsWith("vi") ? vi : enUS;

    let joinedDate = "---";
    try {
        if (user.createdAt) {
            joinedDate = format(new Date(user.createdAt), "MMMM yyyy", { locale: dateLocale });
        }
    } catch (error) {
        console.error("Error formatting date:", error);
    }

    return (
        <div className="container max-w-4xl py-12 mx-auto px-4">
            <div className="bg-card rounded-[2.5rem] border shadow-sm overflow-hidden">
                {/* Header/Cover Area */}
                <div className="h-32 bg-linear-to-r from-primary/10 via-primary/5 to-transparent"></div>

                <div className="px-8 pb-8 -mt-16">
                    <div className="flex flex-col sm:flex-row items-end gap-6 mb-8">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-4xl bg-background border-4 border-background shadow-xl overflow-hidden">
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary text-4xl font-bold">
                                        {user.fullName?.charAt(0) || "?"}
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Basic Info */}
                        <div className="flex-1 pb-2">
                            <h1 className="text-3xl font-bold tracking-tight">{user.fullName}</h1>
                            <p className="text-muted-foreground">
                                {t("profile.joined", { date: joinedDate })}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="pb-2">
                            <Button
                                onClick={() => setIsEditModalOpen(true)}
                                variant="outline"
                                className="rounded-2xl px-6"
                            >
                                {t("profile.editProfile")}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t">
                        {/* Left Column: Details */}
                        <div className="md:col-span-1 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                                    {t("profile.email")}
                                </h3>
                                <div className="p-4 rounded-2xl bg-muted/50 border border-transparent hover:border-border transition-colors">
                                    <p className="font-medium truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Placeholder for more stats/features */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="p-8 rounded-4xl border-2 border-dashed border-muted flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 rounded-full bg-muted mb-4 flex items-center justify-center">
                                    <span className="text-xl">✨</span>
                                </div>
                                <h4 className="font-semibold mb-2">More features coming</h4>
                                <p className="text-sm text-muted-foreground">
                                    Soon you'll see your memory statistics, top contributors, and space summaries here.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
            />
        </div>
    );
}
