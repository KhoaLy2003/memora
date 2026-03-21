import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import type { User } from "@/types";
import { useTranslation } from "react-i18next";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export function EditProfileModal({
  isOpen,
  onClose,
  user,
}: EditProfileModalProps) {
  const { updateProfile, isUpdating } = useUser();
  const [fullName, setFullName] = useState(user.fullName);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      setFullName(user.fullName);
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ fullName, avatarUrl });
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-[425px] rounded-3xl p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{t("profile.editProfile")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">
                {t("profile.name")}
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border bg-background/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
                placeholder={t("profile.name")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">
                {t("profile.avatar")}
              </label>
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border bg-background/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">
                {t("profile.email")}
              </label>
              <input
                value={user.email}
                disabled
                className="w-full px-4 py-3 rounded-2xl border bg-muted/50 text-muted-foreground cursor-not-allowed outline-none"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3 sm:gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 rounded-2xl"
            >
              {t("confirm.defaultCancel")}
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="flex-1 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {isUpdating ? t("profile.saving") : t("profile.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
