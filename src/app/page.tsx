import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-dvh bg-[radial-gradient(1200px_500px_at_20%_0%,#dbeafe_0%,transparent_55%),radial-gradient(900px_420px_at_90%_10%,#ffe4e6_0%,transparent_50%),linear-gradient(#fbfbfa,#fbfbfa)]">
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 sm:py-16">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white">
              <span className="text-sm font-semibold tracking-tight">RG</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Resume Generator</div>
              <div className="text-xs text-slate-600">Local-only. PDF export.</div>
            </div>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            <Link className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-900/5" href="/library">
              Library
            </Link>
            <Link className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-900/5" href="/templates">
              Templates
            </Link>
          </nav>
        </header>

        <section className="grid gap-8 rounded-3xl border border-slate-900/10 bg-white/70 p-8 shadow-[0_20px_60px_-30px_rgba(2,6,23,0.35)] backdrop-blur sm:p-10">
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Build a professional resume in minutes.
            </h1>
            <p className="mt-4 text-pretty text-base leading-7 text-slate-700 sm:text-lg">
              Answer a simple set of questions, pick a clean template, and download a polished PDF. Everything stays on your
              device.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              href="/builder"
            >
              Create / Edit Resume
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-900/15 bg-white px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              href="/templates"
            >
              Browse Templates
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-900/10 bg-white p-5">
              <div className="text-sm font-semibold text-slate-900">Local-only</div>
              <div className="mt-1 text-sm leading-6 text-slate-600">Your resumes live in your browser storage.</div>
            </div>
            <div className="rounded-2xl border border-slate-900/10 bg-white p-5">
              <div className="text-sm font-semibold text-slate-900">Templates</div>
              <div className="mt-1 text-sm leading-6 text-slate-600">Multiple professional layouts for different styles.</div>
            </div>
            <div className="rounded-2xl border border-slate-900/10 bg-white p-5">
              <div className="text-sm font-semibold text-slate-900">One-click PDF</div>
              <div className="mt-1 text-sm leading-6 text-slate-600">Download a clean, ATS-friendly PDF.</div>
            </div>
          </div>
        </section>

        <footer className="text-xs text-slate-500">
          Tip (macOS): In Safari, use Share {">"} Add to Dock to install as an app.
        </footer>
      </main>
    </div>
  );
}
