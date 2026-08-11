// apps/web/src/components/FormulaDownloadButton.jsx
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FormulaPDF } from "./formulaPdf";
import { type Formula } from "../types/types.ts";

// `formula` is the exact object your API returns from
// POST /api/formulas/generate or GET /api/formulas/:id
export function FormulaDownloadButton({ formula }: { formula: Formula }) {
  return (
    <PDFDownloadLink
      document={<FormulaPDF formula={formula} />}
      fileName={`wanaromah-formula-${formula.id}.pdf`}
    >
      {({ loading }) => (
        <button className="btn dark" disabled={loading}>
          {loading ? "Preparing your formula…" : "Download Your Formula (PDF)"}
        </button>
      )}
    </PDFDownloadLink>
  );
}

// Alternative: generate the PDF as a Blob without rendering a link at all —
// useful if you want to auto-download on button click, or upload the PDF
// to your backend/Shopify order instead of just letting the user save it.
//
// import { pdf } from "@react-pdf/renderer";
//
// async function generateAndDownload(formula) {
//   const blob = await pdf(<FormulaPDF formula={formula} />).toBlob();
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `wanaromah-formula-${formula.id}.pdf`;
//   link.click();
//   URL.revokeObjectURL(url);
// }
