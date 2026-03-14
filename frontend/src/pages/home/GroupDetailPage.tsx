import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAlbums, useDeleteAlbum } from "@/hooks/use-albums";
import { useGroup, useGroupMembers, useRemoveMember, useLeaveGroup, useDeleteGroup } from "@/hooks/use-groups";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    Plus,
    Image as ImageIcon,
    Settings,
    UserPlus,
    Calendar,
    ArrowRight,
    Users,
    Copy,
    CheckCircle2,
    Trash2,
    Database,
    LogOut
} from "lucide-react";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Progress } from "@/components/ui/progress";
import { EditGroupModal } from "@/components/EditGroupModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

import { calculateStorage, formatBytes, formatMonthYear } from "@/lib/utils";
import i18n from "@/i18n";

export default function GroupDetailPage() {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const { data: groupData, isLoading: isGroupLoading } = useGroup(groupId!);
    const { data: membersData } = useGroupMembers(groupId!);
    const { data: albumsData, isLoading: isAlbumsLoading } = useAlbums(groupId!);
    const leaveGroup = useLeaveGroup();
    const deleteGroup = useDeleteGroup();

    const [activeTab, setActiveTab] = useState<"albums" | "members">("albums");
    const [showInviteCode, setShowInviteCode] = useState(false);
    const [copied, setCopied] = useState(false);
    const [guestCopied, setGuestCopied] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const { t } = useTranslation();

    const group = groupData?.data;
    const albums = albumsData?.data || [];
    const members = membersData?.data || [];

    const handleCopyCode = (code?: string, isGuest: boolean = false) => {
        if (code) {
            navigator.clipboard.writeText(code);
            if (isGuest) {
                setGuestCopied(true);
                setTimeout(() => setGuestCopied(false), 2000);
            } else {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        }
    };

    if (isGroupLoading || isAlbumsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!group) {
        return <div className="text-center py-20">Group not found</div>;
    }

    const isViewer = group.userRole === "VIEWER";

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header / Breadcrumbs */}
            <div className="space-y-6">
                <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium">
                    <ChevronLeft className="w-4 h-4" />
                    {t("group.backToSpaces")}
                </Link>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 text-center sm:text-left">
                        <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl md:rounded-3xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl md:text-3xl">
                            {group.avatarUrl ? (
                                <img src={group.avatarUrl} alt={group.name} className="w-full h-full object-cover rounded-2xl md:rounded-3xl" />
                            ) : (
                                group.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="space-y-1 w-full">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{group.name}</h1>
                            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto sm:mx-0">{group.description || t("group.defaultDescription")}</p>

                            {group.storageLimitBytes && (
                                <div className="flex items-center gap-4 pt-2 w-full lg:w-auto">
                                    <div className="w-full sm:max-w-xs space-y-1.5 mx-auto sm:mx-0">
                                        <div className="flex justify-between text-[10px] md:text-xs font-bold text-muted-foreground">
                                            <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5" /> {t("group.storageLabel")}</span>
                                            <span>{formatBytes(group.usedStorageBytes || 0)} / {formatBytes(group.storageLimitBytes)}</span>
                                        </div>
                                        <Progress value={calculateStorage(group.usedStorageBytes, group.storageLimitBytes).percent} className="h-1.5" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-end gap-4 w-full lg:w-auto">
                        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                            {!isViewer && (
                                <Button
                                    variant={showInviteCode ? "default" : "outline"}
                                    size="lg"
                                    className="rounded-xl gap-2 h-10 md:h-12 shadow-sm transition-all text-xs md:text-sm flex-1 sm:flex-none"
                                    onClick={() => setShowInviteCode(!showInviteCode)}
                                >
                                    <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
                                    {showInviteCode ? t("group.inviteToggleHide") : t("group.inviteToggleShow")}
                                </Button>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="w-10 h-10 md:w-12 md:h-12 rounded-xl border-muted-foreground/20">
                                        <Settings className="w-4 h-4 md:w-5 md:h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl p-2 min-w-[200px]">
                                    {group.userRole === "OWNER" && (
                                        <DropdownMenuItem onClick={() => setShowEditModal(true)} className="rounded-lg gap-2 cursor-pointer font-medium p-3">
                                            <Settings className="w-4 h-4" /> {t("group.editInfo")}
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => setShowLeaveModal(true)} className="rounded-lg gap-2 cursor-pointer text-destructive focus:text-destructive font-medium p-3">
                                        <LogOut className="w-4 h-4" /> {group.userRole === "OWNER" ? t("group.deleteGroup") : t("group.leaveGroup")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {!isViewer && (
                                <Link to={`/groups/${groupId}/albums/new`} className="flex-1 sm:flex-none">
                                    <Button size="lg" className="rounded-xl h-10 md:h-12 px-4 md:px-6 gap-2 shadow-lg text-xs md:text-sm w-full">
                                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                        {t("createAlbum.badge")}
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {!isViewer && showInviteCode && (
                            <div className="flex flex-col gap-2 w-full max-w-sm">
                                <div className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 bg-primary/5 border border-primary/20 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60 px-1 md:px-2 min-w-[80px] md:min-w-[130px]">{t("group.memberInvite")}</div>
                                    <code className="text-base md:text-xl font-black tracking-tighter text-primary bg-white px-2 md:px-4 py-1 rounded-lg border shadow-sm flex-1 text-center">
                                        {group.inviteCode}
                                    </code>
                                    <Button variant="ghost" size="icon" onClick={() => handleCopyCode(group.inviteCode, false)} className="h-8 w-8 md:h-10 md:w-10 text-primary hover:bg-primary/10 rounded-xl">
                                        {copied ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : <Copy className="w-4 h-4 md:w-5 md:h-5" />}
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 bg-secondary/20 border border-secondary/30 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-secondary-foreground/60 px-1 md:px-2 min-w-[80px] md:min-w-[130px]">{t("group.guestInvite")}</div>
                                    <code className="text-base md:text-xl font-black tracking-tighter text-secondary-foreground bg-white px-2 md:px-4 py-1 rounded-lg border shadow-sm flex-1 text-center">
                                        {group.guestInviteCode}
                                    </code>
                                    <Button variant="ghost" size="icon" onClick={() => handleCopyCode(group.guestInviteCode, true)} className="h-8 w-8 md:h-10 md:w-10 text-secondary-foreground hover:bg-secondary/20 rounded-xl">
                                        {guestCopied ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : <Copy className="w-4 h-4 md:w-5 md:h-5" />}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EditGroupModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                group={group}
            />

            <ConfirmModal
                isOpen={showLeaveModal}
                onClose={() => setShowLeaveModal(false)}
                onConfirm={() => {
                    if (group.userRole === "OWNER") {
                        deleteGroup.mutate(groupId!, { onSuccess: () => navigate("/") });
                    } else {
                        leaveGroup.mutate(groupId!, { onSuccess: () => navigate("/") });
                    }
                }}
                title={group.userRole === "OWNER" ? t("group.leaveTitleOwner") : t("group.leaveTitleMember")}
                description={group.userRole === "OWNER"
                    ? t("group.leaveDescOwner", { name: group.name })
                    : t("group.leaveDescMember", { name: group.name })}
                confirmText={group.userRole === "OWNER" ? t("group.leaveConfirmOwner") : t("group.leaveConfirmMember")}
                variant="destructive"
                isLoading={leaveGroup.isPending || deleteGroup.isPending}
            />

            {/* Tabs */}
            <div className="flex gap-4 md:gap-8 border-b">
                <button
                    onClick={() => setActiveTab("albums")}
                    className={`pb-3 md:pb-4 text-base md:text-lg font-bold transition-all relative ${activeTab === "albums" ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    {t("group.tabs.albums")}
                    {activeTab === "albums" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab("members")}
                    className={`pb-3 md:pb-4 text-base md:text-lg font-bold transition-all relative ${activeTab === "members" ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    {t("group.tabs.members")}
                    {activeTab === "members" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
                </button>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === "albums" ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">{t("group.albumsHeader")}</h2>
                            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                {t("group.albumsCount", { count: albums.length })}
                            </div>
                        </div>

                        {albums.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 md:p-20 border-2 border-dashed rounded-4xl md:rounded-[2.5rem] bg-muted/20 text-center space-y-6">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <ImageIcon className="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl md:text-2xl font-bold">{t("group.albumsEmptyTitle")}</h3>
                                    <p className="max-w-[400px] text-muted-foreground text-sm md:text-base">
                                        {t("group.albumsEmptyDesc")}
                                    </p>
                                </div>
                                {!isViewer && (
                                    <Link to={`/groups/${groupId}/albums/new`}>
                                        <Button size="lg" className="rounded-xl px-8 shadow-md h-10 md:h-12 text-sm md:text-base">{t("group.albumsEmptyCta")}</Button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {albums.map((album) => (
                                    <AlbumCard key={album.id} album={album} groupId={groupId!} userRole={group.userRole} />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">{t("group.membersHeader")}</h2>
                            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {t("group.membersCount", { count: members.length })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {members.map((member) => (
                                <MemberCard key={member.userId} member={member} groupId={groupId!} currentRole={group.userRole} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function MemberCard({
    member,
    groupId,
    currentRole,
}: {
    member: any;
    groupId: string;
    currentRole?: string;
}) {
    const removeMember = useRemoveMember(groupId);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const { t } = useTranslation();

    const isOwner = currentRole === "OWNER";
    const canRemove = isOwner && member.role !== "OWNER";

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowRemoveModal(true);
    };

    const confirmRemove = () => {
        removeMember.mutate(member.userId, {
            onSuccess: () => setShowRemoveModal(false),
        });
    };

    return (
        <>
            <ConfirmModal
                isOpen={showRemoveModal}
                onClose={() => setShowRemoveModal(false)}
                onConfirm={confirmRemove}
                title={t("group.memberRemoveTitle")}
                description={t("group.memberRemoveDesc", { name: member.fullName })}
                confirmText={t("group.memberRemove")}
                variant="destructive"
                isLoading={removeMember.isPending}
            />

            <div className="flex items-start gap-4 p-4 sm:p-5 bg-card border rounded-2xl sm:rounded-3xl hover:border-primary/30 transition-all shadow-sm group">

                {/* Avatar */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg sm:text-xl overflow-hidden shrink-0">
                    {member.avatarUrl ? (
                        <img
                            src={member.avatarUrl}
                            alt={member.fullName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        member.fullName.charAt(0).toUpperCase()
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">

                    {/* Name + Role */}
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold sm:font-bold truncate">
                            {member.fullName}
                        </h4>

                        {member.role === "OWNER" && (
                            <span className="shrink-0 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase rounded-full">
                                {t("group.memberOwner")}
                            </span>
                        )}
                    </div>

                    {/* Email */}
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {member.email}
                    </p>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between pt-1">

                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                            {t("group.memberJoined", {
                                date: new Date(member.joinedAt).toLocaleDateString(),
                            })}
                        </span>

                        {canRemove && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRemove}
                                className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                            >
                                {t("group.memberRemove")}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function AlbumCard({ album, groupId, userRole }: { album: any, groupId: string, userRole?: string }) {
    const deleteAlbum = useDeleteAlbum(album.id, groupId);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { t } = useTranslation();

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteAlbum.mutate(undefined, {
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    return (
        <>
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title={t("group.albumDeleteTitle")}
                description={t("group.albumDeleteDesc", { name: album.name })}
                confirmText={t("group.albumDeleteConfirm")}
                variant="destructive"
                isLoading={deleteAlbum.isPending}
            />
            <Link
                to={`/groups/${groupId}/albums/${album.id}`}
                className="group block relative aspect-4/5 rounded-[2.5rem] overflow-hidden bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
                {/* Cover Image */}
                <div className="absolute inset-0">
                    <img
                        src={album.coverMediaUrl || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800"}
                        alt={album.name}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700 ease-out grayscale-[0.2] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                </div>

                {/* Actions overlay (top right) */}
                {userRole === "OWNER" && (
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/20 hover:bg-destructive hover:text-white backdrop-blur-md text-white border border-white/10"
                        >
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                    </div>
                )}

                {/* Content overlay */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end gap-2 md:gap-3 translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="space-y-0.5 md:space-y-1">
                        <div className="flex items-center gap-2 text-primary-foreground/70 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                            <ImageIcon className="w-3 md:w-3.5 h-3 md:h-3.5" />
                            {t("album.collection")}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">{album.name}</h3>
                    </div>

                    <p className="text-white/70 line-clamp-2 text-xs md:text-sm leading-relaxed mb-2 md:mb-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {album.description || "A beautiful collection of memories preserved forever."}
                    </p>

                    <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/10 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        <div className="flex items-center gap-2 text-white/60 text-[10px] md:text-xs font-semibold">
                            <Calendar className="w-3 md:w-3.5 h-3 md:h-3.5" />
                            {formatMonthYear(album.createdAt, i18n.language)}
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}
