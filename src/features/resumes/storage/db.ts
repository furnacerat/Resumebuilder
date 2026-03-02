import { openDB, type DBSchema } from "idb";
import type { Resume } from "@/features/resumes/model/Resume";

type ResumeDbV1 = DBSchema & {
  resumes: {
    key: string;
    value: Resume;
    indexes: { updatedAt: number };
  };
  meta: {
    key: string;
    value: { key: string; value: string };
  };
};

export async function getDb() {
  return openDB<ResumeDbV1>("resume-generator", 1, {
    upgrade(db) {
      const resumes = db.createObjectStore("resumes", { keyPath: "id" });
      resumes.createIndex("updatedAt", "updatedAt");
      db.createObjectStore("meta", { keyPath: "key" });
    },
  });
}
