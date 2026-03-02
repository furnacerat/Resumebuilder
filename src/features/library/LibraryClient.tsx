"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import type { Resume } from "@/features/resumes/model/Resume";
import { createEmptyResume } from "@/features/resumes/model/defaults";
import { deleteResume, listResumes, putResume, setActiveResumeId } from "@/features/resumes/storage/resumeStore";

export function LibraryClient() {
  const [items, setItems] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      setItems(await listResumes());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="min-h-dvh bg-[#fbfbfa]">
      <AppHeader />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Library</h1>
            <p className="mt-1 text-sm text-slate-600">Resumes saved locally in this browser.</p>
          </div>
          <Button
            onClick={async () => {
              const created = createEmptyResume();
              await putResume(created);
              setActiveResumeId(created.id);
              window.location.href = `/builder?id=${created.id}`;
            }}
          >
            New resume
          </Button>
        </div>

        <div className="mt-6 grid gap-4">
          {loading ? (
            <Card className="text-sm text-slate-600">Loading...</Card>
          ) : items.length === 0 ? (
            <Card>
              <div className="text-sm font-semibold text-slate-900">No resumes yet</div>
              <div className="mt-2 text-sm text-slate-600">Create one to get started.</div>
              <div className="mt-4">
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                  href="/builder"
                >
                  Open builder
                </Link>
              </div>
            </Card>
          ) : (
            items.map((r) => (
              <Card key={r.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{r.title || "Untitled Resume"}</div>
                  <div className="mt-1 text-xs text-slate-600">
                    Updated {new Date(r.updatedAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                    href={`/builder?id=${r.id}`}
                    onClick={() => setActiveResumeId(r.id)}
                  >
                    Open
                  </Link>
                  <SecondaryButton
                    onClick={async () => {
                      await deleteResume(r.id);
                      await refresh();
                    }}
                  >
                    Delete
                  </SecondaryButton>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
