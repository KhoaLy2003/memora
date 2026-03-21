import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useMedia,
  useUploadMedia,
  useDeleteMedia,
  useDownloadMedia,
} from "@/hooks/use-media";
import { useAlbums, useUpdateAlbum } from "@/hooks/use-albums";
import { useGroup } from "@/hooks/use-groups";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Upload,
  Download,
  Trash2,
  MoreHorizontal,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import { ConfirmModal } from "@/components/ConfirmModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

export default function AlbumDetailPage() {
  const { groupId, albumId } = useParams<{
    groupId: string;
    albumId: string;
  }>();
  const { data: groupData } = useGroup(groupId!);
  const { data: albumsData } = useAlbums(groupId!);
  const { data: mediaData, isLoading } = useMedia(albumId!);
  const uploadMutation = useUploadMedia(albumId!);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const album = albumsData?.data.find((a) => a.id === albumId);
  const isViewer = groupData?.data?.userRole === "VIEWER";
  const mediaList = mediaData?.data || [];
  const [index, setIndex] = useState(-1);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showLightboxDeleteModal, setShowLightboxDeleteModal] = useState(false);
  const [isBatchUploading, setIsBatchUploading] = useState(false);

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const deleteMedia = useDeleteMedia(albumId!);
  const downloadMedia = useDownloadMedia();
  const { t } = useTranslation();

  const toggleSelectionMode = () => {
    setSelectionMode((prev) => {
      if (prev) {
        setSelectedIds([]);
      }
      return !prev;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // const handleLightboxDelete = () => {
  //   const media = mediaList[index];
  //   if (media) {
  //     setShowLightboxDeleteModal(true);
  //   }
  // };

  const confirmLightboxDelete = () => {
    const media = mediaList[index];
    if (!media) return;

    deleteMedia.mutate(media.id, {
      onSuccess: () => {
        setShowLightboxDeleteModal(false);
        setIndex(-1);
      },
    });
  };

  // const handleLightboxDownload = () => {
  //   const media = mediaList[index];
  //   if (media) {
  //     downloadMedia.mutate(media.id, {
  //       onSuccess: (url) => {
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.download = media.fileName;
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //       },
  //     });
  //   }
  // };

  const handleBulkDownload = async () => {
    const items = mediaList.filter((m) => selectedIds.includes(m.id));
    for (const media of items) {
      try {
        const url = await downloadMedia.mutateAsync(media.id);
        const link = document.createElement("a");
        link.href = url;
        link.download = media.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        // ignore individual failures for now
      }
    }
  };

  const handleBulkDelete = async () => {
    const items = mediaList.filter((m) => selectedIds.includes(m.id));
    for (const media of items) {
      try {
        await deleteMedia.mutateAsync(media.id);
      } catch {
        // ignore individual failures for now
      }
    }
    setSelectedIds([]);
    setSelectionMode(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      setIsBatchUploading(true);
      try {
        await uploadMutation.mutateAsync(filesArr);
      } catch (error) {
        console.error("Failed to upload files:", error);
      } finally {
        setIsBatchUploading(false);
        // Clear the input so the same files can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!album) {
    return <div className="text-center py-20">Album not found</div>;
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header / Navigation */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-muted-foreground font-medium">
          <Link to="/" className="hover:text-primary transition-colors">
            {t("album.breadcrumbSpaces")}
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
          <Link
            to={`/groups/${groupId}`}
            className="hover:text-primary transition-colors"
          >
            {t("album.breadcrumbGroup")}
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
          <span className="text-foreground">{t("album.breadcrumbAlbum")}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {album.name}
              </h1>
              <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] md:text-xs font-bold text-muted-foreground border dark:border-zinc-700">
                {t("album.itemsCount", { count: mediaList.length })}
              </div>
            </div>
            <p className="text-muted-foreground text-base md:text-lg">
              {album.description || "A collection of shared moments."}
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {mediaList.length > 0 && (
              <Button
                variant={selectionMode ? "default" : "outline"}
                size="lg"
                className="rounded-xl h-10 md:h-12 px-3 md:px-4 text-xs md:sm font-semibold flex-1 md:flex-none"
                onClick={toggleSelectionMode}
              >
                {selectionMode ? t("album.selectCancel") : t("album.select")}
              </Button>
            )}

            {!isViewer && (
              <>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  size="lg"
                  className="rounded-xl h-10 md:h-12 px-4 md:px-6 gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all text-xs md:sm flex-1 md:flex-none"
                  onClick={handleUploadClick}
                  disabled={isBatchUploading}
                >
                  {isBatchUploading ? (
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Upload className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                  {isBatchUploading
                    ? t("album.uploading")
                    : t("album.upload")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {selectionMode && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border bg-muted/40 px-4 py-3 sticky top-20 z-40 backdrop-blur-md">
          <p className="text-sm font-medium text-muted-foreground w-full sm:w-auto text-center sm:text-left">
            {selectedIds.length === 0
              ? t("album.selectionHintEmpty")
              // : `${selectedIds.length} item${selectedIds.length > 1 ? "s" : ""} selected`}
              : t("album.selectionHintCount", { count: selectedIds.length })}
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 sm:flex-none"
              disabled={selectedIds.length === 0 || downloadMedia.isPending}
              onClick={handleBulkDownload}
            >
              <Download className="w-4 h-4 mr-1" />
              {t("album.download")}
            </Button>
            {!isViewer && (
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 sm:flex-none"
                disabled={selectedIds.length === 0 || deleteMedia.isPending}
                onClick={handleBulkDelete}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {t("album.delete")}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Media Masonry Grid */}
      {mediaList.length === 0 ? (
        <div
          onClick={handleUploadClick}
          className="flex flex-col items-center justify-center p-8 md:p-32 border-2 border-dashed rounded-4xl md:rounded-[3rem] bg-zinc-50 dark:bg-zinc-900 shadow-inner text-center space-y-6 md:space-y-8"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary group animate-pulse">
            <Upload className="w-8 h-8 md:w-12 md:h-12 group-hover:scale-110 transition-transform" />
          </div>
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-2xl md:text-3xl font-bold">{t("album.emptyTitle")}</h3>
            <p className="max-w-[450px] text-muted-foreground text-base md:text-lg leading-relaxed">
              {t("album.emptyDescription")}
            </p>
          </div>
          <div className="text-[10px] md:text-sm font-bold text-muted-foreground/60 uppercase tracking-widest border-t pt-6 md:pt-8 w-48 md:w-64 border-zinc-200 dark:border-zinc-800">
            {t("album.emptyTypes")}
          </div>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {mediaList.map((media, i) => (
            <MediaItem
              key={media.id}
              media={media}
              albumId={albumId!}
              onOpen={() => setIndex(i)}
              isViewer={isViewer}
              selectionMode={selectionMode}
              isSelected={selectedIds.includes(media.id)}
              onToggleSelect={() => toggleSelect(media.id)}
            />
          ))}
        </div>
      )}

      <Lightbox
        index={index}
        slides={mediaList.map((m: any) => {
          const isVid = m.fileType === "VIDEO" || m.fileName.toLowerCase().endsWith(".mp4");
          if (isVid) {
            return {
              type: "video",
              width: 1280,
              height: 720,
              poster: `${m.downloadUrl}#t=0.1`,
              sources: [
                {
                  src: m.downloadUrl,
                  type: "video/mp4",
                },
              ],
            };
          }
          return { src: m.downloadUrl };
        })}
        open={index >= 0}
        close={() => setIndex(-1)}
        controller={{ closeOnBackdropClick: false }}
        plugins={[Zoom, Video]}
        render={{
          buttonPrev: isMobile ? () => null : undefined,
          buttonNext: isMobile ? () => null : undefined,
        }}
      // render={{
      //   controls: () => (
      //     <div className="absolute top-6 right-16 flex gap-2 z-[1000] group">
      //       <Button
      //         variant="ghost"
      //         size="icon"
      //         onClick={(e) => {
      //           e.stopPropagation();
      //           handleLightboxDownload();
      //         }}
      //         className="w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white backdrop-blur-md pointer-events-auto"
      //       >
      //         <Download className="w-5 h-5" />
      //       </Button>

      //       <Button
      //         variant="ghost"
      //         size="icon"
      //         onClick={(e) => {
      //           e.stopPropagation();
      //           handleLightboxDelete();
      //         }}
      //         className="w-10 h-10 rounded-full bg-black/60 text-white hover:bg-destructive hover:text-white backdrop-blur-md pointer-events-auto"
      //       >
      //         <Trash2 className="w-5 h-5" />
      //       </Button>
      //     </div>
      //   ),
      // }}
      />

      {/* {index >= 0 && mediaList[index] && createPortal(
        <div className="fixed inset-0 pointer-events-none z-[1000000]">
          <div className="absolute top-6 right-6 flex gap-2 pointer-events-auto">

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLightboxDownload}
              className="w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md"
            >
              <Download className="w-5 h-5" />
            </Button>

            {!isViewer && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLightboxDelete}
                className="w-10 h-10 rounded-full bg-black/60 text-white hover:bg-destructive hover:text-white backdrop-blur-md"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}

          </div>
        </div>,
        document.body
      )} */}

      <ConfirmModal
        isOpen={showLightboxDeleteModal}
        onClose={() => setShowLightboxDeleteModal(false)}
        onConfirm={confirmLightboxDelete}
        title={t("album.mediaDeleteTitle")}
        description={t("album.mediaDeleteDesc")}
        confirmText={t("album.delete")}
        variant="destructive"
        isLoading={deleteMedia.isPending}
      />
    </div>
  );
}

export function MediaItem({
  media,
  albumId,
  onOpen,
  isViewer,
  selectionMode,
  isSelected,
  onToggleSelect,
}: {
  media: any;
  albumId: string;
  onOpen: () => void;
  isViewer?: boolean;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}) {
  const isVideo =
    media.fileType === "VIDEO" || media.fileName.toLowerCase().endsWith(".mp4");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteMedia = useDeleteMedia(albumId);
  const updateAlbum = useUpdateAlbum(albumId);
  const downloadMedia = useDownloadMedia();
  const { t } = useTranslation();

  const handleCardClick = () => {
    if (selectionMode && onToggleSelect) {
      onToggleSelect();
    } else {
      onOpen();
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadMedia.mutate(media.id, {
      onSuccess: (presignedUrl) => {
        const link = document.createElement("a");
        link.href = presignedUrl;
        link.download = media.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    });
  };

  const handleDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteMedia.mutate(media.id, {
      onSuccess: () => setShowDeleteModal(false),
    });
  };

  const handleSetCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateAlbum.mutate({ coverMediaUrl: media.downloadUrl });
  };

  return (
    <>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={t("album.mediaDeleteTitle")}
        description={t("group.albumDeleteDesc", { name: media.fileName })}
        variant="destructive"
        isLoading={deleteMedia.isPending}
      />
      <div
        className={`relative group break-inside-avoid rounded-4xl overflow-hidden bg-zinc-900 border-4 border-transparent hover:border-primary/20 transition-all duration-500 shadow-md hover:shadow-2xl min-h-[200px] ${isSelected ? "border-primary/60" : ""}`}
      >
        {/* Visual */}
        <div
          className="relative aspect-auto cursor-zoom-in min-h-[200px]"
          onClick={handleCardClick}
        >
          {selectionMode && onToggleSelect && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect();
              }}
              className="absolute top-4 left-4 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-black/50 text-white"
            >
              {isSelected && <CheckCircle2 className="w-4 h-4" />}
            </button>
          )}
          {isVideo ? (
            <video
              src={`${media.downloadUrl}#t=0.1`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={media.downloadUrl}
              alt={media.fileName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          )}

          {isVideo && (
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2.5 rounded-full text-white shadow-lg border border-white/10">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}

          {/* Lightbox Toggle overlay (clickable) */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Actions - Visible on hover (desktop) or always accessible via tap overlay (mobile) */}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-linear-to-t from-black via-black/80 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-3 md:gap-4 translate-y-2 md:translate-y-0 group-hover:translate-y-0">
          <div className="space-y-0.5 md:space-y-1">
            <h4 className="text-white font-bold tracking-tight text-[10px] md:text-sm line-clamp-1">
              {media.fileName}
            </h4>
            <div className="flex items-center gap-2 md:gap-3 text-white/70 text-[10px] md:text-xs font-semibold">
              <span className="flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                {new Date(media.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-3 md:pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
              >
                <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
              {!isViewer && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-destructive hover:text-white text-white backdrop-blur-md"
                >
                  <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              )}
            </div>

            {!isViewer && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-xl p-2 min-w-[160px]"
                >
                  <DropdownMenuItem
                    onClick={handleSetCover}
                    className="rounded-lg gap-2 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {t("album.setAsCover")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDownload}
                    className="rounded-lg gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    {t("album.download")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="rounded-lg gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t("album.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
