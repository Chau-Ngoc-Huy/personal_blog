"use client";

import { useState } from "react";

interface Props {
  isOpen: boolean;
  title: string;
  placeholder: string;
  initialValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export default function InputModal({
  isOpen,
  title,
  placeholder,
  initialValue = "",
  onConfirm,
  onCancel,
}: Props) {
  const [value, setValue] = useState(initialValue);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(value);
    setValue("");
  };

  const handleCancel = () => {
    onCancel();
    setValue("");
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[50] bg-black/30"
        onClick={handleCancel}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[51] bg-white rounded-[12px] shadow-lg p-6 w-[90%] max-w-[400px]">
        <div className="mb-4">
          <h2 className="text-[16px] font-[700] text-[#14181A]">{title}</h2>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 border border-[#E6EAEA] rounded-[8px] text-[14px] focus:outline-none focus:border-[#178a5e] caret-[#178a5e]"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleConfirm();
              } else if (e.key === "Escape") {
                handleCancel();
              }
            }}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-[13px] font-[600] text-[#8C9496] border border-[#E6EAEA] rounded-[8px] hover:bg-[#F5F7F7] transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-[13px] font-[700] text-white bg-[#178a5e] rounded-[8px] hover:bg-[#136f4b] transition-colors disabled:opacity-50"
            disabled={!value.trim()}
          >
            Chèn
          </button>
        </div>
      </div>
    </>
  );
}
