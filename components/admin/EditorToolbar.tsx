"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";
import InputModal from "./InputModal";

interface Props {
  editor: Editor | null;
  compact?: boolean;
}

export default function EditorToolbar({ editor, compact = false }: Props) {
  const [linkModal, setLinkModal] = useState({ open: false, initialValue: "" });
  const [imageModal, setImageModal] = useState({ open: false });

  if (!editor) return null;

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
  }) => {
    const baseClasses = compact
      ? "w-6 h-6 rounded-[4px] text-[11px]"
      : "w-7 h-7 rounded-[5px] text-[12px]";

    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={`${baseClasses} bg-transparent text-[#333] hover:bg-[#F1F1F1] transition-colors flex items-center justify-center ${
          active ? "bg-[#E6EAEA]" : ""
        }`}
      >
        {children}
      </button>
    );
  };

  const handleLinkClick = () => {
    setLinkModal({
      open: true,
      initialValue: editor?.getAttributes("link").href || "",
    });
  };

  const handleLinkConfirm = (url: string) => {
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
    } else {
      editor?.chain().focus().setLink({ href: url }).run();
    }
    setLinkModal({ open: false, initialValue: "" });
  };

  const handleImageClick = () => {
    setImageModal({ open: true });
  };

  const handleImageConfirm = (url: string) => {
    if (url) editor?.chain().focus().setImage({ src: url }).run();
    setImageModal({ open: false });
  };

  return (
    <div className="flex items-center gap-1">
      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Đậm"
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Nghiêng"
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Gạch ngang"
      >
        <s>S</s>
      </ToolbarButton>

      <span className="mx-0.5 h-4 w-px bg-[#E6EAEA]" />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        title="Tiêu đề 1"
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Tiêu đề 2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Tiêu đề 3"
      >
        H3
      </ToolbarButton>

      <span className="mx-0.5 h-4 w-px bg-[#E6EAEA]" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Danh sách"
      >
        •
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Danh sách đánh số"
      >
        1.
      </ToolbarButton>

      <span className="mx-0.5 h-4 w-px bg-[#E6EAEA]" />

      {/* Block Quote */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Trích dẫn"
      >
        ❝
      </ToolbarButton>

      {/* Code */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="Khối mã"
      >
        &lt;/&gt;
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Mã nội dòng"
      >
        `
      </ToolbarButton>

      <span className="mx-0.5 h-4 w-px bg-[#E6EAEA]" />

      {/* Links & Media */}
      <ToolbarButton onClick={handleLinkClick} active={editor.isActive("link")} title="Liên kết">
        🔗
      </ToolbarButton>
      <ToolbarButton onClick={handleImageClick} active={false} title="Ảnh">
        🖼
      </ToolbarButton>

      <span className="mx-0.5 h-4 w-px bg-[#E6EAEA]" />

      {/* Horizontal Rule */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        active={false}
        title="Đường kẻ"
      >
        —
      </ToolbarButton>

      <InputModal
        isOpen={linkModal.open}
        title="Chèn liên kết"
        placeholder="https://example.com"
        initialValue={linkModal.initialValue}
        onConfirm={handleLinkConfirm}
        onCancel={() => setLinkModal({ open: false, initialValue: "" })}
      />

      <InputModal
        isOpen={imageModal.open}
        title="Chèn ảnh"
        placeholder="https://example.com/image.jpg"
        onConfirm={handleImageConfirm}
        onCancel={() => setImageModal({ open: false })}
      />
    </div>
  );
}
