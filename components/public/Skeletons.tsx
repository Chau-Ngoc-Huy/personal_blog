/**
 * Route-transition skeletons. These mirror the real page layouts closely so
 * the swap from skeleton → content doesn't shift the viewport. Rendered by the
 * `loading.tsx` Suspense boundaries while a (cache-miss) page streams in.
 */

function Box({ className = "" }: { className?: string }) {
  return <span className={`skeleton block ${className}`} />;
}

const PANEL =
  "mx-auto w-full overflow-hidden rounded-[24px] border border-[#ECEFEF] bg-[#F5F7F7]";

/** Mirrors <Navbar>: wordmark on the left, nav links on the right. */
function FauxNavbar() {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
        paddingTop: "var(--navbar-py)",
      }}
    >
      <Box className="h-8 w-32 rounded-md" />
      <div className="hidden items-center gap-7 md:flex">
        <Box className="h-4 w-14 rounded" />
        <Box className="h-4 w-16 rounded" />
      </div>
      <Box className="h-4 w-6 rounded md:hidden" />
    </div>
  );
}

const SECTION = {
  maxWidth: "var(--maxw)",
  paddingLeft: "var(--page-px)",
  paddingRight: "var(--page-px)",
} as const;

export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header + hero panel */}
      <div
        style={{
          paddingLeft: "var(--box-margin)",
          paddingRight: "var(--box-margin)",
          paddingTop: "var(--box-margin)",
        }}
      >
        <div className={PANEL} style={{ maxWidth: "var(--maxw)" }}>
          <FauxNavbar />
          <section className="mx-auto" style={SECTION}>
            <div className="grid items-center gap-8 py-12 md:grid-cols-[1.08fr_0.92fr] md:gap-16 md:py-20 lg:py-24">
              <div>
                <Box className="mb-5 h-3 w-24 rounded" />
                <Box className="mb-4 h-12 w-full max-w-[460px] rounded-lg" />
                <Box className="mb-6 h-12 w-3/4 max-w-[360px] rounded-lg" />
                <Box className="mb-3 h-4 w-full max-w-[420px] rounded" />
                <Box className="mb-8 h-4 w-2/3 max-w-[300px] rounded" />
                <Box className="h-4 w-40 rounded" />
              </div>
              <div className="justify-self-center">
                <div className="aspect-square w-[clamp(260px,33vw,420px)]">
                  <Box className="h-full w-full rounded-full" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Blogs section */}
      <section className="mx-auto" style={SECTION}>
        {/* Featured */}
        <div className="py-8 md:py-12">
          <Box className="mb-8 h-3 w-28 rounded" />
          <div className="grid grid-cols-1 gap-7 border-t border-[#ECEFEF] pt-8 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-14 md:pt-12">
            <div>
              <Box className="mb-5 h-6 w-24 rounded-full" />
              <Box className="mb-4 h-9 w-full max-w-[420px] rounded-lg" />
              <Box className="mb-2 h-4 w-full max-w-[360px] rounded" />
              <Box className="mb-6 h-4 w-2/3 max-w-[260px] rounded" />
              <Box className="h-4 w-32 rounded" />
            </div>
            <Box className="aspect-[4/3] w-full rounded-[var(--ac-radius)]" />
          </div>
        </div>

        {/* Latest list */}
        <div className="py-8 md:py-14">
          <Box className="mb-8 h-3 w-32 rounded" />
          <div>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="grid grid-cols-1 gap-3 border-t border-[#ECEFEF] py-6 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center sm:gap-7 sm:py-7"
              >
                <Box className="hidden aspect-[4/3] w-full rounded-[10px] sm:block" />
                <div className="min-w-0">
                  <Box className="mb-2 h-6 w-3/4 max-w-[360px] rounded" />
                  <Box className="mb-3 h-4 w-full max-w-[460px] rounded" />
                  <Box className="h-3 w-40 rounded" />
                </div>
              </div>
            ))}
            <div className="border-t border-[#ECEFEF]" />
          </div>
        </div>
      </section>
    </div>
  );
}

