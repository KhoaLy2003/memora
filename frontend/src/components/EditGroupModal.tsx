import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateGroup } from "@/hooks/use-groups";
import type { Group } from "@/types";
import { useTranslation } from "react-i18next";

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
}

export function EditGroupModal({
  isOpen,
  onClose,
  group,
}: EditGroupModalProps) {
  const updateGroup = useUpdateGroup(group.id);
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description || "");
  const [avatarUrl, setAvatarUrl] = useState(group.avatarUrl || "");
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      setName(group.name);
      setDescription(group.description || "");
      setAvatarUrl(group.avatarUrl || "");
    }
  }, [isOpen, group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGroup.mutate(
      { name, description, avatarUrl },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-[425px] rounded-3xl p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("createGroup.editSettings")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label>{t("createGroup.name")}</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded-md border text-sm bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <label>{t("createGroup.description")}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded-md border text-sm h-24 bg-background"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("createGroup.cancel")}
            </Button>
            <Button type="submit" disabled={updateGroup.isPending}>
              {updateGroup.isPending
                ? t("createGroup.saving")
                : t("createGroup.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
