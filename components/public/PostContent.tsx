import TableOfContents from "./TableOfContents";

interface PostContentProps {
  contentWithIds: string;
  headings: Array<{ id: string; text: string; level: number }>;
  showTOC?: boolean;
}

export default function PostContent({ contentWithIds, headings, showTOC = true }: PostContentProps) {
  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: "1240px",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
        paddingTop: "clamp(28px,5vw,56px)",
        paddingBottom: "clamp(40px,6vw,80px)",
      }}
    >
      <div className="flex flex-col items-start gap-10 xl:flex-row xl:gap-14">
        {showTOC && <TableOfContents headings={headings} />}

        <article className="w-full min-w-0 xl:flex-1">
          <div
            className="prose-content mx-auto max-w-[800px] xl:mx-0"
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />
        </article>
      </div>
    </div>
  );
}
