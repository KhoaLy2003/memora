import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useCreateAlbum } from "@/hooks/use-albums";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CreateAlbumForm {
    name: string;
    description: string;
}

export default function CreateAlbumPage() {
    const { groupId } = useParams<{ groupId: string }>();
    const { register, handleSubmit, formState: { errors } } = useForm<CreateAlbumForm>();
    const createAlbum = useCreateAlbum(groupId!);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const onSubmit = (data: CreateAlbumForm) => {
        createAlbum.mutate(data, {
            onSuccess: (response) => {
                navigate(`/groups/${groupId}/albums/${response.data.id}`);
            },
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 py-6">
            <Link to={`/groups/${groupId}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium">
                <ChevronLeft className="w-4 h-4" />
                {t("createAlbum.back")}
            </Link>

            <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest leading-none">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t("createAlbum.badge")}
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">
                    {t("createAlbum.title")}
                </h1>
                <p className="text-muted-foreground text-lg italic">
                    {t("createAlbum.subtitle")}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card border p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                            {t("createAlbum.nameLabel")}
                        </label>
                        <input
                            {...register("name", { required: t("createAlbum.nameRequired") })}
                            className="w-full h-14 px-6 rounded-2xl bg-muted/30 border-2 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium"
                            placeholder={t("createAlbum.namePlaceholder")}
                        />
                        {errors.name && <p className="text-destructive text-sm font-semibold ml-2">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                            {t("createAlbum.descriptionLabel")}
                        </label>
                        <textarea
                            {...register("description")}
                            className="w-full min-h-[150px] p-6 rounded-2xl bg-muted/30 border-2 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg resize-none"
                            placeholder={t("createAlbum.descriptionPlaceholder")}
                        />
                    </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-2xl flex gap-4 text-sm text-primary font-medium border border-primary/10">
                    <Info className="w-5 h-5 shrink-0" />
                    <p>{t("createAlbum.info")}</p>
                </div>

                <Button
                    type="submit"
                    className="w-full h-16 rounded-2xl text-xl font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    disabled={createAlbum.isPending}
                >
                    {createAlbum.isPending
                        ? t("createAlbum.submitCreating")
                        : t("createAlbum.submit")}
                </Button>
            </form>
        </div>
    );
}
