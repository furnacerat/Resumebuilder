import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Resume } from "@/features/resumes/model/Resume";
import { BulletList, MaybeLink, Section } from "@/features/templates/pdf/common";

const s = StyleSheet.create({
  page: { paddingTop: 40, paddingHorizontal: 40, paddingBottom: 46, color: "#0b1220" },
  topRow: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  name: { fontSize: 18, fontWeight: 700 },
  headline: { marginTop: 2, fontSize: 10, color: "#475569" },
  metaCol: { alignItems: "flex-end" as const, gap: 3 },
  meta: { fontSize: 9.5, color: "#334155" },
});

export function MinimalPdf(resume: Resume) {
  const name = `${resume.basics.firstName} ${resume.basics.lastName}`.trim() || "Your Name";

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{name}</Text>
            {!!resume.basics.headline.trim() && <Text style={s.headline}>{resume.basics.headline.trim()}</Text>}
          </View>
          <View style={s.metaCol}>
            {!!resume.basics.email.trim() && <Text style={s.meta}>{resume.basics.email.trim()}</Text>}
            {!!resume.basics.phone.trim() && <Text style={s.meta}>{resume.basics.phone.trim()}</Text>}
            {!!resume.basics.location.trim() && <Text style={s.meta}>{resume.basics.location.trim()}</Text>}
            {!!resume.basics.website.trim() && (
              <Text style={s.meta}>
                <MaybeLink>{resume.basics.website.trim()}</MaybeLink>
              </Text>
            )}
          </View>
        </View>

        {!!resume.summary.trim() && (
          <Section title="About">
            <Text style={{ fontSize: 10, lineHeight: 1.5, color: "#0b1220" }}>{resume.summary.trim()}</Text>
          </Section>
        )}

        <Section title="Experience">
          {resume.experience
            .filter((e) => e.company.trim() || e.title.trim() || e.bullets.some((b) => b.trim()))
            .map((e) => (
              <View key={e.id} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: 600 }}>
                  {[e.title.trim(), e.company.trim()].filter(Boolean).join(" | ")}
                </Text>
                <Text style={{ marginTop: 2, fontSize: 10, color: "#475569" }}>
                  {[e.location.trim(), [e.start.trim(), e.end.trim()].filter(Boolean).join(" - ")]
                    .filter(Boolean)
                    .join(" | ")}
                </Text>
                <View style={{ marginTop: 6 }}>
                  <BulletList items={e.bullets} />
                </View>
              </View>
            ))}
        </Section>

        <Section title="Education">
          {resume.education
            .filter((ed) => ed.school.trim() || ed.degree.trim())
            .map((ed) => (
              <View key={ed.id} style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: 600 }}>{ed.school.trim() || "School"}</Text>
                <Text style={{ marginTop: 2, fontSize: 10, color: "#475569" }}>
                  {[ed.degree.trim(), ed.location.trim(), [ed.start.trim(), ed.end.trim()].filter(Boolean).join(" - ")]
                    .filter(Boolean)
                    .join(" | ")}
                </Text>
                {!!ed.details.trim() && <Text style={{ marginTop: 4, fontSize: 10, lineHeight: 1.45 }}>{ed.details.trim()}</Text>}
              </View>
            ))}
        </Section>

        <Section title="Skills">
          {resume.skills
            .filter((g) => g.label.trim() || g.items.some((x) => x.trim()))
            .map((g) => (
              <View key={g.id} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: 600 }}>{g.label.trim() || "Skills"}</Text>
                <Text style={{ marginTop: 2, fontSize: 10, color: "#475569", lineHeight: 1.4 }}>
                  {g.items.map((x) => x.trim()).filter(Boolean).join(", ")}
                </Text>
              </View>
            ))}
        </Section>
      </Page>
    </Document>
  );
}
