import { Link, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

export function MaybeLink({ href, children }: { href?: string; children: string }) {
  const v = (children ?? "").trim();
  const url = (href ?? v).trim();
  if (!v) return null;
  if (!url) return <Text>{v}</Text>;
  const normalized = url.startsWith("http") ? url : `https://${url}`;
  return <Link src={normalized}>{v}</Link>;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={{ fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase" as const, opacity: 0.85 }}>
        {title}
      </Text>
      <View style={{ marginTop: 6 }}>{children}</View>
    </View>
  );
}

export function BulletList({ items }: { items: string[] }) {
  const clean = (items ?? []).map((s) => s.trim()).filter(Boolean);
  if (!clean.length) return null;
  return (
    <View style={{ gap: 3 }}>
      {clean.map((t, i) => (
        <View key={`${i}-${t.slice(0, 12)}`} style={{ flexDirection: "row" as const, gap: 6 }}>
          <Text style={{ fontSize: 10, lineHeight: 1.35 }}>-</Text>
          <Text style={{ fontSize: 10, lineHeight: 1.35, flex: 1 }}>{t}</Text>
        </View>
      ))}
    </View>
  );
}
