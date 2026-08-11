// apps/web/src/components/FormulaPDF.jsx
//
// Install: npm install @react-pdf/renderer
//
// Consumes the exact shape returned by your formula generation service:
// {
//   id, bottleSizeMl, totalConcentrateMl, engineSource, reasoning, createdAt,
//   formulaNotes: [{ id, percentage, ml, drops, note: { name, layer } }, ...]
// }

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Formula } from "../types/types";

Font.register({
  family: "Times-Roman",
  src: "/fonts/times.ttf", // Ensure this resolves to a valid .ttf or .otf path
});
// @react-pdf/renderer needs actual .ttf files (no Google Fonts CDN support).
// Download Times-Roman + Times-Roman from fonts.google.com and place them
// in apps/web/public/fonts/ — paths below assume that location.

// Your existing brand tokens (wn-gold, wn-cream) from the product page work
const COLORS = {
  espresso: "#3D2B1F",
  cream: "#FAF7F2",
  gold: "#C4963A",
  hairline: "#E5DDD0",
  muted: "#8A7B6C",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.cream,
    padding: 48,
    fontFamily: "Times-Roman",
    color: COLORS.espresso,
  },
  brandName: {
    fontFamily: "Times-Roman",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 2,
  },
  brandSubtitle: {
    fontSize: 9,
    textAlign: "center",
    letterSpacing: 2,
    color: COLORS.gold,
    marginBottom: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gold,
    marginBottom: 24,
  },
  formulaId: {
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 16,
  },
  description: {
    fontFamily: "Times-Roman",
    fontSize: 13,
    lineHeight: 1.6,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 12,
    color: COLORS.gold,
  },
  noteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.hairline,
  },
  noteName: { fontSize: 11 },
  noteAmount: { fontSize: 11, color: COLORS.gold },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.espresso,
  },
  totalLabel: { fontSize: 11, fontWeight: 500 },
  totalValue: { fontSize: 11, fontWeight: 500 },
  footer: {
    marginTop: 36,
    textAlign: "center",
    fontSize: 9,
    color: COLORS.muted,
  },
});

export function FormulaPDF({ formula }: { formula: Formula }) {
  const { id, bottleSizeMl, totalConcentrateMl, reasoning, notes, createdAt } =
    formula;

  const formulaIdLabel = `FORMULA ID: WN-${new Date(createdAt).getFullYear()}-${String(id).padStart(4, "0")}`;
  const dateLabel = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.brandName}>Wanaromah</Text>
        <Text style={styles.brandSubtitle}>THE BLENDING ROOM</Text>
        <View style={styles.divider} />

        <Text style={styles.formulaId}>{formulaIdLabel}</Text>

        {/* reasoning comes straight from the selector's NoteSelectionResult —
            works whether it was AI-generated prose or the rules engine's
            plain-language summary */}
        {reasoning ? (
          <Text style={styles.description}>"{reasoning}"</Text>
        ) : null}

        <Text style={styles.sectionTitle}>YOUR FORMULA — {bottleSizeMl}ML</Text>

        {/* formulaNotes is already ordered top -> middle -> base from
            generateFormula(), so no re-sorting needed here */}
        {notes.map((fn) => (
          <View key={fn.id} style={styles.noteRow} wrap={false}>
            <Text style={styles.noteName}>{fn.noteName}</Text>
            <Text style={styles.noteAmount}>
              {Number(fn.ml).toFixed(2)}ml · {fn.drops} drops
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Fragrance Concentrate</Text>
          <Text style={styles.totalValue}>
            {Number(totalConcentrateMl).toFixed(2)}ml
          </Text>
        </View>

        <Text style={styles.footer}>
          Thank you for visiting Wanaromah{"\n"}Date: {dateLabel}
        </Text>
      </Page>
    </Document>
  );
}
