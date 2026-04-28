import TableOfContents from "./TableOfContents";

interface PostContentProps {
  excerpt: string | null;
  contentWithIds: string;
  headings: Array<{ id: string; text: string; level: number }>;
  showTOC?: boolean;
}

export default function PostContent({
  excerpt,
  contentWithIds,
  headings,
  showTOC = true,
}: PostContentProps) {
  return (
    <div
      className="max-w-[1400px] mx-auto"
      style={{
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
        paddingTop: "var(--navbar-py)",
        paddingBottom: "var(--navbar-py)",
      }}
    >
      <div className="flex items-start gap-10 xl:gap-14">
        {/* TOC sidebar — sticky, hidden below xl */}
        {showTOC && <TableOfContents headings={headings} />}

        {/* Article */}
        <div className="flex-1 min-w-0">
          <div
            className="bg-white rounded-[20px]"
            style={{ padding: "clamp(1.25rem,3vw,2rem)" }}
          >
            {excerpt && (
              <p
                className="font-sans text-[#54505B] mb-8 pl-5"
                style={{ fontSize: "1.125rem", lineHeight: 1.7, fontStyle: "italic", borderLeft: "4px solid var(--highlight)" }}
              >
                {excerpt}
              </p>
            )}

            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
