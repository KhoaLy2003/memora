import { useState } from "react";
import { useGroups, useJoinGroup } from "@/hooks/use-groups";
import { Button } from "@/components/ui/button";
import type { Group } from "@/types";
import { Link } from "react-router-dom";
import {
  Users,
  HardDrive,
  Plus,
  ArrowRight,
  Clock,
  KeyRound,
} from "lucide-react";
import { calculateStorage, formatBytes } from "@/lib/utils";
import { notify } from "@/store/notificationStore";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { data, isLoading } = useGroups();
  const joinGroup = useJoinGroup();
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const { t } = useTranslation();

  const groups = data?.data || [];

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode) return;
    joinGroup.mutate(joinCode, {
      onSuccess: () => {
        setJoinCode("");
        setIsJoining(false);
        notify.success(t("dashboard.joinSuccess", "Joined group successfully."));
      },
      onError: (error: any) => {
        const message =
          error?.message ||
          t(
            "dashboard.joinError",
            "Failed to join group. Please check the invite code.",
          );
        notify.error(message);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Hero Summary Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {t("dashboard.title")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isJoining ? (
            <form
              onSubmit={handleJoin}
              className="flex items-center gap-2 animate-in slide-in-from-right-2"
            >
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder={t("dashboard.joinPlaceholder")}
                className="h-12 px-4 rounded-xl border-2 border-primary/20 focus:border-primary outline-hidden w-40 font-black tracking-widest text-center"
                maxLength={8}
              />
              <Button
                type="submit"
                disabled={joinGroup.isPending}
                className="h-12 rounded-xl"
              >
                {t("dashboard.join")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsJoining(false)}
                className="h-12 rounded-xl"
              >
                {t("dashboard.cancel")}
              </Button>
            </form>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsJoining(true)}
              className="h-12 px-6 rounded-xl gap-2 text-lg border-2"
            >
              <KeyRound className="w-5 h-5" />
              {t("dashboard.joinToggle")}
            </Button>
          )}
          <Link to="/groups/new">
            <Button className="h-12 px-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-all gap-2 text-lg">
              <Plus className="w-5 h-5" />
              {t("dashboard.newSpace")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-3xl bg-muted/20 text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Users className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">
              {t("dashboard.emptyTitle")}
            </h3>
            <p className="max-w-[400px] text-muted-foreground">
              {t("dashboard.emptyDescription")}
            </p>
          </div>
          <Link to="/groups/new">
            <Button size="lg" className="rounded-xl px-8">
              {t("dashboard.emptyCta")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupCard({ group }: { group: Group }) {
  const { percent } = calculateStorage(
    group.usedStorageBytes,
    group.storageLimitBytes,
  );
  const { t } = useTranslation();

  return (
    <Link
      to={`/groups/${group.id}`}
      className="group block relative p-6 bg-card border rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl group-hover:scale-110 transition-transform">
            {group.avatarUrl ? (
              <img
                src={group.avatarUrl}
                alt={group.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              group.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-xs font-semibold text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            {t("group.statusActive")}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="text-2xl font-bold tracking-tight line-clamp-1">
            {group.name}
          </h3>
          <p className="text-muted-foreground line-clamp-2 min-h-12">
            {group.description || t("group.defaultDescription")}
          </p>
        </div>

        {/* Storage Indicator */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {t("dashboard.storageLabel")}
            </span>
            <span>
              {t("dashboard.storageUsed", { percent })}
            </span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-out ${
                percent > 90
                  ? "bg-destructive"
                  : percent > 70
                    ? "bg-accent"
                    : "bg-primary"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground font-medium text-right">
            {formatBytes(group.usedStorageBytes || 0)} /{" "}
            {formatBytes(group.storageLimitBytes)}
          </div>
        </div>

        {/* Footer Interaction */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-xs font-medium text-muted-foreground gap-1">
              <Clock className="w-3.5 h-3.5" />
              {t("dashboard.updatesLabel")}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-all">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
