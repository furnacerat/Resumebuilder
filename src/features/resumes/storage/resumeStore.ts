import type { Resume } from "@/features/resumes/model/Resume";
import { getDb } from "@/features/resumes/storage/db";

const ACTIVE_RESUME_ID_KEY = "activeResumeId";

export function getActiveResumeId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_RESUME_ID_KEY);
}

export function setActiveResumeId(id: string) {
  window.localStorage.setItem(ACTIVE_RESUME_ID_KEY, id);
}

export async function putResume(resume: Resume) {
  const db = await getDb();
  await db.put("resumes", resume);
}

export async function getResume(id: string): Promise<Resume | undefined> {
  const db = await getDb();
  return db.get("resumes", id);
}

export async function listResumes(): Promise<Resume[]> {
  const db = await getDb();
  const index = db.transaction("resumes").store.index("updatedAt");
  const all = await index.getAll();
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function deleteResume(id: string) {
  const db = await getDb();
  await db.delete("resumes", id);
  const active = getActiveResumeId();
  if (active === id) window.localStorage.removeItem(ACTIVE_RESUME_ID_KEY);
}
