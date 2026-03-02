import Link from "next/link";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-900/10 bg-[#fbfbfa]/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
            <span className="text-xs font-semibold tracking-tight">RG</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Resume Generator</div>
            <div className="text-xs text-slate-600">Local-only. PDF export.</div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-900/5" href="/builder">
            Builder
          </Link>
          <Link className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-900/5" href="/templates">
            Templates
          </Link>
          <Link className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-900/5" href="/library">
            Library
          </Link>
        </nav>
      </div>
    </header>
  );
}
