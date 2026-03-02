import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Resume } from "@/features/resumes/model/Resume";
import { BulletList, MaybeLink, Section } from "@/features/templates/pdf/common";

const s = StyleSheet.create({
  page: { paddingTop: 38, paddingHorizontal: 42, paddingBottom: 44, color: "#111827" },
  name: { fontSize: 20, fontWeight: 700, textAlign: "center" as const },
  meta: { marginTop: 8, fontSize: 10, textAlign: "center" as const, color: "#374151" },
  rule: { marginTop: 12, borderTopWidth: 1, borderTopColor: "#d1d5db" },
  expTop: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  left: { flex: 1 },
  title: { fontSize: 11, fontWeight: 600 },
  sub: { fontSize: 10, color: "#374151", marginTop: 1 },
  dates: { fontSize: 10, color: "#374151" },
});

export function ClassicPdf(resume: Resume) {
  const name = `${resume.basics.firstName} ${resume.basics.lastName}`.trim() || "Your Name";
  const metaPieces = [
    resume.basics.email.trim(),
    resume.basics.phone.trim(),
    resume.basics.location.trim(),
    resume.basics.website.trim(),
    resume.basics.linkedin.trim(),
    resume.basics.github.trim(),
  ].filter(Boolean);

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <Text style={s.name}>{name}</Text>
        {!!resume.basics.headline.trim() && <Text style={s.meta}>{resume.basics.headline.trim()}</Text>}
        {metaPieces.length > 0 && (
          <Text style={s.meta}>
            {metaPieces.map((p, i) => (
              <Text key={`${i}-${p}`}>
                {i > 0 ? " | " : ""}
                {p.includes(".") && !p.includes("@") ? <MaybeLink>{p}</MaybeLink> : p}
              </Text>
            ))}
          </Text>
        )}
        <View style={s.rule} />

        {!!resume.summary.trim() && (
          <Section title="Profile">
            <Text style={{ fontSize: 10, lineHeight: 1.45 }}>{resume.summary.trim()}</Text>
          </Section>
        )}

        <Section title="Professional Experience">
          {resume.experience
            .filter((e) => e.company.trim() || e.title.trim() || e.bullets.some((b) => b.trim()))
            .map((e) => (
              <View key={e.id} style={{ marginBottom: 10 }}>
                <View style={s.expTop}>
                  <View style={s.left}>
                    <Text style={s.title}>{[e.title.trim(), e.company.trim()].filter(Boolean).join(", ") || "Role, Company"}</Text>
                    <Text style={s.sub}>{[e.location.trim(), ""].filter(Boolean).join("")}</Text>
                  </View>
                  <Text style={s.dates}>{[e.start.trim(), e.end.trim()].filter(Boolean).join(" - ")}</Text>
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
                <View style={s.expTop}>
                  <View style={s.left}>
                    <Text style={s.title}>{ed.school.trim() || "School"}</Text>
                    <Text style={s.sub}>{[ed.degree.trim(), ed.location.trim()].filter(Boolean).join(", ")}</Text>
                  </View>
                  <Text style={s.dates}>{[ed.start.trim(), ed.end.trim()].filter(Boolean).join(" - ")}</Text>
                </View>
                {!!ed.details.trim() && <Text style={{ marginTop: 4, fontSize: 10, lineHeight: 1.45 }}>{ed.details.trim()}</Text>}
              </View>
            ))}
        </Section>

        <Section title="Skills">
          <Text style={{ fontSize: 10, lineHeight: 1.45, color: "#111827" }}>
            {resume.skills
              .flatMap((g) => g.items.map((x) => x.trim()).filter(Boolean))
              .filter(Boolean)
              .join(", ")}
          </Text>
        </Section>
      </Page>
    </Document>
  );
}
