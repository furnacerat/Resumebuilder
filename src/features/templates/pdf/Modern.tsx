import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Resume } from "@/features/resumes/model/Resume";
import { BulletList, MaybeLink, Section } from "@/features/templates/pdf/common";

const s = StyleSheet.create({
  page: { paddingTop: 34, paddingHorizontal: 34, paddingBottom: 42, color: "#0f172a" },
  header: { borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 12 },
  name: { fontSize: 22, fontWeight: 700 },
  headline: { marginTop: 3, fontSize: 11, color: "#334155" },
  metaRow: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metaItem: { fontSize: 10, color: "#334155" },
  rowTop: { flexDirection: "row", justifyContent: "space-between" },
  rowTitle: { fontSize: 11, fontWeight: 600 },
  rowSub: { fontSize: 10, color: "#334155", marginTop: 1 },
  rowDates: { fontSize: 10, color: "#334155" },
});

function joinMeta(parts: string[]) {
  return parts.map((p) => p.trim()).filter(Boolean);
}

export function ModernPdf(resume: Resume) {
  const name = `${resume.basics.firstName} ${resume.basics.lastName}`.trim() || "Your Name";

  const meta = joinMeta([
    resume.basics.email,
    resume.basics.phone,
    resume.basics.location,
    resume.basics.website,
    resume.basics.linkedin,
    resume.basics.github,
  ]);

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.header}>
          <Text style={s.name}>{name}</Text>
          {!!resume.basics.headline.trim() && <Text style={s.headline}>{resume.basics.headline.trim()}</Text>}
          <View style={s.metaRow}>
            {meta.map((p) => (
              <Text key={p} style={s.metaItem}>
                {p.includes(".") && !p.includes("@") ? <MaybeLink>{p}</MaybeLink> : p}
              </Text>
            ))}
          </View>
        </View>

        {!!resume.summary.trim() && (
          <Section title="Summary">
            <Text style={{ fontSize: 10, lineHeight: 1.45, color: "#0f172a" }}>{resume.summary.trim()}</Text>
          </Section>
        )}

        <Section title="Experience">
          {resume.experience
            .filter((e) => e.company.trim() || e.title.trim() || e.bullets.some((b) => b.trim()))
            .map((e) => (
              <View key={e.id} style={{ marginBottom: 10 }}>
                <View style={s.rowTop}>
                  <View>
                    <Text style={s.rowTitle}>{e.title.trim() || "Role Title"}</Text>
                    <Text style={s.rowSub}>{[e.company.trim(), e.location.trim()].filter(Boolean).join(" | ") || "Company"}</Text>
                  </View>
                  <Text style={s.rowDates}>{[e.start.trim(), e.end.trim()].filter(Boolean).join(" - ")}</Text>
                </View>
                <View style={{ marginTop: 6 }}>
                  <BulletList items={e.bullets} />
                </View>
              </View>
            ))}
        </Section>

        <Section title="Education">
          {resume.education
            .filter((ed) => ed.school.trim() || ed.degree.trim() || ed.details.trim())
            .map((ed) => (
              <View key={ed.id} style={{ marginBottom: 8 }}>
                <View style={s.rowTop}>
                  <View>
                    <Text style={s.rowTitle}>{ed.school.trim() || "School"}</Text>
                    <Text style={s.rowSub}>{[ed.degree.trim(), ed.location.trim()].filter(Boolean).join(" | ")}</Text>
                  </View>
                  <Text style={s.rowDates}>{[ed.start.trim(), ed.end.trim()].filter(Boolean).join(" - ")}</Text>
                </View>
                {!!ed.details.trim() && (
                  <Text style={{ marginTop: 4, fontSize: 10, color: "#0f172a", lineHeight: 1.4 }}>{ed.details.trim()}</Text>
                )}
              </View>
            ))}
        </Section>

        <Section title="Skills">
          {resume.skills
            .filter((g) => g.label.trim() || g.items.some((x) => x.trim()))
            .map((g) => (
              <View key={g.id} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: 600 }}>{g.label.trim() || "Skills"}</Text>
                <Text style={{ marginTop: 2, fontSize: 10, color: "#334155", lineHeight: 1.4 }}>
                  {g.items.map((x) => x.trim()).filter(Boolean).join(", ")}
                </Text>
              </View>
            ))}
        </Section>
      </Page>
    </Document>
  );
}
