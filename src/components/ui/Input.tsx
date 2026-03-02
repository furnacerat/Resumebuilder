import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-10 w-full rounded-xl border border-slate-900/15 bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-900/35 focus:outline-none focus:ring-4 focus:ring-slate-900/10 ${className}`}
      {...props}
    />
  );
}
