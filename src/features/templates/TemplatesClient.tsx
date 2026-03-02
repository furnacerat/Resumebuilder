"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { templates } from "@/features/templates/registry";

export function TemplatesClient() {
  return (
    <div className="min-h-dvh bg-[#fbfbfa]">
      <AppHeader />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Templates</h1>
            <p className="mt-1 text-sm text-slate-600">Pick the layout you want for your PDF.</p>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            href="/builder"
          >
            Open builder
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.id} className="flex flex-col gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                <div className="mt-1 text-sm text-slate-600">{t.description}</div>
              </div>
              <div className="mt-auto text-xs text-slate-500">Template id: {t.id}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
