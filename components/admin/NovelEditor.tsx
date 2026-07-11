"use client";

import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";

const lowlight = createLowlight();

interface Props {
  initialContent?: string;
  onChange: (html: string) => void;
}

const ToolbarButton = ({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`rounded-[6px] px-2 py-1 text-sm transition-colors ${
      active
        ? "bg-[var(--ac)] text-white"
        : "text-[#586063] hover:bg-[#F5F7F7]"
    }`}
  >
    {children}
  </button>
);

export default function NovelEditor({ initialContent, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Bắt đầu viết… (Hỗ trợ dán ảnh, liên kết và mã)" }),
    ],
    content: initialContent ?? "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] focus:outline-none prose-content",
        // Tắt gạch chân đỏ (spellcheck của trình duyệt) khi gõ tiếng Việt.
        spellcheck: "false",
      },
    },
  });

  // Subscribe to editor state so the toolbar's active states update on every
  // selection/cursor move (v3 `useEditor` no longer re-renders on transactions).
  const active = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e?.isActive("bold") ?? false,
      italic: e?.isActive("italic") ?? false,
      strike: e?.isActive("strike") ?? false,
      h1: e?.isActive("heading", { level: 1 }) ?? false,
      h2: e?.isActive("heading", { level: 2 }) ?? false,
      h3: e?.isActive("heading", { level: 3 }) ?? false,
      bulletList: e?.isActive("bulletList") ?? false,
      orderedList: e?.isActive("orderedList") ?? false,
      blockquote: e?.isActive("blockquote") ?? false,
      codeBlock: e?.isActive("codeBlock") ?? false,
      code: e?.isActive("code") ?? false,
      link: e?.isActive("link") ?? false,
    }),
  });

  if (!editor || !active) return null;

  function addImage() {
    const url = window.prompt("Đường dẫn ảnh:");
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }

  function setLink() {
    const url = window.prompt("Đường dẫn liên kết:", editor?.getAttributes("link").href);
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
    } else {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }

  return (
    <div className="flex flex-col">
      {/* Bubble menu — floats next to the text selection so formatting is always
          within reach, no matter how far you've scrolled. */}
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-0.5 rounded-[10px] border border-[#E6EAEA] bg-white p-1 shadow-card-lift"
      >
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={active.bold} title="Đậm">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={active.italic} title="Nghiêng">
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={active.strike} title="Gạch ngang">
          <s>S</s>
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-[#E6EAEA]" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={active.h2} title="Tiêu đề">
          H2
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={active.blockquote} title="Trích dẫn">
          ❝
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={active.code} title="Mã nội dòng">
          {"`code`"}
        </ToolbarButton>
        <ToolbarButton onClick={setLink} active={active.link} title="Liên kết">
          🔗
        </ToolbarButton>
      </BubbleMenu>

      {/* Toolbar — sticky right below the editor top bar (60px) so it stays
          reachable while writing long posts. */}
      <div className="sticky top-[60px] z-30 -mx-[clamp(16px,4vw,28px)] mb-4 flex flex-wrap items-center gap-1 border-b border-[#ECEFEF] bg-white/95 px-[clamp(16px,4vw,28px)] py-2.5 backdrop-blur">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={active.bold}
          title="Đậm"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={active.italic}
          title="Nghiêng"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={active.strike}
          title="Gạch ngang"
        >
          <s>S</s>
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-[#E6EAEA]" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={active.h1}
          title="Tiêu đề 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={active.h2}
          title="Tiêu đề 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={active.h3}
          title="Tiêu đề 3"
        >
          H3
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-[#E6EAEA]" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={active.bulletList}
          title="Danh sách"
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={active.orderedList}
          title="Danh sách đánh số"
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={active.blockquote}
          title="Trích dẫn"
        >
          ❝
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={active.codeBlock}
          title="Khối mã"
        >
          {"</>"}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={active.code}
          title="Mã nội dòng"
        >
          {"`code`"}
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-[#E6EAEA]" />
        <ToolbarButton onClick={setLink} active={active.link} title="Liên kết">
          🔗
        </ToolbarButton>
        <ToolbarButton onClick={addImage} active={false} title="Ảnh">
          🖼
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-[#E6EAEA]" />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          active={false}
          title="Đường kẻ"
        >
          —
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
