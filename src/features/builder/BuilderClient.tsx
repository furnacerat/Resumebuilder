"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/Button";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { Resume, ResumeEducation, ResumeExperience, ResumeSkillGroup } from "@/features/resumes/model/Resume";
import { createEmptyResume } from "@/features/resumes/model/defaults";
import {
  getActiveResumeId,
  getResume,
  putResume,
  setActiveResumeId,
} from "@/features/resumes/storage/resumeStore";
import { uid } from "@/lib/utils/ids";
import { templates } from "@/features/templates/registry";
import { downloadResumePdf } from "@/features/export/pdf/downloadPdf";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
      </div>
    </div>
  );
}

export function BuilderClient() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const canDownload = useMemo(() => {
    if (!resume) return false;
    return Boolean((resume.basics.firstName + resume.basics.lastName).trim() || resume.basics.email.trim());
  }, [resume]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setStatus("loading");
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id") || getActiveResumeId();
        if (id) {
          const existing = await getResume(id);
          if (existing) {
            if (cancelled) return;
            setActiveResumeId(existing.id);
            setResume(existing);
            setStatus("ready");
            return;
          }
        }

        const created = createEmptyResume();
        await putResume(created);
        setActiveResumeId(created.id);
        if (cancelled) return;
        setResume(created);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setErrorMsg(e instanceof Error ? e.message : "Failed to load resume");
        setStatus("error");
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useDebouncedEffect(
    () => {
      if (!resume) return;
      setStatus("saving");
      putResume({ ...resume, updatedAt: Date.now() })
        .then(() => setStatus("ready"))
        .catch((e) => {
          setErrorMsg(e instanceof Error ? e.message : "Failed to save");
          setStatus("error");
        });
    },
    500,
    [resume],
  );

  const update = (fn: (r: Resume) => Resume) => {
    setResume((prev) => (prev ? fn(prev) : prev));
  };

  const newResume = async () => {
    const created = createEmptyResume();
    await putResume(created);
    setActiveResumeId(created.id);
    setResume(created);
  };

  const addExperience = () => {
    update((r) => ({
      ...r,
      experience: [
        ...r.experience,
        { id: uid(), company: "", title: "", location: "", start: "", end: "", bullets: [""] },
      ],
    }));
  };

  const removeExperience = (id: string) => {
    update((r) => ({ ...r, experience: r.experience.filter((e) => e.id !== id) }));
  };

  const addEducation = () => {
    update((r) => ({
      ...r,
      education: [
        ...r.education,
        { id: uid(), school: "", degree: "", location: "", start: "", end: "", details: "" },
      ],
    }));
  };

  const removeEducation = (id: string) => {
    update((r) => ({ ...r, education: r.education.filter((e) => e.id !== id) }));
  };

  const addSkillGroup = () => {
    update((r) => ({ ...r, skills: [...r.skills, { id: uid(), label: "Skills", items: [""] }] }));
  };

  const removeSkillGroup = (id: string) => {
    update((r) => ({ ...r, skills: r.skills.filter((g) => g.id !== id) }));
  };

  if (status === "loading" || !resume) {
    return (
      <div className="min-h-dvh bg-[#fbfbfa]">
        <AppHeader />
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-600">Loading...</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-dvh bg-[#fbfbfa]">
        <AppHeader />
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Card>
            <div className="text-sm font-semibold text-slate-900">Something went wrong</div>
            <div className="mt-2 text-sm text-slate-600">{errorMsg || "Unknown error"}</div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => window.location.reload()}>Reload</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#fbfbfa]">
      <AppHeader />

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <Card>
            <SectionTitle title="Basics" subtitle="The essentials hiring managers look for first." />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="First name">
                <Input
                  value={resume.basics.firstName}
                  onChange={(e) => update((r) => ({ ...r, basics: { ...r.basics, firstName: e.target.value } }))}
                  placeholder="Harold"
                />
              </Field>
              <Field label="Last name">
                <Input
                  value={resume.basics.lastName}
                  onChange={(e) => update((r) => ({ ...r, basics: { ...r.basics, lastName: e.target.value } }))}
                  placeholder="Foster"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Headline">
                  <Input
                    value={resume.basics.headline}
                    onChange={(e) => update((r) => ({ ...r, basics: { ...r.basics, headline: e.target.value } }))}
                    placeholder="Software Engineer | React | Node"
                  />
                </Field>
              </div>
              <Field label="Email">
                <Input
                  value={resume.basics.email}
                  onChange={(e) => update((r) => ({ ...r, basics: { ...r.basics, email: e.target.value } }))}
                  placeholder="name@email.com"
                />
              </Field>
              <Field label="Phone">
                <Input
                  value={resume.basics.phone}
                  onChange={(e) => update((r) => ({ ...r, basics: { ...r.basics, phone: e.target.value } }))}
                  placeholder="(555) 555-5555"
                />
              </Field>
              <Field label="Location">
                <Input
                  value={resume.basics.location}
                  onChange={(e) => update((r) => ({ ...r, basics: { ...r.basics, location: e.target.value } }))}
                  placeholder="Austin, TX"
                />
              </Field>
              <Field label="Website">
                <Input
                  value={resume.basics.website}
                  onChange={(e) => update((r) => ({ ...r, basics: { ...r.basics, website: e.target.value } }))}
                  placeholder="yourname.com"
                />
              </Field>
              <Field label="LinkedIn">
                <Input
                  value={resume.basics.linkedin}
                  onChange={(e) => update((r) => ({ ...r, basics: { ...r.basics, linkedin: e.target.value } }))}
                  placeholder="linkedin.com/in/yourname"
                />
              </Field>
              <Field label="GitHub">
                <Input
                  value={resume.basics.github}
                  onChange={(e) => update((r) => ({ ...r, basics: { ...r.basics, github: e.target.value } }))}
                  placeholder="github.com/yourname"
                />
              </Field>
            </div>
          </Card>

          <Card>
            <SectionTitle title="Summary" subtitle="2-4 lines highlighting your impact and strengths." />
            <div className="mt-5">
              <Textarea
                value={resume.summary}
                onChange={(e) => update((r) => ({ ...r, summary: e.target.value }))}
                placeholder="Product-focused engineer with 6+ years building web apps..."
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-4">
              <SectionTitle title="Experience" subtitle="Add roles and bullet points (outcomes first)." />
              <SecondaryButton onClick={addExperience}>Add role</SecondaryButton>
            </div>

            <div className="mt-5 grid gap-5">
              {resume.experience.map((exp, idx) => (
                <ExperienceEditor
                  key={exp.id}
                  index={idx}
                  value={exp}
                  onChange={(next) =>
                    update((r) => ({
                      ...r,
                      experience: r.experience.map((e) => (e.id === exp.id ? next : e)),
                    }))
                  }
                  onRemove={() => removeExperience(exp.id)}
                />
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-4">
              <SectionTitle title="Education" subtitle="Degrees, bootcamps, certificates." />
              <SecondaryButton onClick={addEducation}>Add</SecondaryButton>
            </div>

            <div className="mt-5 grid gap-5">
              {resume.education.map((ed, idx) => (
                <EducationEditor
                  key={ed.id}
                  index={idx}
                  value={ed}
                  onChange={(next) =>
                    update((r) => ({
                      ...r,
                      education: r.education.map((e) => (e.id === ed.id ? next : e)),
                    }))
                  }
                  onRemove={() => removeEducation(ed.id)}
                />
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-4">
              <SectionTitle title="Skills" subtitle="Keep it skimmable. Group by category." />
              <SecondaryButton onClick={addSkillGroup}>Add group</SecondaryButton>
            </div>

            <div className="mt-5 grid gap-5">
              {resume.skills.map((g, idx) => (
                <SkillGroupEditor
                  key={g.id}
                  index={idx}
                  value={g}
                  onChange={(next) =>
                    update((r) => ({
                      ...r,
                      skills: r.skills.map((x) => (x.id === g.id ? next : x)),
                    }))
                  }
                  onRemove={() => removeSkillGroup(g.id)}
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="grid content-start gap-6">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">Actions</div>
                <div className="mt-1 text-xs text-slate-600">Autosaves locally. No account required.</div>
              </div>
              <div className="text-xs text-slate-500">{status === "saving" ? "Saving..." : ""}</div>
            </div>

            <div className="mt-4 grid gap-2">
              <Button
                disabled={!canDownload}
                onClick={() => downloadResumePdf(resume)}
                title={canDownload ? "" : "Add at least a name or email first"}
              >
                Download PDF
              </Button>
              <SecondaryButton onClick={newResume}>New resume</SecondaryButton>
              <SecondaryButton
                onClick={async () => {
                  await putResume({ ...resume, updatedAt: Date.now() });
                }}
              >
                Save now
              </SecondaryButton>
            </div>
          </Card>

          <Card>
            <div className="text-sm font-semibold text-slate-900">Template</div>
            <div className="mt-1 text-xs text-slate-600">Pick a layout for the PDF.</div>
            <div className="mt-4 grid gap-2">
              {templates.map((t) => (
                <label
                  key={t.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition-colors ${
                    resume.templateId === t.id ? "border-slate-900/25 bg-slate-900/5" : "border-slate-900/10 bg-white hover:bg-slate-50"
                  }`}
                >
                  <input
                    className="mt-1"
                    type="radio"
                    name="template"
                    checked={resume.templateId === t.id}
                    onChange={() => update((r) => ({ ...r, templateId: t.id }))}
                  />
                  <span className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-900">{t.name}</span>
                    <span className="text-xs text-slate-600">{t.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ExperienceEditor({
  index,
  value,
  onChange,
  onRemove,
}: {
  index: number;
  value: ResumeExperience;
  onChange: (next: ResumeExperience) => void;
  onRemove: () => void;
}) {
  const set = (patch: Partial<ResumeExperience>) => onChange({ ...value, ...patch });
  const setBullet = (i: number, text: string) => {
    const next = [...value.bullets];
    next[i] = text;
    set({ bullets: next });
  };
  const addBullet = () => set({ bullets: [...value.bullets, ""] });
  const removeBullet = (i: number) => set({ bullets: value.bullets.filter((_, idx) => idx !== i) });

  return (
    <div className="rounded-2xl border border-slate-900/10 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm font-semibold text-slate-900">Role {index + 1}</div>
        <button
          className="text-xs font-semibold text-rose-700 hover:text-rose-800"
          onClick={onRemove}
          type="button"
        >
          Remove
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <Input value={value.title} onChange={(e) => set({ title: e.target.value })} placeholder="Senior Developer" />
        </Field>
        <Field label="Company">
          <Input value={value.company} onChange={(e) => set({ company: e.target.value })} placeholder="Acme Corp" />
        </Field>
        <Field label="Location">
          <Input value={value.location} onChange={(e) => set({ location: e.target.value })} placeholder="Remote" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start">
            <Input value={value.start} onChange={(e) => set({ start: e.target.value })} placeholder="2021" />
          </Field>
          <Field label="End">
            <Input value={value.end} onChange={(e) => set({ end: e.target.value })} placeholder="Present" />
          </Field>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <Label>Bullets</Label>
          <SecondaryButton className="h-9" onClick={addBullet} type="button">
            Add bullet
          </SecondaryButton>
        </div>
        <div className="mt-2 grid gap-2">
          {value.bullets.map((b, i) => (
            <div key={`${value.id}-b-${i}`} className="flex gap-2">
              <Input
                value={b}
                onChange={(e) => setBullet(i, e.target.value)}
                placeholder="Built X that improved Y by Z%"
              />
              <button
                className="h-10 rounded-xl border border-slate-900/15 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => removeBullet(i)}
                type="button"
                title="Remove bullet"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EducationEditor({
  index,
  value,
  onChange,
  onRemove,
}: {
  index: number;
  value: ResumeEducation;
  onChange: (next: ResumeEducation) => void;
  onRemove: () => void;
}) {
  const set = (patch: Partial<ResumeEducation>) => onChange({ ...value, ...patch });
  return (
    <div className="rounded-2xl border border-slate-900/10 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm font-semibold text-slate-900">Education {index + 1}</div>
        <button className="text-xs font-semibold text-rose-700 hover:text-rose-800" onClick={onRemove} type="button">
          Remove
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="School">
          <Input value={value.school} onChange={(e) => set({ school: e.target.value })} placeholder="University" />
        </Field>
        <Field label="Degree">
          <Input value={value.degree} onChange={(e) => set({ degree: e.target.value })} placeholder="B.S. Computer Science" />
        </Field>
        <Field label="Location">
          <Input value={value.location} onChange={(e) => set({ location: e.target.value })} placeholder="City, ST" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start">
            <Input value={value.start} onChange={(e) => set({ start: e.target.value })} placeholder="2017" />
          </Field>
          <Field label="End">
            <Input value={value.end} onChange={(e) => set({ end: e.target.value })} placeholder="2021" />
          </Field>
        </div>
      </div>

      <div className="mt-4">
        <Field label="Details">
          <Textarea value={value.details} onChange={(e) => set({ details: e.target.value })} placeholder="Honors, GPA, relevant coursework..." />
        </Field>
      </div>
    </div>
  );
}

function SkillGroupEditor({
  index,
  value,
  onChange,
  onRemove,
}: {
  index: number;
  value: ResumeSkillGroup;
  onChange: (next: ResumeSkillGroup) => void;
  onRemove: () => void;
}) {
  const set = (patch: Partial<ResumeSkillGroup>) => onChange({ ...value, ...patch });
  const setItem = (i: number, text: string) => {
    const next = [...value.items];
    next[i] = text;
    set({ items: next });
  };
  const addItem = () => set({ items: [...value.items, ""] });
  const removeItem = (i: number) => set({ items: value.items.filter((_, idx) => idx !== i) });

  return (
    <div className="rounded-2xl border border-slate-900/10 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm font-semibold text-slate-900">Group {index + 1}</div>
        <button className="text-xs font-semibold text-rose-700 hover:text-rose-800" onClick={onRemove} type="button">
          Remove
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        <Field label="Label">
          <Input value={value.label} onChange={(e) => set({ label: e.target.value })} placeholder="Skills" />
        </Field>

        <div>
          <div className="flex items-center justify-between gap-3">
            <Label>Items</Label>
            <SecondaryButton className="h-9" onClick={addItem} type="button">
              Add
            </SecondaryButton>
          </div>
          <div className="mt-2 grid gap-2">
            {value.items.map((it, i) => (
              <div key={`${value.id}-i-${i}`} className="flex gap-2">
                <Input value={it} onChange={(e) => setItem(i, e.target.value)} placeholder="React" />
                <button
                  className="h-10 rounded-xl border border-slate-900/15 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => removeItem(i)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-500">Tip: the PDF joins items with commas.</div>
        </div>
      </div>
    </div>
  );
}
