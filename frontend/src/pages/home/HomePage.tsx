import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import { Images, Zap, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="py-12 lg:py-20">
      {/* Hero: clear value in seconds */}
      <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t("home.badge")}
          </p>

          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {t("home.heroTitlePrefix")}
            <span className="text-primary">{t("home.heroTitleHighlight")}</span>
          </h1>

          <p className="text-balance text-base text-muted-foreground sm:text-lg">
            {t("home.heroDescription")}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link to="/login">
              <Button
                size="lg"
                className="h-11 rounded-full px-7 text-sm font-semibold"
              >
                {t("home.ctaPrimary")}
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-full px-7 text-sm"
              >
                {t("home.ctaSecondary")}
              </Button>
            </a>
          </div>

          <p className="text-xs text-muted-foreground">{t("home.heroNote")}</p>
        </div>

        {/* Visual storytelling area */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-br from-primary/10 via-transparent to-primary/5 blur-2xl" />

          <div className="grid gap-4">
            <div className="rounded-2xl border bg-background/70 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">
                  {t("home.sharedAlbumTitle")}
                </span>
                <span>{t("home.yesterday")}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <img
                  src={import.meta.env.VITE_MEMORA_FAMILY_IMAGE}
                  alt="Family moments"
                  className="aspect-4/5 rounded-xl object-cover"
                />
                <img
                  src={import.meta.env.VITE_MEMORA_TRAVEL_IMAGE}
                  alt="Travel memories"
                  className="aspect-4/5 rounded-xl object-cover"
                />
                <img
                  src={import.meta.env.VITE_MEMORA_FRIEND_IMAGE}
                  alt="Friends together"
                  className="aspect-4/5 rounded-xl object-cover"
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {t("home.albumDescription")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border bg-background/70 p-4 text-xs shadow-sm">
                <p className="mb-3 font-medium">{t("home.whoInSpace")}</p>
                <div className="flex -space-x-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    KL
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    TR
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    +4
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {t("home.spaceDescription")}
                </p>
              </div>
              <div className="rounded-2xl border bg-background/70 p-4 text-xs shadow-sm">
                <p className="mb-2 font-medium">{t("home.inviteTitle")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("home.inviteDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles: simple and focused */}
      <section
        className="mt-16 border-t pt-10 lg:mt-20 lg:pt-14"
        aria-labelledby="principles-heading"
      >
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2
              id="principles-heading"
              className="text-lg font-semibold tracking-tight sm:text-xl"
            >
              {t("home.principlesTitle")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("home.principlesSubtitle")}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <PrincipleCard
            icon={<Images className="h-5 w-5" />}
            label={t("home.principleVisualLabel")}
            title={t("home.principleVisualTitle")}
            description={t("home.principleVisualDesc")}
          />
          <PrincipleCard
            icon={<Zap className="h-5 w-5" />}
            label={t("home.principleSimpleLabel")}
            title={t("home.principleSimpleTitle")}
            description={t("home.principleSimpleDesc")}
          />
          <PrincipleCard
            icon={<Users className="h-5 w-5" />}
            label={t("home.principleGroupsLabel")}
            title={t("home.principleGroupsTitle")}
            description={t("home.principleGroupsDesc")}
          />
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mt-16 rounded-3xl border bg-muted/40 p-6 lg:mt-20 lg:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight sm:text-lg">
              {t("home.howTitle")}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {t("home.howSubtitle")}
            </p>
          </div>
          <Link to="/login">
            <Button size="sm" className="rounded-full px-5 text-xs">
              {t("home.howCta")}
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StepItem
            step="01"
            title={t("home.step1Title")}
            body={t("home.step1Body")}
          />
          <StepItem
            step="02"
            title={t("home.step2Title")}
            body={t("home.step2Body")}
          />
          <StepItem
            step="03"
            title={t("home.step3Title")}
            body={t("home.step3Body")}
          />
        </div>
      </section>
    </div>
  );
}

function PrincipleCard(props: {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
}) {
  const { icon, label, title, description } = props;

  return (
    <article className="flex flex-col rounded-2xl border bg-background/60 p-4 text-sm shadow-sm">
      <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-xs text-muted-foreground">{description}</p>
    </article>
  );
}

function StepItem(props: { step: string; title: string; body: string }) {
  const { step, title, body } = props;

  return (
    <div className="flex flex-col rounded-2xl bg-background/60 p-4 text-xs">
      <p className="text-xs font-mono font-medium text-muted-foreground">
        {step}
      </p>
      <h3 className="mt-1 text-sm font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
