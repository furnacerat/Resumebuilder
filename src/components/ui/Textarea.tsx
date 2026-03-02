import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-24 w-full resize-y rounded-xl border border-slate-900/15 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-900/35 focus:outline-none focus:ring-4 focus:ring-slate-900/10 ${className}`}
      {...props}
    />
  );
}