export function ArticleSkeleton() {
  const PAGE = {
    maxWidth: "1240px",
    paddingLeft: "var(--page-px)",
    paddingRight: "var(--page-px)",
  } as const;

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Header panel */}
        <div className="mx-auto" style={{ ...PAGE, paddingTop: "var(--box-margin)" }}>
          <div className="overflow-hidden rounded-[24px] border border-[#ECEFEF] bg-[#F5F7F7]">
            <FauxNavbar />
            <div
              className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-12"
              style={{
                paddingLeft: "var(--page-px)",
                paddingRight: "var(--page-px)",
                paddingTop: "clamp(8px,2vw,20px)",
                paddingBottom: "clamp(28px,5vw,56px)",
              }}
            >
              <div>
                <Box className="mb-5 h-6 w-20 rounded-full" />
                <Box className="mb-3 h-10 w-full max-w-[520px] rounded-lg" />
                <Box className="mb-5 h-10 w-2/3 max-w-[380px] rounded-lg" />
                <Box className="mb-6 h-4 w-full max-w-[440px] rounded" />
                <div className="flex items-center gap-3">
                  <Box className="h-10 w-10 rounded-full" />
                  <Box className="h-4 w-40 rounded" />
                </div>
              </div>
              <Box className="aspect-[4/3] w-full rounded-[16px]" />
            </div>
          </div>
        </div>

        {/* Body + TOC */}
        <div
          className="mx-auto"
          style={{
            ...PAGE,
            paddingTop: "clamp(28px,5vw,56px)",
            paddingBottom: "clamp(40px,6vw,80px)",
          }}
        >
          <div className="flex flex-col items-start gap-10 xl:flex-row xl:gap-14">
            <div className="hidden w-[220px] flex-none xl:block">
              <Box className="mb-4 h-3 w-24 rounded" />
              <Box className="mb-3 h-3 w-full rounded" />
              <Box className="mb-3 h-3 w-5/6 rounded" />
              <Box className="mb-3 h-3 w-4/6 rounded" />
            </div>
            <div className="w-full min-w-0 xl:flex-1">
              <div className="mx-auto max-w-[800px] xl:mx-0">
                {["w-full", "w-full", "w-11/12", "w-2/3"].map((w, i) => (
                  <Box key={`a${i}`} className={`mb-4 h-4 ${w} rounded`} />
                ))}
                <Box className="my-8 aspect-[16/9] w-full rounded-[var(--ac-radius)]" />
                {["w-full", "w-full", "w-10/12", "w-full", "w-3/4"].map((w, i) => (
                  <Box key={`b${i}`} className={`mb-4 h-4 ${w} rounded`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function ArticlesSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header panel */}
      <div
        style={{
          paddingLeft: "var(--box-margin)",
          paddingRight: "var(--box-margin)",
          paddingTop: "var(--box-margin)",
        }}
      >
        <div className={PANEL} style={{ maxWidth: "var(--maxw)" }}>
          <FauxNavbar />
          <div
            style={{
              paddingLeft: "var(--page-px)",
              paddingRight: "var(--page-px)",
              paddingTop: "clamp(8px,2vw,20px)",
              paddingBottom: "clamp(28px,5vw,56px)",
            }}
          >
            <Box className="mb-5 h-3 w-20 rounded" />
            <Box className="mb-4 h-12 w-full max-w-[420px] rounded-lg" />
            <Box className="h-4 w-full max-w-[520px] rounded" />
          </div>
        </div>
      </div>

      <main className="mx-auto pt-8 md:pt-12" style={SECTION}>
        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ECEFEF] pb-7 pt-2 md:pb-10">
          <div className="flex flex-wrap gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <Box key={i} className="h-9 w-20 rounded-full" />
            ))}
          </div>
          <Box className="h-11 w-[200px] rounded-full" />
        </div>

        {/* Grid */}
        <div className="py-8 md:py-14">
          <Box className="mb-6 h-3 w-24 rounded" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#ECEFEF] bg-white"
              >
                <Box className="aspect-[16/10] w-full" />
                <div className="flex flex-1 flex-col p-5">
                  <Box className="mb-3 h-6 w-20 rounded-full" />
                  <Box className="mb-2.5 h-6 w-3/4 rounded" />
                  <Box className="mb-2 h-4 w-full rounded" />
                  <Box className="mb-4 h-4 w-5/6 rounded" />
                  <Box className="h-3 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
